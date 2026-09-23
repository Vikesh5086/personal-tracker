import React, { useState, useRef } from 'react';
import {
  User,
  Calendar,
  Download,
  Upload,
  Trash2,
  Palette,
  CheckCircle2,
  Camera,
  AlertTriangle,
  RefreshCw,
  Clock,
  Sparkles,
  Cloud,
  ShieldCheck,
  LogOut,
  Key,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react';
import { useApp, ACCENT_COLOR_MAP } from '../../context/AppContext';
import { AccentColor, GoalType, UserProfile } from '../../types';
import { exportAllDataJSON, exportDailyLogsCSV, importDataJSON } from '../../services/exportImport';
import { clearAllDatabaseData } from '../../services/db';
import {
  getFirebaseConfig,
  saveFirebaseConfig,
  clearFirebaseConfig,
  type FirebaseConfigParams,
} from '../../services/firebase';

export const SettingsModal: React.FC = () => {
  const {
    profile,
    saveUserProfile,
    themeMode,
    toggleTheme,
    accentColor,
    setAccentColor,
    refreshAllLogs,
    currentDate,
    setCurrentDate,
    todayDate,
    setShowOnboarding,
    firebaseUser,
    isFirebaseConfigured,
    setIsFirebaseConfigured,
    isCloudSyncing,
    lastCloudSync,
    loginWithGoogleAction,
    logoutAction,
    syncCloudData,
  } = useApp();

  const [name, setName] = useState(profile?.name || '');
  const [age, setAge] = useState(profile?.age || 24);
  const [height, setHeight] = useState(profile?.height || '175 cm');
  const [weight, setWeight] = useState(profile?.weight || '70 kg');
  const [goal, setGoal] = useState<GoalType>(profile?.goal || 'General consistency');
  const [customGoalText, setCustomGoalText] = useState(profile?.customGoalText || '');
  const [startDate, setStartDate] = useState(profile?.startDate || todayDate);
  const [endDate, setEndDate] = useState(profile?.endDate || todayDate);
  const [profilePhoto, setProfilePhoto] = useState(profile?.profilePhoto || '');

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);
  const [showConfigForm, setShowConfigForm] = useState(!isFirebaseConfigured);
  const [configParams, setConfigParams] = useState<FirebaseConfigParams>(() => {
    return (
      getFirebaseConfig() || {
        apiKey: '',
        authDomain: '',
        projectId: '',
        storageBucket: '',
        messagingSenderId: '',
        appId: '',
      }
    );
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Photo must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExtendDays = (daysToAdd: number) => {
    const d = new Date(endDate + 'T00:00:00');
    d.setDate(d.getDate() + daysToAdd);
    const newEnd = d.toISOString().split('T')[0];
    setEndDate(newEnd);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    const updated: UserProfile = {
      ...profile,
      name: name.trim(),
      age: Number(age) || 20,
      height: height.trim(),
      weight: weight.trim(),
      goal,
      customGoalText: goal === 'Custom' ? customGoalText : undefined,
      profilePhoto: profilePhoto || undefined,
      startDate,
      endDate,
      accentColor,
      themeMode,
      updatedAt: new Date().toISOString(),
    };

    await saveUserProfile(updated);
    setSaveStatus('Settings updated successfully!');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const res = await importDataJSON(file);
    alert(res.message);
    if (res.success) {
      window.location.reload();
    }
  };

  const handleClearAll = async () => {
    await clearAllDatabaseData();
    localStorage.clear();
    alert('All application data has been cleared.');
    window.location.reload();
  };

  const handleSaveFirebaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!configParams.apiKey.trim() || !configParams.projectId.trim()) {
      alert('Please provide at least the API Key and Project ID');
      return;
    }
    saveFirebaseConfig({
      apiKey: configParams.apiKey.trim(),
      authDomain: configParams.authDomain.trim(),
      projectId: configParams.projectId.trim(),
      storageBucket: configParams.storageBucket.trim(),
      messagingSenderId: configParams.messagingSenderId.trim(),
      appId: configParams.appId.trim(),
    });
    setIsFirebaseConfigured(true);
    setSyncFeedback('Firebase configuration saved successfully!');
    setTimeout(() => setSyncFeedback(null), 3500);
  };

  const handleClearConfig = () => {
    if (confirm('Clear saved Firebase configuration?')) {
      clearFirebaseConfig();
      setIsFirebaseConfigured(false);
      setConfigParams({
        apiKey: '',
        authDomain: '',
        projectId: '',
        storageBucket: '',
        messagingSenderId: '',
        appId: '',
      });
      setSyncFeedback('Firebase configuration cleared.');
      setTimeout(() => setSyncFeedback(null), 3500);
    }
  };

  const handleManualSync = async () => {
    try {
      const res = await syncCloudData();
      setSyncFeedback(`Synced successfully! ${res.uploaded} logs uploaded, ${res.downloaded} logs fetched.`);
      setTimeout(() => setSyncFeedback(null), 4000);
    } catch (err: any) {
      alert('Sync failed: ' + (err.message || 'Unknown error'));
    }
  };


  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-3xl glass-panel shadow-md border border-slate-200 dark:border-white/10">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs uppercase font-extrabold px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
            System Preferences
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          Settings & Data Management
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Personalize your profile, extend your challenge duration, export offline backups, or reset your journey.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-white/10 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-500" />
            <span>Profile Information</span>
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative group cursor-pointer shrink-0">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-indigo-500/40 flex items-center justify-center">
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-slate-400" />
                )}
              </div>
              <label
                htmlFor="settings-photo-input"
                className="absolute inset-0 cursor-pointer rounded-2xl flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity text-white"
              >
                <Camera className="w-5 h-5" />
              </label>
              <input
                id="settings-photo-input"
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="sr-only"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 w-full">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                  Age
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                Height
              </label>
              <input
                type="text"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                Weight
              </label>
              <input
                type="text"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                Primary Goal
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value as GoalType)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700"
              >
                <option value="General consistency">General consistency</option>
                <option value="Weight loss">Weight loss</option>
                <option value="Muscle gain">Muscle gain</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
          </div>

          {goal === 'Custom' && (
            <input
              type="text"
              placeholder="Describe your custom goal..."
              value={customGoalText}
              onChange={(e) => setCustomGoalText(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700"
            />
          )}
        </div>

        {/* Extend Challenge Timeline */}
        <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-white/10 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-500" />
            <span>Challenge Timeline & Extension</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                Start Date (Day 1)
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                End Date (Day 100+)
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          {/* Quick extension buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Extend Challenge:
            </span>
            <button
              type="button"
              onClick={() => handleExtendDays(15)}
              className="px-3 py-1 text-xs font-bold rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900 hover:bg-indigo-100"
            >
              +15 Days
            </button>
            <button
              type="button"
              onClick={() => handleExtendDays(30)}
              className="px-3 py-1 text-xs font-bold rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900 hover:bg-indigo-100"
            >
              +30 Days (1 Month)
            </button>
            <button
              type="button"
              onClick={() => handleExtendDays(50)}
              className="px-3 py-1 text-xs font-bold rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900 hover:bg-indigo-100"
            >
              +50 Days
            </button>
          </div>
        </div>

        {/* Accent Color & Visual Theme */}
        <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-white/10 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-indigo-500" />
            <span>Theme & Accent Color</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                Custom Accent Palette
              </label>
              <div className="flex flex-wrap gap-2.5">
                {(Object.keys(ACCENT_COLOR_MAP) as AccentColor[]).map((col) => {
                  const item = ACCENT_COLOR_MAP[col];
                  const isSelected = accentColor === col;
                  return (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setAccentColor(col)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                        isSelected
                          ? 'border-slate-900 dark:border-white shadow-md scale-105'
                          : 'border-slate-200 dark:border-slate-700 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <div
                        className="w-3.5 h-3.5 rounded-full"
                        style={{ backgroundColor: item.hex }}
                      />
                      <span className="capitalize">{col}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Display Mode ({themeMode === 'dark' ? 'Dark Mode' : 'Light Mode'})
              </span>
              <button
                type="button"
                onClick={toggleTheme}
                className="px-4 py-1.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
              >
                Toggle Theme
              </button>
            </div>
          </div>
        </div>

        {/* Save Button & Status */}
        <div className="flex items-center justify-between">
          <div>
            {saveStatus && (
              <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> {saveStatus}
              </span>
            )}
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/30 transition-all"
          >
            Save Profile & Preferences
          </button>
        </div>
      </form>

      {/* Cloud Synchronization Section */}
      <div className="p-6 rounded-3xl glass-card border border-indigo-500/20 dark:border-indigo-500/30 space-y-5 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Cloud className="w-5 h-5 text-indigo-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Multi-Device Cloud Sync (Firebase & Google)
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Access your 100-day journey from your phone and computer in real time. Works offline first!
            </p>
          </div>

          {firebaseUser ? (
            <div className="flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Real-Time Sync Active</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <span>Offline / Local Only</span>
            </div>
          )}
        </div>

        {syncFeedback && (
          <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-xs font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>{syncFeedback}</span>
          </div>
        )}

        {/* User Card when logged in */}
        {firebaseUser ? (
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {firebaseUser.photoURL ? (
                <img
                  src={firebaseUser.photoURL}
                  alt={firebaseUser.displayName || 'Google Account'}
                  className="w-12 h-12 rounded-full border-2 border-indigo-500/40 object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center">
                  {(firebaseUser.displayName || firebaseUser.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {firebaseUser.displayName || 'Google User'}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {firebaseUser.email}
                </div>
                {lastCloudSync && (
                  <div className="text-[10px] text-emerald-500 font-medium mt-0.5">
                    Last synced at {lastCloudSync}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleManualSync}
                disabled={isCloudSyncing}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isCloudSyncing ? 'animate-spin' : ''}`} />
                <span>{isCloudSyncing ? 'Syncing...' : 'Sync Now'}</span>
              </button>

              <button
                type="button"
                onClick={logoutAction}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-500/10 border border-rose-500/20 transition-all flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          /* Sign-in prompt */
          <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border border-indigo-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                Connect Google Account
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
                Sync automatically across your mobile phone and laptop. If you open this URL on your phone and log in, your habits will be waiting for you.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!isFirebaseConfigured) {
                  setShowConfigForm(true);
                  alert('Please enter your Firebase Project Keys below before signing in.');
                  return;
                }
                loginWithGoogleAction();
              }}
              className="px-5 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white text-xs font-bold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2.5 shrink-0"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Sign in with Google</span>
            </button>
          </div>
        )}

        {/* Collapsible Firebase Project Keys */}
        <div className="pt-2 border-t border-slate-200/60 dark:border-white/5">
          <button
            type="button"
            onClick={() => setShowConfigForm(!showConfigForm)}
            className="flex items-center justify-between w-full text-left text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-500 py-1"
          >
            <div className="flex items-center gap-2">
              <Key className="w-3.5 h-3.5 text-indigo-500" />
              <span>Firebase API Credentials & Project Setup</span>
              {isFirebaseConfigured && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold">
                  Configured
                </span>
              )}
            </div>
            {showConfigForm ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showConfigForm && (
            <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in">
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Connect your own free Google Firebase project in 2 minutes. All sync data stays completely private in your own Firebase Firestore database.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    API Key
                  </label>
                  <input
                    type="text"
                    value={configParams.apiKey}
                    onChange={(e) => setConfigParams({ ...configParams, apiKey: e.target.value })}
                    placeholder="AIzaSy..."
                    className="w-full text-xs px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Project ID
                  </label>
                  <input
                    type="text"
                    value={configParams.projectId}
                    onChange={(e) => setConfigParams({ ...configParams, projectId: e.target.value })}
                    placeholder="personal-tracker-12345"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Auth Domain
                  </label>
                  <input
                    type="text"
                    value={configParams.authDomain}
                    onChange={(e) => setConfigParams({ ...configParams, authDomain: e.target.value })}
                    placeholder="project-id.firebaseapp.com"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Storage Bucket
                  </label>
                  <input
                    type="text"
                    value={configParams.storageBucket}
                    onChange={(e) => setConfigParams({ ...configParams, storageBucket: e.target.value })}
                    placeholder="project-id.appspot.com"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Messaging Sender ID
                  </label>
                  <input
                    type="text"
                    value={configParams.messagingSenderId}
                    onChange={(e) => setConfigParams({ ...configParams, messagingSenderId: e.target.value })}
                    placeholder="1234567890"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    App ID
                  </label>
                  <input
                    type="text"
                    value={configParams.appId}
                    onChange={(e) => setConfigParams({ ...configParams, appId: e.target.value })}
                    placeholder="1:1234567890:web:abcdef"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSaveFirebaseConfig}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all"
                  >
                    Save Firebase Credentials
                  </button>
                  {isFirebaseConfigured && (
                    <button
                      type="button"
                      onClick={handleClearConfig}
                      className="px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <a
                  href="https://console.firebase.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-indigo-500 hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Firebase Console</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Export & Import Section */}
      <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-white/10 space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Download className="w-5 h-5 text-indigo-500" />
          <span>Data Backup & Export (100% Private Offline Storage)</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Your entire journal, habits, photos, and milestones live inside your browser's IndexedDB. Download a complete backup to transfer devices or keep safe.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={exportAllDataJSON}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-left transition-all group"
          >
            <Download className="w-5 h-5 text-indigo-500 mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold text-slate-900 dark:text-white">Export Full JSON</div>
            <div className="text-[10px] text-slate-400">Complete backup with photos & profile</div>
          </button>

          <button
            type="button"
            onClick={exportDailyLogsCSV}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-left transition-all group"
          >
            <Download className="w-5 h-5 text-emerald-500 mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold text-slate-900 dark:text-white">Export CSV Spreadsheet</div>
            <div className="text-[10px] text-slate-400">Excel / Google Sheets compatible</div>
          </button>

          <label className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-left transition-all group cursor-pointer block">
            <Upload className="w-5 h-5 text-amber-500 mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold text-slate-900 dark:text-white">Restore from Backup</div>
            <div className="text-[10px] text-slate-400">Import .json backup file</div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="sr-only"
            />
          </label>
        </div>
      </div>

      {/* Danger Zone: Reset & Start Fresh */}
      <div className="p-6 rounded-3xl bg-rose-500/10 border-2 border-rose-500/30 space-y-3 shadow-lg">
        <h3 className="text-base font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-500" />
          <span>Reset Challenge / Start Fresh on Day 1</span>
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          Want to start fresh from Day 1 with your own name, habits, and clean slate? This will wipe all existing logs and open the initial setup screen.
        </p>

        {showResetConfirm ? (
          <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 space-y-3 animate-in fade-in">
            <span className="text-xs font-bold text-rose-700 dark:text-rose-300 block">
              ⚠️ Are you sure? All demo data and logs will be deleted and you will be taken to Day 1 onboarding.
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleClearAll}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/30 transition-all"
              >
                Yes, Start Fresh from Day 1
              </button>
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/25 transition-all flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Reset Everything & Start Fresh (Day 1)</span>
          </button>
        )}
      </div>
    </div>
  );
};
