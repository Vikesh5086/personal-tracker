import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  UserProfile,
  DailyLog,
  GamificationSummary,
  AccentColor,
} from '../types';
import {
  getProfile,
  saveProfile,
  getDailyLog,
  saveDailyLog,
  getAllDailyLogs,
  createEmptyDailyLog,
  clearAllDatabaseData,
} from '../services/db';
import { calculateGamification } from '../services/gamification';
import {
  loginWithGoogle,
  logoutUser,
  syncLocalToCloud,
  syncCloudToLocal,
  syncProfileToCloud,
  syncSingleLogToCloud,
  listenToCloudChanges,
  observeAuthState,
  getFirebaseConfig,
} from '../services/firebase';
import type { User as FirebaseUser } from 'firebase/auth';

export type NavTab = 'dashboard' | 'overview' | 'calendar' | 'productivity' | 'extras' | 'gamification' | 'settings';

interface AppContextType {
  profile: UserProfile | null;
  isLoading: boolean;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  currentDate: string;
  setCurrentDate: (date: string) => void;
  todayDate: string;
  currentDayNumber: number;
  currentLog: DailyLog | null;
  allLogs: DailyLog[];
  gamification: GamificationSummary;
  themeMode: 'light' | 'dark';
  toggleTheme: () => void;
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
  saveUserProfile: (p: UserProfile) => Promise<void>;
  updateCurrentHabit: (updater: (prev: DailyLog) => DailyLog) => Promise<void>;
  refreshAllLogs: () => Promise<void>;
  fireConfetti: () => void;
  milestoneModal: { show: boolean; dayNumber: number } | null;
  setMilestoneModal: (modal: { show: boolean; dayNumber: number } | null) => void;
  levelUpModal: { show: boolean; level: number; title: string } | null;
  setLevelUpModal: (modal: { show: boolean; level: number; title: string } | null) => void;
  showOnboarding: boolean;
  setShowOnboarding: (val: boolean) => void;
  // Firebase Auth & Cloud Sync
  firebaseUser: FirebaseUser | null;
  isFirebaseConfigured: boolean;
  setIsFirebaseConfigured: (val: boolean) => void;
  isCloudSyncing: boolean;
  lastCloudSync: string | null;
  loginWithGoogleAction: () => Promise<void>;
  restoreCloudDataAction: () => Promise<void>;
  logoutAction: () => Promise<void>;
  syncCloudData: () => Promise<{ uploaded: number; downloaded: number }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const ACCENT_COLOR_MAP: Record<AccentColor, { hex: string; class: string; hover: string; rgb: string }> = {
  indigo: { hex: '#6366f1', class: 'from-indigo-500 to-indigo-600', hover: 'hover:bg-indigo-600', rgb: '99, 102, 241' },
  purple: { hex: '#8b5cf6', class: 'from-purple-500 to-purple-600', hover: 'hover:bg-purple-600', rgb: '139, 92, 246' },
  emerald: { hex: '#10b981', class: 'from-emerald-500 to-emerald-600', hover: 'hover:bg-emerald-600', rgb: '16, 185, 129' },
  rose: { hex: '#f43f5e', class: 'from-rose-500 to-rose-600', hover: 'hover:bg-rose-600', rgb: '244, 63, 94' },
  amber: { hex: '#f59e0b', class: 'from-amber-500 to-amber-600', hover: 'hover:bg-amber-600', rgb: '245, 158, 11' },
  cyan: { hex: '#06b6d4', class: 'from-cyan-500 to-cyan-600', hover: 'hover:bg-cyan-600', rgb: '6, 182, 212' },
  blue: { hex: '#3b82f6', class: 'from-blue-500 to-blue-600', hover: 'hover:bg-blue-600', rgb: '59, 130, 246' },
};

function getTodayStr(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function calculateDayNumber(startDateStr: string, targetDateStr: string): number {
  const start = new Date(startDateStr + 'T00:00:00');
  const target = new Date(targetDateStr + 'T00:00:00');
  const diffTime = target.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays + 1);
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const todayDate = useMemo(() => getTodayStr(), []);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [currentDate, setCurrentDate] = useState<string>(todayDate);
  const [currentLog, setCurrentLog] = useState<DailyLog | null>(null);
  const [allLogs, setAllLogs] = useState<DailyLog[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('dark');
  const [accentColor, setAccentColor] = useState<AccentColor>('indigo');
  const [milestoneModal, setMilestoneModal] = useState<{ show: boolean; dayNumber: number } | null>(null);
  const [levelUpModal, setLevelUpModal] = useState<{ show: boolean; level: number; title: string } | null>(null);
  const prevLevelRef = React.useRef<number>(1);

  // Firebase Auth & Cloud Sync State
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [lastCloudSync, setLastCloudSync] = useState<string | null>(() => localStorage.getItem('last_cloud_sync_time'));
  const [isFirebaseConfigured, setIsFirebaseConfigured] = useState<boolean>(() => !!getFirebaseConfig());

  // Apply theme class to documentElement
  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [themeMode]);

  // Apply accent color CSS variables
  useEffect(() => {
    const accent = ACCENT_COLOR_MAP[accentColor] || ACCENT_COLOR_MAP.indigo;
    document.documentElement.style.setProperty('--primary-accent', accent.hex);
    document.documentElement.style.setProperty('--primary-accent-rgb', accent.rgb);
  }, [accentColor]);

  // Confetti trigger helper
  const fireConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8b5cf6', '#f97316', '#10b981', '#3b82f6', '#06b6d4', '#ec4899'],
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Day number calculation
  const currentDayNumber = useMemo(() => {
    if (!profile) return 1;
    return calculateDayNumber(profile.startDate, currentDate);
  }, [profile, currentDate]);

  // Gamification summary computation
  const gamification = useMemo(() => {
    const startStr = profile?.startDate || todayDate;
    return calculateGamification(allLogs, startStr, todayDate);
  }, [allLogs, profile, todayDate]);

  // Detect Level Up
  useEffect(() => {
    if (isLoading || !profile) return;
    if (gamification.level > prevLevelRef.current) {
      setLevelUpModal({
        show: true,
        level: gamification.level,
        title: gamification.levelTitle,
      });
      fireConfetti();
    }
    prevLevelRef.current = gamification.level;
  }, [gamification.level, gamification.levelTitle, isLoading, profile, fireConfetti]);

  // Check milestone days (25, 50, 75, 100)
  const checkMilestones = useCallback((dayNum: number) => {
    if ([25, 50, 75, 100].includes(dayNum)) {
      const storageKey = `milestone_celebrated_${dayNum}`;
      if (!localStorage.getItem(storageKey)) {
        localStorage.setItem(storageKey, 'true');
        setMilestoneModal({ show: true, dayNumber: dayNum });
        fireConfetti();
      }
    }
  }, [fireConfetti]);

  // Load initial profile and logs
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const userProfile = await getProfile();
      if (!userProfile || !userProfile.onboardingCompleted) {
        setShowOnboarding(true);
      } else {
        setProfile(userProfile);
        setThemeMode(userProfile.themeMode || 'dark');
        setAccentColor(userProfile.accentColor || 'indigo');
        const dayNum = calculateDayNumber(userProfile.startDate, todayDate);
        checkMilestones(dayNum);
      }

      const logs = await getAllDailyLogs();
      setAllLogs(logs);
    } catch (err) {
      console.error('Error initializing app data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [todayDate, checkMilestones]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Observe Firebase Auth changes and initial sync
  useEffect(() => {
    setIsFirebaseConfigured(!!getFirebaseConfig());
    const unsub = observeAuthState(async (user) => {
      setFirebaseUser(user);
      if (user) {
        try {
          setIsCloudSyncing(true);
          const dl = await syncCloudToLocal(user.uid);
          if (dl.profileFound || dl.logsCount > 0) {
            await loadData();
            setShowOnboarding(false);
          } else {
            const localProf = await getProfile();
            if (localProf && localProf.onboardingCompleted) {
              await syncLocalToCloud(user.uid);
            }
          }
          const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          setLastCloudSync(nowStr);
          localStorage.setItem('last_cloud_sync_time', nowStr);
        } catch (e) {
          console.error('Initial sync error:', e);
        } finally {
          setIsCloudSyncing(false);
        }
      }
    });
    return () => unsub();
  }, [loadData]);

  // Real-time Firestore snapshot listener for multi-device live sync
  useEffect(() => {
    if (!firebaseUser) return;
    const unsub = listenToCloudChanges(
      firebaseUser.uid,
      (cloudProfile) => {
        setProfile(cloudProfile);
        if (cloudProfile.themeMode) setThemeMode(cloudProfile.themeMode);
        if (cloudProfile.accentColor) setAccentColor(cloudProfile.accentColor);
        setShowOnboarding(false);
      },
      async () => {
        const logs = await getAllDailyLogs();
        setAllLogs(logs);
        if (currentDate) {
          const updated = await getDailyLog(currentDate);
          if (updated) setCurrentLog(updated);
        }
      }
    );
    return () => unsub();
  }, [firebaseUser, currentDate]);

  // Load log for current date
  const loadDateLog = useCallback(async (date: string) => {
    const existing = await getDailyLog(date);
    if (existing) {
      setCurrentLog(existing);
    } else {
      const dayNum = profile ? calculateDayNumber(profile.startDate, date) : 1;
      const empty = createEmptyDailyLog(date, dayNum);
      setCurrentLog(empty);
    }
  }, [profile]);

  useEffect(() => {
    if (!isLoading) {
      loadDateLog(currentDate);
    }
  }, [currentDate, isLoading, loadDateLog]);

  // Refresh all logs
  const refreshAllLogs = useCallback(async () => {
    const logs = await getAllDailyLogs();
    setAllLogs(logs);
  }, []);

  // Update current log habit
  const updateCurrentHabit = useCallback(async (updater: (prev: DailyLog) => DailyLog) => {
    if (!currentLog) return;
    const wasAlreadyPerfect = currentLog.isPerfectDay;
    const updated = updater({ ...currentLog });

    await saveDailyLog(updated);
    // Reload freshly calculated log from DB
    const persisted = await getDailyLog(currentLog.date);
    if (persisted) {
      setCurrentLog(persisted);
      // Trigger confetti if day just reached perfect
      if (!wasAlreadyPerfect && persisted.isPerfectDay) {
        fireConfetti();
      }
      // Instantly sync this log to cloud if logged in
      if (firebaseUser) {
        syncSingleLogToCloud(firebaseUser.uid, persisted).catch(console.error);
      }
    }

    await refreshAllLogs();
  }, [currentLog, fireConfetti, refreshAllLogs, firebaseUser]);

  // Save profile
  const saveUserProfile = useCallback(async (p: UserProfile) => {
    await saveProfile(p);
    setProfile(p);
    setThemeMode(p.themeMode);
    setAccentColor(p.accentColor);
    setShowOnboarding(false);
    if (firebaseUser) {
      await syncProfileToCloud(firebaseUser.uid, p).catch(console.error);
      syncLocalToCloud(firebaseUser.uid).catch(console.error);
    }
    await refreshAllLogs();
  }, [refreshAllLogs, firebaseUser]);

  // Firebase actions
  const loginWithGoogleAction = useCallback(async () => {
    try {
      setIsCloudSyncing(true);
      const u = await loginWithGoogle();
      if (u) {
        setFirebaseUser(u);
        const dl = await syncCloudToLocal(u.uid);
        if (dl.profileFound || dl.logsCount > 0) {
          await loadData();
          setShowOnboarding(false);
        } else {
          const localProf = await getProfile();
          if (localProf && localProf.onboardingCompleted) {
            await syncLocalToCloud(u.uid);
            await loadData();
            setShowOnboarding(false);
          } else {
            // First-time user with Google: create initial profile using their Google details!
            const d = new Date();
            const startStr = d.toISOString().split('T')[0];
            const endD = new Date(d.getTime() + 99 * 24 * 60 * 60 * 1000);
            const endStr = endD.toISOString().split('T')[0];

            const initialProfile: UserProfile = {
              name: u.displayName || 'Champion',
              age: 24,
              height: '175 cm',
              weight: '70 kg',
              goal: 'General consistency',
              profilePhoto: u.photoURL || undefined,
              startDate: startStr,
              endDate: endStr,
              themeMode: 'dark',
              accentColor: 'indigo',
              onboardingCompleted: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            await saveProfile(initialProfile);
            await syncLocalToCloud(u.uid);
            await loadData();
            setShowOnboarding(false);
          }
        }
        const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setLastCloudSync(nowStr);
        localStorage.setItem('last_cloud_sync_time', nowStr);
      }
    } catch (e: any) {
      alert(e.message || 'Google Sign-In failed');
    } finally {
      setIsCloudSyncing(false);
    }
  }, [loadData]);

  const restoreCloudDataAction = useCallback(async () => {
    if (!firebaseUser) return;
    try {
      setIsCloudSyncing(true);
      const dl = await syncCloudToLocal(firebaseUser.uid);
      if (dl.profileFound || dl.logsCount > 0) {
        await loadData();
        setShowOnboarding(false);
      } else {
        const localProf = await getProfile();
        if (localProf && localProf.onboardingCompleted) {
          await syncProfileToCloud(firebaseUser.uid, localProf);
          await loadData();
          setShowOnboarding(false);
        } else {
          alert('No existing cloud backup found for this account. Please complete your profile setup below to begin!');
        }
      }
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastCloudSync(nowStr);
      localStorage.setItem('last_cloud_sync_time', nowStr);
    } catch (e: any) {
      console.error('Restore error:', e);
      alert('Could not restore from cloud: ' + (e.message || 'Unknown error'));
    } finally {
      setIsCloudSyncing(false);
    }
  }, [firebaseUser, loadData]);

  const logoutAction = useCallback(async () => {
    try {
      await logoutUser();
      setFirebaseUser(null);
      await clearAllDatabaseData();
      localStorage.removeItem('last_cloud_sync_time');
      setProfile(null);
      setAllLogs([]);
      setCurrentLog(null);
      setShowOnboarding(true);
    } catch (err: any) {
      console.error('Logout error:', err);
    }
  }, []);

  const syncCloudData = useCallback(async () => {
    if (!firebaseUser) return { uploaded: 0, downloaded: 0 };
    setIsCloudSyncing(true);
    try {
      const downloadedRes = await syncCloudToLocal(firebaseUser.uid);
      const uploaded = await syncLocalToCloud(firebaseUser.uid);
      await refreshAllLogs();
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastCloudSync(nowStr);
      localStorage.setItem('last_cloud_sync_time', nowStr);
      return { uploaded, downloaded: downloadedRes.logsCount };
    } finally {
      setIsCloudSyncing(false);
    }
  }, [firebaseUser, refreshAllLogs]);


  // Toggle theme
  const toggleTheme = useCallback(() => {
    setThemeMode((prev) => {
      const next: 'light' | 'dark' = prev === 'dark' ? 'light' : 'dark';
      if (profile) {
        const updated: UserProfile = { ...profile, themeMode: next };
        saveProfile(updated);
        setProfile(updated);
        if (firebaseUser) {
          syncProfileToCloud(firebaseUser.uid, updated).catch(console.error);
        }
      }
      return next;
    });
  }, [profile, firebaseUser]);

  return (
    <AppContext.Provider
      value={{
        profile,
        isLoading,
        activeTab,
        setActiveTab,
        currentDate,
        setCurrentDate,
        todayDate,
        currentDayNumber,
        currentLog,
        allLogs,
        gamification,
        themeMode,
        toggleTheme,
        accentColor,
        setAccentColor: (color) => {
          setAccentColor(color);
          if (profile) {
            const updated = { ...profile, accentColor: color };
            saveProfile(updated);
            setProfile(updated);
            if (firebaseUser) {
              syncProfileToCloud(firebaseUser.uid, updated).catch(console.error);
            }
          }
        },
        saveUserProfile,
        updateCurrentHabit,
        refreshAllLogs,
        fireConfetti,
        milestoneModal,
        setMilestoneModal,
        levelUpModal,
        setLevelUpModal,
        showOnboarding,
        setShowOnboarding,
        firebaseUser,
        isFirebaseConfigured,
        setIsFirebaseConfigured,
        isCloudSyncing,
        lastCloudSync,
        loginWithGoogleAction,
        restoreCloudDataAction,
        logoutAction,
        syncCloudData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
