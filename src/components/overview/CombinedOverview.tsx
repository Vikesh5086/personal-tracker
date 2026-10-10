import React, { useMemo } from 'react';
import { Flame, Trophy, CheckCircle2, Zap, Calendar, ArrowRight, ShieldCheck, Target } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HeatmapGrid } from './HeatmapGrid';
import { MiniHeatmaps } from './MiniHeatmaps';
import { TrendCharts } from './TrendCharts';
import { WeeklyInsights } from './WeeklyInsights';

export const CombinedOverview: React.FC = () => {
  const { currentLog, currentDate, currentDayNumber, gamification, profile, allLogs } = useApp();

  // Compute overall average completion rate across all recorded days
  const stats = useMemo(() => {
    if (allLogs.length === 0) {
      return { avgRate: 0, totalReps: 0, daysWithActivity: 0 };
    }
    let totalComp = 0;
    let daysActive = 0;
    let habitsSum = 0;

    allLogs.forEach((l) => {
      if (l.completionPercentage > 0) {
        daysActive++;
        totalComp += l.completionPercentage;
      }
      if (l.dsa?.questionsSolved) habitsSum += l.dsa.questionsSolved;
      if (l.workout?.type && l.workout.type !== 'None') habitsSum += 1;
      if (l.water?.intakeLitres) habitsSum += 1;
      if (l.sleep?.completed) habitsSum += 1;
      if (l.eating?.type && l.eating.type !== 'None') habitsSum += 1;
    });

    const avg = daysActive > 0 ? Math.round(totalComp / daysActive) : 0;
    return {
      avgRate: avg,
      totalReps: habitsSum,
      daysWithActivity: daysActive,
    };
  }, [allLogs]);

  return (
    <div className="space-y-6 pb-12 text-slate-900 dark:text-slate-100">
      {/* Overview Top Command Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400 bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] px-2.5 py-0.5 rounded-md">
              PROTOCOL // CHRONICLE
            </span>
            <span className="font-mono text-[11px] text-slate-400 dark:text-zinc-500">
              DAY {String(currentDayNumber).padStart(3, '0')} // 100
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            100-Day Discipline Chronicle
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1 max-w-2xl">
            Personal streak telemetry, GitHub-style consistency matrix, and habit execution history. Built exclusively for your 100-day journey.
          </p>
        </div>

        {/* Challenge Period Range Tag */}
        {profile && (
          <div className="font-mono text-xs text-slate-600 dark:text-zinc-400 bg-white dark:bg-[#161a25] border border-slate-200 dark:border-white/[0.08] px-3.5 py-2 rounded-xl shrink-0 self-start md:self-auto flex items-center gap-2 shadow-xs dark:shadow-none">
            <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
            <span>{profile.startDate}</span>
            <span className="text-slate-400 dark:text-zinc-600">→</span>
            <span>{profile.endDate}</span>
          </div>
        )}
      </div>

      {/* Centerpiece 1: Cohesive Telemetry Ledger (Linear / Terminal style, NOT generic SaaS cards) */}
      <div className="rounded-2xl bg-white dark:bg-[#161a25] border border-slate-200 dark:border-white/[0.08] p-4 sm:p-5 shadow-xs dark:shadow-xl grid grid-cols-2 lg:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-white/[0.06]">
        {/* Metric 1: Current Streak */}
        <div className="pt-2 sm:pt-0 sm:px-4 first:pt-0 first:px-0 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400 font-mono text-[11px] uppercase tracking-wider mb-1">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span>Active Streak</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white tracking-tight">
            {gamification.currentStreak} <span className="text-xs font-normal text-slate-400 dark:text-zinc-500">DAYS</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-500 mt-1">
            {gamification.currentStreak > 0 ? 'Unbroken execution' : 'Start streak today'}
          </span>
        </div>

        {/* Metric 2: Perfect 100% Days */}
        <div className="pt-2 sm:pt-0 sm:px-4 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400 font-mono text-[11px] uppercase tracking-wider mb-1">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Perfect Days</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white tracking-tight">
            {gamification.perfectDaysCount} <span className="text-xs font-normal text-slate-400 dark:text-zinc-500">/ 100</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-500 mt-1">
            100% habit lock days
          </span>
        </div>

        {/* Metric 3: Active Consistency Rate */}
        <div className="pt-2 sm:pt-0 sm:px-4 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400 font-mono text-[11px] uppercase tracking-wider mb-1">
            <Target className="w-3.5 h-3.5 text-emerald-500" />
            <span>Consistency Rate</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white tracking-tight">
            {stats.avgRate}%
          </div>
          <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-500 mt-1">
            {stats.daysWithActivity} days logged
          </span>
        </div>

        {/* Metric 4: Cumulative Discipline XP */}
        <div className="pt-2 sm:pt-0 sm:px-4 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400 font-mono text-[11px] uppercase tracking-wider mb-1">
            <Zap className="w-3.5 h-3.5 text-purple-500" />
            <span>Discipline XP</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white tracking-tight">
            {gamification.totalXp.toLocaleString()} <span className="text-xs font-normal text-slate-400 dark:text-zinc-500">XP</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-500 mt-1">
            Level {gamification.level} • {gamification.levelTitle}
          </span>
        </div>
      </div>

      {/* Centerpiece 2: GitHub-Style Contribution Heatmap (PROMINENT CENTERPIECE) */}
      <HeatmapGrid />

      {/* Weekly Delta Audit */}
      <WeeklyInsights />

      {/* Habit Streak Grids */}
      <MiniHeatmaps />

      {/* Long-term Trends */}
      <TrendCharts />
    </div>
  );
};
