import React, { useState } from 'react';
import { Bell, ChevronRight, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReminderBanner: React.FC = () => {
  const { currentLog, currentDate, todayDate, setActiveTab } = useApp();
  const [dismissed, setDismissed] = useState(false);

  // Only display for today's date
  if (currentDate !== todayDate || dismissed || !currentLog) {
    return null;
  }

  // Check current time of day: show in evening (>= 18:00) or afternoon
  const currentHour = new Date().getHours();
  if (currentHour < 17) {
    return null;
  }

  // Check unlogged critical habits
  const missingHabits: string[] = [];
  if (!currentLog.water.completed && currentLog.water.intakeLitres < 1.5) missingHabits.push('Hydration');
  if (!currentLog.workout.completed && currentLog.workout.type === 'None') missingHabits.push('Workout');
  if (!currentLog.dsa.completed && currentLog.dsa.questionsSolved === 0) missingHabits.push('DSA Practice');
  if (!currentLog.eating.completed && currentLog.eating.type === 'None') missingHabits.push('Nutrition');

  if (missingHabits.length === 0) {
    return null;
  }

  return (
    <div className="relative mb-6 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-yellow-500/15 border border-amber-500/30 p-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/30">
            <Bell className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Evening Check-In</span>
              <span className="text-xs font-normal text-amber-600 dark:text-amber-400">
                • {missingHabits.length} habit{missingHabits.length > 1 ? 's' : ''} left to lock in
              </span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Still unlogged today: <span className="font-semibold text-amber-600 dark:text-amber-400">{missingHabits.join(', ')}</span>. Keep your streak alive!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-sm transition-all flex items-center gap-1 shrink-0"
          >
            <span>Log Now</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            title="Dismiss reminder"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
