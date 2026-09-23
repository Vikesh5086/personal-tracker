import React from 'react';
import {
  Flame,
  Trophy,
  CheckCircle2,
  Calendar,
  Zap,
  Award,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HeatmapGrid } from './HeatmapGrid';
import { MiniHeatmaps } from './MiniHeatmaps';
import { TrendCharts } from './TrendCharts';
import { WeeklyInsights } from './WeeklyInsights';

export const CombinedOverview: React.FC = () => {
  const { currentLog, currentDate, currentDayNumber, gamification, profile } = useApp();

  const completion = currentLog?.completionPercentage || 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner with mixed summary: Rings + Streaks + Completion Bar */}
      <div className="p-6 rounded-3xl glass-panel shadow-lg border border-slate-200/80 dark:border-white/10 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
          {/* Main Completion & Streaks */}
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                Performance Dashboard
              </span>
              <span className="text-xs text-slate-400">
                Day {currentDayNumber} of 100
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Overall Journey Overview
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Track your cumulative consistency, streaks, habit clusters, and trend lines across the 100 days.
            </p>

            {/* Streak Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
              <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-orange-500 text-white shrink-0">
                  <Flame className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="text-lg font-black font-mono text-orange-600 dark:text-orange-400 leading-tight">
                    {gamification.currentStreak} Days
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                    Active Streak
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500 text-slate-950 shrink-0">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-black font-mono text-amber-600 dark:text-amber-400 leading-tight">
                    {gamification.perfectStreak} Days
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                    Perfect Streak
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500 text-white shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400 leading-tight">
                    {gamification.perfectDaysCount}
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                    100% Days
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-500 text-white shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-black font-mono text-purple-600 dark:text-purple-400 leading-tight">
                    {gamification.totalXp}
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                    Total XP
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Ring & Status */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center shrink-0 min-w-[220px]">
            <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider mb-2">
              Today's Completion
            </span>
            <div className="relative w-24 h-24 flex items-center justify-center my-1">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200 dark:text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-indigo-500 transition-all duration-700"
                  strokeDasharray={`${completion}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-xl font-black font-mono text-slate-900 dark:text-white">
                  {completion}%
                </span>
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
              {currentDate}
            </span>
          </div>
        </div>
      </div>

      {/* GitHub-style Heatmap */}
      <HeatmapGrid />

      {/* This Week vs Last Week Insights */}
      <WeeklyInsights />

      {/* Mini Heatmaps Per Habit */}
      <MiniHeatmaps />

      {/* Habit Trend Charts */}
      <TrendCharts />
    </div>
  );
};
