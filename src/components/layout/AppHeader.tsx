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
    refreshAllLogs,
    fireConfetti,
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
        <div className="flex items-center gap-3.5">
          <div
            onClick={() => {
              sounds.playTap();
              setActiveTab('settings');
            }}
            className="relative cursor-pointer group shrink-0 w-14 h-14"
            title="Account Settings"
          >
            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border-2 border-indigo-500/40 flex items-center justify-center shadow-lg shadow-indigo-500/10 group-hover:border-indigo-400 transition-all shrink-0">
              {profile?.profilePhoto ? (
                <img
                  src={profile.profilePhoto}
                  alt={profile.name}
                  className="w-14 h-14 object-cover group-hover:scale-105 transition-transform rounded-2xl block"
                />
              ) : (
                <User className="w-6 h-6 text-indigo-500" />
              )}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 shadow-sm" />
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <span>{greeting}</span>
            </h1>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md">
                Day {currentDayNumber} of 100
              </span>
              <span>•</span>
              <span className="truncate max-w-[200px] sm:max-w-xs font-medium">{profile?.goal || '100-Day Journey'}</span>
            </div>
          </div>
        </div>

        {/* Gamification Pills & Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">

          {/* Streak Flame Pill */}
          <div
            onClick={() => {
              sounds.playTap();
              setActiveTab('gamification');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-all hover:scale-105 ${flameStyle.badgeBg}`}
            title={`Current streak: ${gamification.currentStreak} days`}
          >
            <Flame className={`w-4 h-4 ${flameStyle.glowClass}`} />
            <span>{gamification.currentStreak} {gamification.currentStreak === 1 ? 'Day' : 'Days'}</span>
          </div>

          {/* Level & XP Pill */}
          <div
            onClick={() => {
              sounds.playTap();
              setActiveTab('gamification');
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer hover:border-indigo-500/50 transition-all hover:scale-105"
            title={`${gamification.totalXp} Total XP (${gamification.xpToNextLevel} XP to Level ${gamification.level + 1})`}
          >
            <div className="flex items-center gap-1 text-amber-500">
              <Award className="w-4 h-4" />
              <span>Lvl {gamification.level}</span>
            </div>
            <div className="h-3 w-[1px] bg-slate-300 dark:bg-slate-700" />
            <span className="text-indigo-600 dark:text-indigo-400 font-extrabold font-mono">
              {gamification.totalXp} XP
            </span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-500 transition-colors"
            title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={() => {
              sounds.playTap();
              toggleTheme();
            }}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
            title={`Switch to ${themeMode === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {themeMode === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Settings Button */}
          <button
            onClick={() => {
              sounds.playTap();
              setActiveTab('settings');
            }}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
            title="Settings"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Date Navigation & Quote Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-2xl glass-card">
        {/* Date Selector Navigation */}
        <div className="flex items-center gap-1.5 self-center sm:self-auto">
          <button
            onClick={() => handleShiftDate(-1)}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
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
              className="text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer font-mono"
            />
          </div>

          <button
            onClick={() => handleShiftDate(1)}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
            title="Next Day (or Right Arrow key)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {!isToday && (
            <button
              onClick={() => {
                sounds.playTap();
                setCurrentDate(todayDate);
              }}
              className="ml-1 px-2.5 py-1 rounded-xl text-xs font-extrabold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-all"
              title="Jump to Today (press 'T')"
            >
              Today
            </button>
          )}

          <span className="text-xs font-bold text-slate-400 ml-1">
            (Day {currentDayNumber})
          </span>
        </div>

        {/* Motivational Quote with Refresh */}
        <div className="flex items-center justify-between sm:justify-end gap-2 text-xs text-slate-500 dark:text-slate-400 italic border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800">
          <span className="truncate max-w-md">
            "{quote.text}" — <span className="font-semibold not-italic text-slate-700 dark:text-slate-300">{quote.author}</span>
          </span>
          <button
            onClick={() => {
              sounds.playTap();
              setQuote(getRandomQuote());
            }}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shrink-0 hover:rotate-180 transition-transform duration-300"
            title="New quote"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
