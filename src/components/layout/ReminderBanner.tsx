import React, { useState } from 'react';
import { Bell, ChevronRight, X, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReminderBanner: React.FC = () => {
  const { currentLog, currentDate, todayDate, setActiveTab } = useApp();
  const [dismissed, setDismissed] = useState(false);

  // Only display for today's date
  if (currentDate !== todayDate || dismissed || !currentLog) {
    return null;
  }

  // Check current time of day: show in evening (>= 17:00)
  const currentHour = new Date().getHours();
  if (currentHour < 17) {
    return null;
  }

  // Check unlogged critical habits
  const missingHabits: string[] = [];
  if (!currentLog.water.completed && currentLog.water.intakeLitres < 1.5) missingHabits.push('Hydration');
  if (!currentLog.workout.completed && currentLog.workout.type === 'None') missingHabits.push('Workout');
  if (!currentLog.dsa.completed && currentLog.dsa.questionsSolved === 0) missingHabits.push('DSA');
  if (!currentLog.eating.completed && currentLog.eating.type === 'None') missingHabits.push('Nutrition');

  if (missingHabits.length === 0) {
    return null;
  }

  return (
    <div className="relative mb-6 rounded-xl bg-zinc-900/90 border border-amber-500/30 p-4 shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400 shrink-0">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <span>EVENING PROTOCOL CHECK-IN</span>
              <span className="text-[11px] font-normal text-amber-400">
                • {missingHabits.length} pending protocol{missingHabits.length > 1 ? 's' : ''}
              </span>
            </h4>
            <p className="text-xs text-zinc-400 mt-0.5">
              Pending today: <span className="font-semibold text-zinc-200">{missingHabits.join(', ')}</span>. Keep your streak intact!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-zinc-950 bg-amber-400 hover:bg-amber-300 shadow-sm transition-all flex items-center gap-1 shrink-0"
          >
            <span>Execute</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-white bg-zinc-800"
            title="Dismiss reminder"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
