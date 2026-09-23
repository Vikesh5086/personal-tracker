import React from 'react';
import {
  CheckSquare,
  BarChart3,
  Calendar,
  Clock,
  Sliders,
  Award,
  Settings,
  Sparkles,
  Flame,
} from 'lucide-react';
import { useApp, NavTab } from '../../context/AppContext';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentDayNumber,
    gamification,
    firebaseUser,
    logoutAction,
    loginWithGoogleAction,
  } = useApp();

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    { id: 'dashboard', label: 'Daily Habits', icon: <CheckSquare className="w-5 h-5" /> },
    { id: 'overview', label: 'Overview & Trends', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'calendar', label: 'Calendar & Photos', icon: <Calendar className="w-5 h-5" /> },
    { id: 'productivity', label: 'Productivity Suite', icon: <Clock className="w-5 h-5" /> },
    { id: 'extras', label: 'Extra Trackers', icon: <Sliders className="w-5 h-5" /> },
    {
      id: 'gamification',
      label: 'Badges & Level',
      icon: <Award className="w-5 h-5" />,
      badge: `Lvl ${gamification.level}`,
    },
    { id: 'settings', label: 'Settings & Backup', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 glass-panel border-r border-slate-200 dark:border-white/10 min-h-screen p-5 shrink-0 sticky top-0 h-screen select-none">
      {/* Brand logo */}
      <div className="flex items-center gap-3 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-black tracking-tight text-slate-900 dark:text-white">
            100-Day Tracker
          </h2>
          <p className="text-[11px] font-semibold text-slate-400">
            Life Transformation OS
          </p>
        </div>
      </div>

      {/* Challenge Progress Mini Bar */}
      <div className="my-5 p-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
        <div className="flex justify-between items-center text-xs font-bold mb-1.5">
          <span className="text-slate-500 dark:text-slate-400">Challenge Progress</span>
          <span className="text-indigo-600 dark:text-indigo-400 font-mono">
            {Math.min(100, Math.round((currentDayNumber / 100) * 100))}%
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
            style={{ width: `${Math.min(100, currentDayNumber)}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
          <span>Day {currentDayNumber}</span>
          <span className="flex items-center gap-1 font-semibold text-orange-500">
            <Flame className="w-3.5 h-3.5" />
            {gamification.currentStreak}d Streak
          </span>
          <span>Day 100</span>
        </div>
      </div>

      {/* Nav List */}
      <nav className="space-y-1.5 flex-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-md font-extrabold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-indigo-500/10 text-indigo-500 dark:text-indigo-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Level Info */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs font-semibold mb-1">
          <span className="text-slate-500 dark:text-slate-400">Level {gamification.level}</span>
          <span className="text-amber-500 font-bold">{gamification.levelTitle}</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
          <div
            className="h-full rounded-full bg-amber-500 transition-all duration-300"
            style={{ width: `${gamification.levelProgress}%` }}
          />
        </div>
        <div className="text-[10px] text-slate-400 mt-1 text-right">
          {gamification.xpToNextLevel} XP to Level {gamification.level + 1}
        </div>

        {/* Account Info & Logout */}
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          {firebaseUser ? (
            <>
              <div className="flex items-center gap-2 min-w-0 pr-1">
                {firebaseUser.photoURL ? (
                  <img src={firebaseUser.photoURL} alt="Avatar" className="w-5 h-5 rounded-full shrink-0 border border-indigo-500/40" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                    {(firebaseUser.displayName || firebaseUser.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300 truncate">
                  {firebaseUser.email?.split('@')[0]}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Log out of ${firebaseUser.email} and switch account?`)) {
                    logoutAction();
                  }
                }}
                className="text-[10px] font-bold text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 px-2 py-1 rounded-lg transition-colors shrink-0"
                title="Log Out / Switch Account"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={loginWithGoogleAction}
              className="w-full py-1.5 px-2 rounded-xl bg-indigo-600 text-white text-[11px] font-bold hover:bg-indigo-700 transition-colors text-center"
            >
              Sign In with Google
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
