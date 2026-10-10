import React, { useState, useMemo, useEffect } from 'react';
import {
  Flame,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Award,
  Settings as SettingsIcon,
  User,
  Volume2,
  VolumeX,
  Sparkles,
  LogOut,
  LogIn,
  Menu,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getRandomQuote } from '../../services/quotes';
import { sounds } from '../../services/sound';
import { populateSampleJourneyData } from '../../services/demoData';

export const AppHeader: React.FC = () => {
  const {
    profile,
    currentDate,
    setCurrentDate,
    todayDate,
    currentDayNumber,
    gamification,
    themeMode,
    toggleTheme,
    setActiveTab,
    setMobileMenuOpen,
    refreshAllLogs,
    fireConfetti,
    firebaseUser,
    loginWithGoogleAction,
    logoutAction,
  } = useApp();

  const [quote, setQuote] = useState(getRandomQuote);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isLoadingDemo, setIsLoadingDemo] = useState(false);

  // Time of day greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    const name = profile?.name ? ` ${profile.name}` : '';
    if (hour >= 5 && hour < 12) return `Good morning,${name}! 🌅`;
    if (hour >= 12 && hour < 17) return `Good afternoon,${name}! ☀️`;
    if (hour >= 17 && hour < 22) return `Good evening,${name}! 🌆`;
    return `Good night,${name}! 🌙`;
  }, [profile?.name]);

  // Streak flame styling based on streak length
  const flameStyle = useMemo(() => {
    const streak = gamification.currentStreak;
    if (streak >= 30) {
      return {
        glowClass: 'text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.9)] animate-pulse',
        badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-lg shadow-purple-500/20',
        label: 'Supernova Streak',
      };
    } else if (streak >= 14) {
      return {
        glowClass: 'text-cyan-400 drop-shadow-[0_0_12px_rgba(6,182,212,0.85)] animate-pulse',
        badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-lg shadow-cyan-500/20',
        label: 'Inferno Streak',
      };
    } else if (streak >= 7) {
      return {
        glowClass: 'text-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.8)] animate-flame-glow',
        badgeBg: 'bg-orange-500/20 text-orange-400 border-orange-500/30 shadow-lg shadow-orange-500/20',
        label: 'Blazing Streak',
      };
    } else if (streak >= 1) {
      return {
        glowClass: 'text-amber-500 drop-shadow-[0_0_6px_rgba(245,158,11,0.6)] animate-flame-glow',
        badgeBg: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
        label: 'Warming Up',
      };
    }
    return {
      glowClass: 'text-slate-400',
      badgeBg: 'bg-slate-200/50 dark:bg-slate-800 text-slate-400 border-slate-300 dark:border-slate-700',
      label: 'Start Streak',
    };
  }, [gamification.currentStreak]);

  // Navigate date backwards or forwards
  const handleShiftDate = (offsetDays: number) => {
    sounds.playTap();
    const d = new Date(currentDate + 'T00:00:00');
    d.setDate(d.getDate() + offsetDays);
    const newStr = d.toISOString().split('T')[0];
    setCurrentDate(newStr);
  };

  // Keyboard shortcut listener for Left/Right arrows
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }
      if (e.key === 'ArrowLeft') {
        handleShiftDate(-1);
      } else if (e.key === 'ArrowRight') {
        handleShiftDate(1);
      } else if (e.key.toLowerCase() === 't') {
        setCurrentDate(todayDate);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentDate, todayDate]);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.enabled = next;
    if (next) sounds.playCheck();
  };

  const handleLoadDemo = async () => {
    if (window.confirm('Populate a 30-day rich demo journey with completed logs, badges, heatmaps, and before/after transformation photos?')) {
      setIsLoadingDemo(true);
      await populateSampleJourneyData(todayDate);
      await refreshAllLogs();
      sounds.playFanfare();
      fireConfetti();
      setIsLoadingDemo(false);
      window.location.reload();
    }
  };

  const isToday = currentDate === todayDate;

  return (
    <header className="mb-6 space-y-4">
      {/* Top Banner Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* User Greeting & Status */}
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger Menu Drawer Toggle */}
          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              setMobileMenuOpen(true);
            }}
            className="lg:hidden p-2.5 rounded-xl bg-white dark:bg-[#181c26] border border-slate-200 dark:border-white/[0.09] text-slate-700 dark:text-zinc-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#202533] transition-colors shadow-xs shrink-0"
            title="Open 100-Day Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => {
              sounds.playTap();
              setActiveTab('settings');
            }}
            className="relative cursor-pointer group shrink-0 w-12 h-12"
            title="Account Settings"
          >
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-[#181c26] border border-slate-200 dark:border-white/[0.12] flex items-center justify-center shadow-xs group-hover:border-slate-400 dark:group-hover:border-white/30 transition-all shrink-0">
              {profile?.profilePhoto ? (
                <img
                  src={profile.profilePhoto}
                  alt={profile.name}
                  className="w-12 h-12 object-cover group-hover:scale-105 transition-transform block"
                />
              ) : (
                <User className="w-5 h-5 text-slate-500 dark:text-zinc-400" />
              )}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0f1218] shadow-xs" />
          </div>

          <div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <span>{greeting}</span>
            </h1>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-zinc-400 font-mono">
              <span className="font-bold text-slate-800 dark:text-white bg-slate-100 dark:bg-white/[0.08] px-2 py-0.5 rounded border border-slate-200 dark:border-white/[0.08]">
                DAY {String(currentDayNumber).padStart(3, '0')} // 100
              </span>
              <span>•</span>
              <span className="truncate max-w-[200px] sm:max-w-xs text-slate-600 dark:text-zinc-300 font-normal">{profile?.goal || 'Personal Challenge'}</span>
            </div>
          </div>
        </div>

        {/* Gamification Pills & Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">

          {/* Streak Flame Pill */}
          <div
            onClick={() => {
              sounds.playTap();
              setActiveTab('overview');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 dark:bg-orange-500/15 border border-orange-500/30 text-xs font-mono font-bold cursor-pointer transition-all hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 shadow-xs"
            title={`Current streak: ${gamification.currentStreak} days`}
          >
            <Flame className="w-4 h-4 text-orange-500" />
            <span>{gamification.currentStreak}d Streak</span>
          </div>

          {/* Level & XP Pill */}
          <div
            onClick={() => {
              sounds.playTap();
              setActiveTab('gamification');
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-[#181c26] border border-slate-200 dark:border-white/[0.09] text-xs font-mono font-bold text-slate-800 dark:text-zinc-200 cursor-pointer hover:border-slate-300 dark:hover:border-white/20 transition-all shadow-xs"
            title={`${gamification.totalXp} Total XP (${gamification.xpToNextLevel} XP to Level ${gamification.level + 1})`}
          >
            <div className="flex items-center gap-1 text-amber-500 dark:text-amber-400">
              <Award className="w-3.5 h-3.5" />
              <span>Lvl {gamification.level}</span>
            </div>
            <div className="h-3 w-[1px] bg-slate-200 dark:bg-white/[0.1]" />
            <span className="font-extrabold text-slate-900 dark:text-white">
              {gamification.totalXp} XP
            </span>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className="p-2 rounded-xl bg-white dark:bg-[#181c26] border border-slate-200 dark:border-white/[0.09] text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#202533] transition-colors shadow-xs"
            title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400 dark:text-zinc-500" />}
          </button>

          {/* Dark / Light Toggle */}
          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              toggleTheme();
            }}
            className="p-2 rounded-xl bg-white dark:bg-[#181c26] border border-slate-200 dark:border-white/[0.09] text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#202533] transition-colors shadow-xs"
            title={`Switch to ${themeMode === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {themeMode === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {/* Settings Button */}
          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              setActiveTab('settings');
            }}
            className="p-2 rounded-xl bg-white dark:bg-[#181c26] border border-slate-200 dark:border-white/[0.09] text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#202533] transition-colors shadow-xs"
            title="Settings"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>

          {/* Account / Log Out / Sign In Button */}
          {firebaseUser ? (
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                if (window.confirm(`Currently connected as:\n${firebaseUser.email}\n\nDo you want to log out and switch to another Google account?`)) {
                  logoutAction();
                }
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all text-xs font-mono font-bold shadow-xs"
              title={`Connected as ${firebaseUser.email} (Click to Log Out / Switch Account)`}
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden lg:inline max-w-[80px] truncate">{firebaseUser.email?.split('@')[0]}</span>
              <span className="text-[10px] hidden sm:inline opacity-80 font-normal">Logout</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                loginWithGoogleAction();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-zinc-950 hover:bg-slate-800 dark:hover:bg-zinc-100 transition-all text-xs font-mono font-bold shadow-xs"
              title="Sign in with Google to sync across devices"
            >
              <LogIn className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* Date Navigation & Quote Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-[#161a24] border border-slate-200 dark:border-white/[0.08] shadow-xs dark:shadow-md">
        {/* Date Selector Navigation */}
        <div className="flex items-center gap-1.5 self-center sm:self-auto">
          <button
            type="button"
            onClick={() => handleShiftDate(-1)}
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-[#1e2330] border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-zinc-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#252c3d] transition-colors font-mono"
            title="Previous Day (or Left Arrow key)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="relative flex items-center">
            <input
              type="date"
              value={currentDate}
              onChange={(e) => {
                sounds.playTap();
                setCurrentDate(e.target.value);
              }}
              className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#11141c] border border-slate-200 dark:border-white/[0.1] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-white/30 cursor-pointer"
            />
          </div>

          <button
            type="button"
            onClick={() => handleShiftDate(1)}
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-[#1e2330] border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-zinc-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#252c3d] transition-colors font-mono"
            title="Next Day (or Right Arrow key)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {!isToday && (
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                setCurrentDate(todayDate);
              }}
              className="ml-1 px-3 py-1 rounded-xl text-xs font-mono font-black bg-slate-900 dark:bg-white text-white dark:text-zinc-950 hover:bg-slate-800 dark:hover:bg-zinc-200 shadow-xs transition-all"
              title="Jump to Today (press 'T')"
            >
              TODAY
            </button>
          )}

          <span className="text-xs font-mono text-slate-500 dark:text-zinc-400 ml-1">
            (Day {currentDayNumber})
          </span>
        </div>

        {/* Motivational Quote with Refresh */}
        <div className="flex items-center justify-between sm:justify-end gap-2 text-xs text-slate-500 dark:text-zinc-400 italic border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-white/[0.06]">
          <span className="truncate max-w-md font-sans">
            "{quote.text}" — <span className="font-semibold not-italic text-slate-700 dark:text-zinc-300">{quote.author}</span>
          </span>
          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              setQuote(getRandomQuote());
            }}
            className="p-1 text-slate-400 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-white shrink-0 hover:rotate-180 transition-transform duration-300"
            title="New quote"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
