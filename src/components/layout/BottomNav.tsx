import React, { useState } from 'react';
import {
  CheckSquare,
  Utensils,
  BarChart3,
  Calendar,
  Clock,
  MoreHorizontal,
  Award,
  Sliders,
  Settings,
  X,
} from 'lucide-react';
import { useApp, NavTab } from '../../context/AppContext';
import { sounds } from '../../services/sound';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const primaryItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Log', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'food', label: 'Food', icon: <Utensils className="w-4 h-4" /> },
    { id: 'overview', label: 'Matrix', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'calendar', label: 'Archive', icon: <Calendar className="w-4 h-4" /> },
  ];

  const secondaryItems: { id: NavTab; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'productivity', label: 'Deep Work Focus', icon: <Clock className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />, desc: 'Pomodoro timer and time blocks' },
    { id: 'extras', label: 'Extra Routines', icon: <Sliders className="w-4 h-4 text-teal-500 dark:text-teal-400" />, desc: 'Screen time, steps, reading, mock prep' },
    { id: 'gamification', label: 'Ranks & Badges', icon: <Award className="w-4 h-4 text-amber-500 dark:text-amber-400" />, desc: 'Mastery milestones and discipline XP' },
    { id: 'settings', label: 'Settings & Cloud', icon: <Settings className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />, desc: 'Profile, theme, sync and data export' },
  ];

  const isMoreActive = ['productivity', 'extras', 'gamification', 'settings'].includes(activeTab);

  const handleSelectTab = (tab: NavTab) => {
    sounds.playTap();
    setActiveTab(tab);
    setShowMoreMenu(false);
  };

  return (
    <>
      {/* Mobile More Drawer */}
      {showMoreMenu && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/60 dark:bg-black/80 backdrop-blur-xs flex flex-col justify-end">
          <div className="fixed inset-0" onClick={() => setShowMoreMenu(false)} />
          <div className="relative bg-white dark:bg-[#161a25] rounded-t-2xl p-5 border-t border-slate-200 dark:border-white/[0.1] z-50 animate-in slide-in-from-bottom duration-200 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/[0.08] mb-3">
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-800 dark:text-zinc-300">
                ADDITIONAL PROTOCOLS
              </span>
              <button
                type="button"
                onClick={() => setShowMoreMenu(false)}
                className="p-1.5 rounded-lg text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-[#202533]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 mb-6">
              {secondaryItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center gap-3.5 p-3 rounded-xl text-left transition-all ${
                    activeTab === item.id
                      ? 'bg-slate-100 dark:bg-[#232938] text-slate-900 dark:text-white border border-slate-300 dark:border-white/[0.15]'
                      : 'hover:bg-slate-50 dark:hover:bg-[#1c212f] text-slate-700 dark:text-zinc-300'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-white dark:bg-[#1c212f] border border-slate-200 dark:border-white/[0.06] shadow-xs">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-xs font-bold font-mono text-slate-900 dark:text-white">{item.label}</div>
                    <div className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono">{item.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Fixed Mobile Bottom Rail */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-[#131720]/95 backdrop-blur-md border-t border-slate-200 dark:border-white/[0.08] px-2 py-2 flex items-center justify-around shadow-lg">
        {primaryItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelectTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-slate-900 dark:text-white font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              <div
                className={`p-1 rounded-lg ${
                  isActive ? 'bg-slate-100 dark:bg-[#202533] border border-slate-200 dark:border-white/[0.12] text-slate-900 dark:text-white shadow-xs' : ''
                }`}
              >
                {item.icon}
              </div>
              <span className="text-[10px] font-mono mt-0.5">{item.label}</span>
            </button>
          );
        })}

        {/* More Menu Trigger */}
        <button
          onClick={() => {
            sounds.playTap();
            setShowMoreMenu(true);
          }}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            isMoreActive ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200'
          }`}
        >
          <div
            className={`p-1 rounded-lg ${
              isMoreActive ? 'bg-slate-100 dark:bg-[#202533] border border-slate-200 dark:border-white/[0.12] text-slate-900 dark:text-white shadow-xs' : ''
            }`}
          >
            <MoreHorizontal className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-mono mt-0.5">More</span>
        </button>
      </nav>
    </>
  );
};
