import React from 'react';
import {
  CheckSquare,
  Utensils,
  BarChart3,
  Calendar,
  Clock,
  Sliders,
  Award,
  Settings,
  Flame,
  Terminal,
  LogOut,
  LogIn,
  X,
} from 'lucide-react';
import { useApp, NavTab } from '../../context/AppContext';
import { sounds } from '../../services/sound';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentDayNumber,
    gamification,
    firebaseUser,
    logoutAction,
    loginWithGoogleAction,
    isCloudSyncing,
    mobileMenuOpen,
    setMobileMenuOpen,
  } = useApp();

  const navItems: { id: NavTab; label: string; index: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Daily Log', index: '01', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'food', label: 'Food & Nutrition', index: '02', icon: <Utensils className="w-4 h-4" /> },
    { id: 'overview', label: 'Chronicle & Heatmap', index: '03', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'calendar', label: 'Archive & Photos', index: '04', icon: <Calendar className="w-4 h-4" /> },
    { id: 'productivity', label: 'Deep Work Suite', index: '05', icon: <Clock className="w-4 h-4" /> },
    { id: 'extras', label: 'Extra Routines', index: '06', icon: <Sliders className="w-4 h-4" /> },
    {
      id: 'gamification',
      label: 'Ranks & Badges',
      index: '07',
      icon: <Award className="w-4 h-4" />,
      badge: `Lvl ${gamification.level}`,
    },
    { id: 'settings', label: 'Settings & Cloud', index: '08', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleNavClick = (tab: NavTab) => {
    sounds.playTap();
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const progressPercent = Math.min(100, Math.round((currentDayNumber / 100) * 100));

  const renderNavContent = () => (
    <>
      {/* Brand Terminal Header */}
      <div className="flex items-center justify-between pb-5 pt-1 border-b border-slate-200 dark:border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-[#1a1e2b] border border-slate-200 dark:border-white/[0.1] flex items-center justify-center text-slate-800 dark:text-zinc-200 shadow-xs shrink-0">
            <Terminal className="w-4 h-4 text-slate-600 dark:text-zinc-300" />
          </div>
          <div>
            <h2 className="text-sm font-black tracking-wider uppercase font-mono text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>100-DAY PROTOCOL</span>
            </h2>
            <p className="text-[10px] font-mono font-medium text-slate-500 dark:text-zinc-400">
              Personal Mastery Log
            </p>
          </div>
        </div>

        {mobileMenuOpen && (
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-[#1a1e2b] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Mission Telemetry Rail */}
      <div className="my-4 p-3.5 rounded-xl bg-slate-50 dark:bg-[#181c26] border border-slate-200 dark:border-white/[0.08] space-y-2">
        <div className="flex justify-between items-center text-[11px] font-mono">
          <span className="text-slate-600 dark:text-zinc-400 font-semibold uppercase">Challenge Progress</span>
          <span className="text-slate-900 dark:text-white font-bold">{progressPercent}%</span>
        </div>

        {/* Precision Progress Track */}
        <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: 'var(--primary-accent)',
            }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-zinc-400 pt-0.5">
          <span className="font-bold text-slate-900 dark:text-white">DAY {String(currentDayNumber).padStart(3, '0')}</span>
          <span className="flex items-center gap-1 text-orange-600 dark:text-orange-400 font-semibold">
            <Flame className="w-3 h-3 text-orange-500" />
            {gamification.currentStreak}d Streak
          </span>
          <span className="text-slate-500 dark:text-zinc-500">100d Goal</span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="space-y-1 flex-1 py-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all font-mono ${
                isActive
                  ? 'bg-slate-900 text-white font-bold shadow-xs dark:bg-[#202533] dark:text-white dark:border dark:border-white/[0.12]'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/80 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-[#181c26]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={`text-[10px] font-normal ${isActive ? 'text-slate-300 dark:text-zinc-400' : 'text-slate-400 dark:text-zinc-600'}`}>{item.index}</span>
                <span>{item.icon}</span>
                <span className="tracking-tight">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-white/[0.05]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Level Info & Account Status */}
      <div className="pt-3 border-t border-slate-200 dark:border-white/[0.08] space-y-2.5">
        {/* XP Track */}
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#181c26] border border-slate-200 dark:border-white/[0.08]">
          <div className="flex items-center justify-between text-[11px] font-mono font-medium mb-1.5">
            <span className="text-slate-600 dark:text-zinc-400">Level {gamification.level}</span>
            <span className="text-amber-600 dark:text-amber-400 font-bold">{gamification.levelTitle}</span>
          </div>
          <div className="h-1 w-full rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-amber-500 dark:bg-amber-400 transition-all duration-300"
              style={{ width: `${gamification.levelProgress}%` }}
            />
          </div>
          <div className="text-[9px] font-mono text-slate-500 dark:text-zinc-400 mt-1 flex justify-between">
            <span>{gamification.totalXp} XP</span>
            <span>+{gamification.xpToNextLevel} to next</span>
          </div>
        </div>

        {/* User Account & Cloud Sync Status */}
        <div className="flex items-center justify-between text-xs px-1 pt-1">
          {firebaseUser ? (
            <div className="flex items-center justify-between w-full gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-[#1e2330] border border-slate-200 dark:border-white/[0.1] text-slate-800 dark:text-zinc-200 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                  {(firebaseUser.displayName || firebaseUser.email || 'U')[0].toUpperCase()}
                </div>
                <div className="truncate min-w-0">
                  <div className="text-[11px] font-mono text-slate-800 dark:text-zinc-200 truncate leading-tight">
                    {firebaseUser.email?.split('@')[0]}
                  </div>
                  <div className="flex items-center gap-1 text-[9px] font-mono text-emerald-600 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{isCloudSyncing ? 'Syncing...' : 'Synced'}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  sounds.playTap();
                  if (window.confirm('Do you want to switch Google accounts or log out?')) {
                    logoutAction();
                  }
                }}
                className="p-1.5 rounded-lg text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-[#1e2330] transition-colors shrink-0"
                title="Switch Account / Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                loginWithGoogleAction();
              }}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-mono text-xs font-bold transition-all shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Connect Cloud Sync</span>
            </button>
          )}
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-[#131720] border-r border-slate-200 dark:border-white/[0.08] min-h-screen p-4 shrink-0 sticky top-0 h-screen select-none text-slate-900 dark:text-slate-100 z-20">
        {renderNavContent()}
      </aside>

      {/* Mobile Slide-Over Hamburger Panel Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative flex flex-col w-72 max-w-[85vw] bg-white dark:bg-[#131720] border-r border-slate-200 dark:border-white/[0.1] min-h-screen p-4 shadow-2xl z-10 animate-in slide-in-from-left duration-200 select-none text-slate-900 dark:text-slate-100">
            {renderNavContent()}
          </div>
        </div>
      )}
    </>
  );
};
