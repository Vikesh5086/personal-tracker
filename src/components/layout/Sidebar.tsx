import React from 'react';
import {
  CheckSquare,
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
  Shield,
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
  } = useApp();

  const navItems: { id: NavTab; label: string; index: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Daily Log', index: '01', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'overview', label: 'Chronicle & Heatmap', index: '02', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'calendar', label: 'Archive & Photos', index: '03', icon: <Calendar className="w-4 h-4" /> },
    { id: 'productivity', label: 'Deep Work Suite', index: '04', icon: <Clock className="w-4 h-4" /> },
    { id: 'extras', label: 'Extra Routines', index: '05', icon: <Sliders className="w-4 h-4" /> },
    {
      id: 'gamification',
      label: 'Ranks & Badges',
      index: '06',
      icon: <Award className="w-4 h-4" />,
      badge: `Lvl ${gamification.level}`,
    },
    { id: 'settings', label: 'Settings & Cloud', index: '07', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleNavClick = (tab: NavTab) => {
    sounds.playTap();
    setActiveTab(tab);
  };

  const progressPercent = Math.min(100, Math.round((currentDayNumber / 100) * 100));

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[#090d16] border-r border-white/[0.07] min-h-screen p-4 shrink-0 sticky top-0 h-screen select-none text-slate-100 z-20">
      {/* Brand Terminal Header */}
      <div className="flex items-center gap-3 pb-5 pt-1 border-b border-white/[0.06]">
        <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-white/[0.1] flex items-center justify-center text-white shadow-sm shrink-0">
          <Terminal className="w-4 h-4 text-zinc-300" />
        </div>
        <div>
          <h2 className="text-sm font-black tracking-wider uppercase font-mono text-white flex items-center gap-1.5">
            <span>100-DAY PROTOCOL</span>
          </h2>
          <p className="text-[10px] font-mono font-medium text-zinc-500">
            Personal Mastery Log
          </p>
        </div>
      </div>

      {/* Mission Telemetry Rail */}
      <div className="my-4 p-3.5 rounded-xl bg-zinc-900/60 border border-white/[0.07] space-y-2">
        <div className="flex justify-between items-center text-[11px] font-mono">
          <span className="text-zinc-400 font-semibold uppercase">Challenge Progress</span>
          <span className="text-white font-bold">{progressPercent}%</span>
        </div>

        {/* Precision Progress Track */}
        <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: 'var(--primary-accent)',
            }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-0.5">
          <span className="font-bold text-white">DAY {String(currentDayNumber).padStart(3, '0')}</span>
          <span className="flex items-center gap-1 text-orange-400 font-semibold">
            <Flame className="w-3 h-3 text-orange-500" />
            {gamification.currentStreak}d Streak
          </span>
          <span className="text-zinc-500">100d Goal</span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="space-y-1 flex-1 py-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all font-mono ${
                isActive
                  ? 'bg-zinc-800/90 text-white font-bold border border-white/[0.12] shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] text-zinc-600 font-normal">{item.index}</span>
                <span className={isActive ? 'text-white' : 'text-zinc-400'}>{item.icon}</span>
                <span className="tracking-tight">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-zinc-800 text-zinc-400 border border-white/[0.05]'
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
      <div className="pt-3 border-t border-white/[0.06] space-y-2.5">
        {/* XP Track */}
        <div className="p-2.5 rounded-xl bg-zinc-900/40 border border-white/[0.05]">
          <div className="flex items-center justify-between text-[11px] font-mono font-medium mb-1.5">
            <span className="text-zinc-400">Level {gamification.level}</span>
            <span className="text-amber-400 font-bold">{gamification.levelTitle}</span>
          </div>
          <div className="h-1 w-full rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-amber-400 transition-all duration-300"
              style={{ width: `${gamification.levelProgress}%` }}
            />
          </div>
          <div className="text-[9px] font-mono text-zinc-500 mt-1 flex justify-between">
            <span>{gamification.totalXp} XP</span>
            <span>+{gamification.xpToNextLevel} to next</span>
          </div>
        </div>

        {/* User Account & Cloud Sync Status */}
        <div className="flex items-center justify-between text-xs px-1 pt-1">
          {firebaseUser ? (
            <div className="flex items-center justify-between w-full gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-lg bg-zinc-800 border border-white/[0.1] text-zinc-200 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                  {(firebaseUser.displayName || firebaseUser.email || 'U')[0].toUpperCase()}
                </div>
                <div className="truncate min-w-0">
                  <div className="text-[11px] font-mono text-zinc-200 truncate leading-tight">
                    {firebaseUser.email?.split('@')[0]}
                  </div>
                  <div className="flex items-center gap-1 text-[9px] font-mono text-emerald-400">
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
                className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors shrink-0"
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
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs font-bold transition-all border border-white/[0.08]"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Connect Cloud Sync</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
