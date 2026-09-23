import React, { useState } from 'react';
import {
  CheckSquare,
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

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const primaryItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Habits', icon: <CheckSquare className="w-5 h-5" /> },
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar className="w-5 h-5" /> },
    { id: 'productivity', label: 'Focus', icon: <Clock className="w-5 h-5" /> },
  ];

  const secondaryItems: { id: NavTab; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'extras', label: 'Extra Trackers', icon: <Sliders className="w-5 h-5 text-teal-500" />, desc: 'Screen time, steps, reading, interview' },
    { id: 'gamification', label: 'Badges & Level', icon: <Award className="w-5 h-5 text-amber-500" />, desc: 'Achievements, XP, streaks' },
    { id: 'settings', label: 'Settings & Backup', icon: <Settings className="w-5 h-5 text-indigo-500" />, desc: 'Theme, profile, backup, reset' },
  ];

  const isMoreActive = ['extras', 'gamification', 'settings'].includes(activeTab);

  return (
    <>
      {/* More Sheet for Mobile */}
      {showMoreMenu && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex flex-col justify-end">
          <div
            className="fixed inset-0"
            onClick={() => setShowMoreMenu(false)}
          />
          <div className="relative glass-panel rounded-t-3xl p-5 border-t border-slate-200 dark:border-white/10 z-50 animate-in slide-in-from-bottom duration-200 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Additional Tools
              </span>
              <button
                onClick={() => setShowMoreMenu(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 mb-6">
              {secondaryItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setShowMoreMenu(false);
                  }}
                  className={`w-full flex items-center gap-3.5 p-3 rounded-2xl text-left transition-all ${
                    activeTab === item.id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <div className={`p-2 rounded-xl ${activeTab === item.id ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-xs font-bold">{item.label}</div>
                    <div className={`text-[11px] ${activeTab === item.id ? 'text-indigo-100' : 'text-slate-400'}`}>
                      {item.desc}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Fixed Bottom Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 glass-panel border-t border-slate-200 dark:border-white/10 px-2 py-1.5 flex items-center justify-around shadow-lg">
        {primaryItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 scale-105 font-bold'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              {item.icon}
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}

        <button
          onClick={() => setShowMoreMenu(true)}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            isMoreActive
              ? 'text-indigo-600 dark:text-indigo-400 scale-105 font-bold'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">More</span>
        </button>
      </nav>
    </>
  );
};
