import React from 'react';
import { Moon, CheckCircle2, Circle, Sunrise, Sunset, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { sounds } from '../../services/sound';

function calculateSleepDuration(bedTime: string, wakeTime: string): number {
  if (!bedTime || !wakeTime) return 0;
  const [bH, bM] = bedTime.split(':').map(Number);
  const [wH, wM] = wakeTime.split(':').map(Number);

  let bedMinutes = bH * 60 + bM;
  let wakeMinutes = wH * 60 + wM;

  if (wakeMinutes < bedMinutes) {
    // Crosses midnight
    wakeMinutes += 24 * 60;
  }

  const diffMins = wakeMinutes - bedMinutes;
  return Math.round((diffMins / 60) * 10) / 10;
}

export const SleepCard: React.FC = () => {
  const { currentLog, updateCurrentHabit } = useApp();

  if (!currentLog) return null;
  const sleep = currentLog.sleep;

  const isCompleted = Boolean(sleep.completed);

  const handleUpdate = (partial: Partial<typeof sleep>) => {
    updateCurrentHabit((prev) => {
      const nextBed = partial.bedTime ?? prev.sleep.bedTime;
      const nextWake = partial.wakeTime ?? prev.sleep.wakeTime;
      const duration = calculateSleepDuration(nextBed, nextWake);
      const nextCompleted = partial.completed !== undefined ? partial.completed : prev.sleep.completed;

      return {
        ...prev,
        sleep: {
          ...prev.sleep,
          ...partial,
          durationHours: duration,
          completed: nextCompleted,
        },
      };
    });
  };

  const handleToggleComplete = () => {
    if (isCompleted) {
      sounds.playTap();
      handleUpdate({ completed: false });
    } else {
      sounds.playCheck();
      handleUpdate({ completed: true });
    }
  };

  // Sleep evaluation
  const getQualityText = (hours: number) => {
    if (hours >= 7.5 && hours <= 9.0) return { text: 'Optimal Rest', color: 'text-emerald-500' };
    if (hours >= 6.0 && hours < 7.5) return { text: 'Adequate Rest', color: 'text-amber-500' };
    if (hours > 9.0) return { text: 'Extended Recovery', color: 'text-blue-500' };
    return { text: 'Sleep Deprived', color: 'text-rose-500' };
  };

  const quality = getQualityText(sleep.durationHours);
  const barPercent = Math.min(100, Math.round((sleep.durationHours / 10) * 100));

  return (
    <div className={`rounded-3xl p-5 border transition-all duration-200 glass-card relative overflow-hidden ${
      isCompleted
        ? 'border-indigo-500/40 shadow-indigo-500/5 shadow-lg'
        : 'border-slate-200 dark:border-white/10'
    }`}>
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500" />

      {/* Card Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Moon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Sleep & Recovery</span>
            </h3>
            <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
              Biological Restoration
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleToggleComplete}
          className={`p-1.5 rounded-xl transition-colors ${
            isCompleted
              ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
          title={isCompleted ? 'Marked complete (click to undo / uncheck)' : 'Click to mark complete'}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 fill-indigo-500 text-white" />
          ) : (
            <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
          )}
        </button>
      </div>

      {/* Time Picker Controls */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
          <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1">
            <Sunset className="w-3.5 h-3.5 text-indigo-400" />
            <span>Bedtime</span>
          </label>
          <input
            type="time"
            value={sleep.bedTime}
            onChange={(e) => handleUpdate({ bedTime: e.target.value })}
            className="w-full px-2 py-1 text-xs font-mono font-bold rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="p-3 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
          <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1">
            <Sunrise className="w-3.5 h-3.5 text-amber-400" />
            <span>Wake Time</span>
          </label>
          <input
            type="time"
            value={sleep.wakeTime}
            onChange={(e) => handleUpdate({ wakeTime: e.target.value })}
            className="w-full px-2 py-1 text-xs font-mono font-bold rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Duration Bar & Auto-Calculation */}
      <div className={`p-3.5 rounded-2xl border transition-all ${
        isCompleted
          ? 'bg-slate-50 dark:bg-slate-800/60 border-indigo-500/20'
          : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-800'
      }`}>
        <div className="flex items-baseline justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Clock className={`w-4 h-4 ${isCompleted ? 'text-indigo-500' : 'text-slate-400'}`} />
            <span className={`text-xl font-black font-mono ${isCompleted ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
              {sleep.durationHours} <span className="text-xs font-normal text-slate-400">hours</span>
            </span>
          </div>
          {isCompleted ? (
            <span className={`text-xs font-bold ${quality.color}`}>
              {quality.text}
            </span>
          ) : (
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
              Not Logged Yet
            </span>
          )}
        </div>

        {/* Visual Duration Bar */}
        <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden relative">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isCompleted
                ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400'
                : 'bg-slate-300 dark:bg-slate-600 opacity-30'
            }`}
            style={{ width: `${barPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>0h</span>
          <span className="font-semibold text-indigo-400">Target: 7.5 - 8.5h</span>
          <span>10h+</span>
        </div>
      </div>

      {/* Prominent Toggle Button */}
      <button
        type="button"
        onClick={handleToggleComplete}
        className={`w-full mt-3.5 py-2.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
          isCompleted
            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20 hover:from-indigo-500 hover:to-purple-500'
            : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20'
        }`}
      >
        {isCompleted ? (
          <>
            <CheckCircle2 className="w-4 h-4 fill-white text-indigo-600" />
            <span>✓ Sleep Logged ({sleep.durationHours}h) • Tap to Undo / Uncheck</span>
          </>
        ) : (
          <>
            <Moon className="w-4 h-4" />
            <span>Confirm Sleep ({sleep.durationHours}h)</span>
          </>
        )}
      </button>
    </div>
  );
};
