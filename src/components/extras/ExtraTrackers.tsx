import React from 'react';
import {
  Smartphone,
  Footprints,
  BookOpen,
  Sparkles,
  Briefcase,
  CheckCircle2,
  Plus,
  Minus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ExtraHabits } from '../../types';

export const ExtraTrackers: React.FC = () => {
  const { currentLog, updateCurrentHabit, currentDate } = useApp();

  if (!currentLog) return null;
  const extras: ExtraHabits = currentLog.extras || {
    screenTimeMinutes: 0,
    steps: 0,
    readingBookTitle: '',
    readingMinutes: 0,
    meditationMinutes: 0,
    interviewMockDone: 0,
    interviewAppsSent: 0,
    interviewNotes: '',
  };

  const handleUpdate = (partial: Partial<ExtraHabits>) => {
    updateCurrentHabit((prev) => ({
      ...prev,
      extras: {
        ...(prev.extras || {}),
        ...partial,
      },
    }));
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="p-6 rounded-3xl glass-panel shadow-md border border-slate-200 dark:border-white/10">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs uppercase font-extrabold px-3 py-1 rounded-full bg-teal-500/15 text-teal-600 dark:text-teal-400">
            Lifestyle & Growth Add-ons
          </span>
          <span className="text-xs text-slate-400">{currentDate}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          Extra Habit Trackers
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Secondary lifestyle habits: minimize digital distractions, walk 10k steps, read daily, meditate, and accelerate interview prep.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. Screen Time / Distraction Self-Log */}
        <div className="p-5 rounded-3xl glass-card border border-slate-200 dark:border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-500">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Screen Time / Distraction Log
                </h3>
                <span className="text-[11px] text-slate-400">Social Media & Dopamine Traps</span>
              </div>
            </div>
            <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-lg ${
              (extras.screenTimeMinutes || 0) <= 60
                ? 'bg-emerald-500/10 text-emerald-500'
                : 'bg-rose-500/10 text-rose-500'
            }`}>
              {(extras.screenTimeMinutes || 0) <= 60 ? 'Healthy Limit' : 'High Screen Time'}
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-rose-500/5 border border-rose-500/10">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Social Media / Doomscroll Time
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  step="5"
                  placeholder="0"
                  value={extras.screenTimeMinutes || ''}
                  onChange={(e) => handleUpdate({ screenTimeMinutes: Number(e.target.value) || 0 })}
                  className="w-16 px-2 py-1 text-xs text-center font-mono font-bold rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
                <span className="text-xs text-slate-400">mins</span>
              </div>
            </div>

            <div className="flex gap-1.5 justify-end">
              {[15, 30, 45, 60, 90].map((m) => (
                <button
                  key={m}
                  onClick={() => handleUpdate({ screenTimeMinutes: m })}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/20 text-slate-600 dark:text-slate-300 transition-colors"
                >
                  {m}m
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Steps / Daily Walk Count */}
        <div className="p-5 rounded-3xl glass-card border border-slate-200 dark:border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-500">
                <Footprints className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Daily Step Count
                </h3>
                <span className="text-[11px] text-slate-400">Target: 8,000 - 10,000 steps</span>
              </div>
            </div>
            {(extras.steps || 0) >= 8000 && (
              <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> 10k Crushed!
              </span>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Steps Walked
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  step="500"
                  placeholder="0"
                  value={extras.steps || ''}
                  onChange={(e) => handleUpdate({ steps: Number(e.target.value) || 0 })}
                  className="w-24 px-2 py-1 text-xs text-center font-mono font-bold rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
                <span className="text-xs text-slate-400">steps</span>
              </div>
            </div>

            {/* Quick buttons */}
            <div className="flex gap-1.5 justify-end">
              {[5000, 8000, 10000, 12000].map((s) => (
                <button
                  key={s}
                  onClick={() => handleUpdate({ steps: s })}
                  className="px-2 py-1 text-[11px] font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500/20 text-slate-600 dark:text-slate-300 transition-colors"
                >
                  {(s / 1000).toFixed(0)}k
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Reading Habit Log */}
        <div className="p-5 rounded-3xl glass-card border border-slate-200 dark:border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-500">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Reading Habit Log
                </h3>
                <span className="text-[11px] text-slate-400">Books, Papers, or Articles</span>
              </div>
            </div>
            <span className="text-xs font-bold text-indigo-500 font-mono">
              {extras.readingMinutes || 0} mins read
            </span>
          </div>

          <div className="space-y-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Book / Article Title
              </label>
              <input
                type="text"
                placeholder="e.g. Atomic Habits, Designing Data-Intensive Applications..."
                value={extras.readingBookTitle || ''}
                onChange={(e) => handleUpdate({ readingBookTitle: e.target.value })}
                className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Time Spent Reading
              </span>
              <div className="flex items-center gap-1.5">
                {[15, 20, 30, 45].map((m) => (
                  <button
                    key={m}
                    onClick={() => handleUpdate({ readingMinutes: m })}
                    className="px-2 py-0.5 text-[11px] rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  >
                    {m}m
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Meditation & Mindfulness */}
        <div className="p-5 rounded-3xl glass-card border border-slate-200 dark:border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-500">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Meditation & Breathwork
                </h3>
                <span className="text-[11px] text-slate-400">Stress Reduction & Mental Stillness</span>
              </div>
            </div>
            <span className="text-xs font-bold text-cyan-500 font-mono">
              {extras.meditationMinutes || 0} mins
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-cyan-500/5 border border-cyan-500/10">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Mindfulness Duration
              </span>
              <div className="flex items-center gap-1.5">
                {[5, 10, 15, 20].map((m) => (
                  <button
                    key={m}
                    onClick={() => handleUpdate({ meditationMinutes: m })}
                    className={`px-3 py-1 text-xs font-bold rounded-xl transition-all ${
                      extras.meditationMinutes === m
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {m}m
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Interview Prep Module */}
      <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Interview Prep & Career Pipeline
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track mock interviews, system design sessions, and job applications sent.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Mock Interviews Completed
              </span>
              <span className="text-2xl font-black text-amber-500 font-mono">
                {extras.interviewMockDone || 0}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleUpdate({ interviewMockDone: Math.max(0, (extras.interviewMockDone || 0) - 1) })}
                className="p-1.5 rounded-xl bg-white dark:bg-slate-800 border text-slate-500"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleUpdate({ interviewMockDone: (extras.interviewMockDone || 0) + 1 })}
                className="p-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold shadow-sm"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Applications Sent Today
              </span>
              <span className="text-2xl font-black text-blue-500 font-mono">
                {extras.interviewAppsSent || 0}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleUpdate({ interviewAppsSent: Math.max(0, (extras.interviewAppsSent || 0) - 1) })}
                className="p-1.5 rounded-xl bg-white dark:bg-slate-800 border text-slate-500"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleUpdate({ interviewAppsSent: (extras.interviewAppsSent || 0) + 1 })}
                className="p-1.5 rounded-xl bg-blue-600 text-white font-bold shadow-sm"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
            Interview Notes / Target Companies
          </label>
          <input
            type="text"
            placeholder="e.g. Practiced System Design (Rate Limiter), sent 3 referrals..."
            value={extras.interviewNotes || ''}
            onChange={(e) => handleUpdate({ interviewNotes: e.target.value })}
            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          />
        </div>
      </div>
    </div>
  );
};
