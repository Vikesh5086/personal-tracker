import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  onSnapshot,
} from 'firebase/firestore';
import { db as localDb, saveDailyLog, saveProfile, getAllDailyLogs, getProfile } from './db';
import { DailyLog, UserProfile } from '../types';

export interface FirebaseConfigParams {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// 1. Resolve Firebase Configuration (LocalStorage override -> Vite env vars -> Default project config)
export function getFirebaseConfig(): FirebaseConfigParams | null {
  // Check custom user override in localStorage first
  const localSaved = localStorage.getItem('user_firebase_config');
  if (localSaved) {
    try {
      const parsed = JSON.parse(localSaved);
      if (parsed.apiKey && parsed.projectId) {
        return parsed;
      }
    } catch (e) {
      console.error(e);
    }
  }

  const config: FirebaseConfigParams = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBNsxHgtdLhQ_8PAEnYL_RndElsNoHmbD8',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'personal-tracker-44653.firebaseapp.com',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'personal-tracker-44653',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'personal-tracker-44653.firebasestorage.app',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '752576248392',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:752576248392:web:8e5afb188e7c8f769c767d',
  };

  if (config.apiKey && config.projectId) {
    return config;
  }

  return null;
}

// Save and clear manual Firebase Config
export function saveFirebaseConfig(config: FirebaseConfigParams) {
  localStorage.setItem('user_firebase_config', JSON.stringify(config));
  appInstance = null;
  authInstance = null;
  firestoreInstance = null;
}

export function clearFirebaseConfig() {
  localStorage.removeItem('user_firebase_config');
  appInstance = null;
  authInstance = null;
  firestoreInstance = null;
}

// 2. Initialize Firebase Instance
let appInstance: any = null;
let authInstance: any = null;
let firestoreInstance: any = null;

export function initFirebase() {
  const config = getFirebaseConfig();
  if (!config) return null;

  try {
    if (!getApps().length) {
      appInstance = initializeApp(config);
    } else {
      appInstance = getApp();
    }
    authInstance = getAuth(appInstance);
    firestoreInstance = getFirestore(appInstance);
    return { app: appInstance, auth: authInstance, firestore: firestoreInstance };
  } catch (err) {
    console.error('Firebase initialization error:', err);
    return null;
  }
}

// 3. Google Sign-In & Sign-Out
export async function loginWithGoogle(): Promise<User | null> {
  const fb = initFirebase();
  if (!fb || !authInstance) {
    throw new Error('Firebase is not configured yet. Please enter your Firebase project keys in Settings.');
  }

  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(authInstance, provider);
  return result.user;
}

export async function logoutUser(): Promise<void> {
  if (authInstance) {
    await signOut(authInstance);
  }
}

// 4. Two-Way Cloud Synchronization Engine
export async function syncLocalToCloud(userId: string): Promise<number> {
  const fb = initFirebase();
  if (!fb || !firestoreInstance) return 0;

  try {
    // 1. Sync Profile
    const profile = await getProfile();
    if (profile) {
      await setDoc(doc(firestoreInstance, 'users', userId), {
        ...profile,
        lastCloudSync: new Date().toISOString(),
      }, { merge: true });
    }

    // 2. Sync all local Daily Logs
    const localLogs = await getAllDailyLogs();
    for (const log of localLogs) {
      await setDoc(
        doc(firestoreInstance, 'users', userId, 'dailyLogs', log.date),
        log,
        { merge: true }
      );
    }

    return localLogs.length;
  } catch (err) {
    console.error('Error uploading local data to cloud:', err);
    throw err;
  }
}

export async function syncCloudToLocal(userId: string): Promise<number> {
  const fb = initFirebase();
  if (!fb || !firestoreInstance) return 0;

  try {
    // 1. Fetch Cloud Profile
    const profileSnap = await getDoc(doc(firestoreInstance, 'users', userId));
    if (profileSnap.exists()) {
      const data = profileSnap.data() as UserProfile;
      await saveProfile(data);
    }

    // 2. Fetch all Cloud Daily Logs
    const logsCol = collection(firestoreInstance, 'users', userId, 'dailyLogs');
    const logsSnap = await getDocs(logsCol);
    let count = 0;

    for (const d of logsSnap.docs) {
      const logData = d.data() as DailyLog;
      await localDb.dailyLogs.put(logData);
      count++;
    }

    return count;
  } catch (err) {
    console.error('Error downloading cloud data to local:', err);
    throw err;
  }
}

// Sync a single DailyLog to the cloud directly (for instant live sync on habit change)
export async function syncSingleLogToCloud(userId: string, log: DailyLog): Promise<void> {
  const fb = initFirebase();
  if (!fb || !firestoreInstance) return;
  try {
    await setDoc(doc(firestoreInstance, 'users', userId, 'dailyLogs', log.date), log, { merge: true });
  } catch (err) {
    console.error('Failed to sync single log to cloud:', err);
  }
}

// Observe Auth changes
export function observeAuthState(callback: (user: User | null) => void): () => void {
  const fb = initFirebase();
  if (!fb || !authInstance) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(authInstance, (user) => {
    callback(user);
  });
}

// Real-time Cloud Snapshot listener
export function listenToCloudChanges(userId: string, onUpdate: () => void): () => void {
  const fb = initFirebase();
  if (!fb || !firestoreInstance) return () => {};

  const logsCol = collection(firestoreInstance, 'users', userId, 'dailyLogs');
  return onSnapshot(logsCol, async (snapshot) => {
    for (const change of snapshot.docChanges()) {
      if (change.type === 'added' || change.type === 'modified') {
        const log = change.doc.data() as DailyLog;
        await localDb.dailyLogs.put(log);
      }
    }
    onUpdate();
  });
}


