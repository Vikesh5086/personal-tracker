import React from 'react';
import {
  Sparkles,
  Trophy,
  CheckCircle2,
  Calendar,
  Flame,
  ArrowRight,
  Zap,
  Code2,
  Dumbbell,
  Droplet,
  Lightbulb,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DsaCard } from './DsaCard';
import { WorkoutCard } from './WorkoutCard';
import { EatingCard } from './EatingCard';
import { AiMlCard } from './AiMlCard';
import { WaterCard } from './WaterCard';
import { SleepCard } from './SleepCard';
import { PhotoCard } from './PhotoCard';
import { JournalMoodCard } from './JournalMoodCard';
import { PrioritiesCard } from './PrioritiesCard';
import { LearnedCard } from './LearnedCard';
import { QuoteHeroBanner } from './QuoteHeroBanner';
import { ReminderBanner } from '../layout/ReminderBanner';
import { sounds } from '../../services/sound';

export const DailyDashboard: React.FC = () => {
  const { currentLog, currentDate, currentDayNumber, fireConfetti, setActiveTab, updateCurrentHabit } = useApp();

  if (!currentLog) return null;

  const completion = currentLog.completionPercentage || 0;
  const isPerfect = currentLog.isPerfectDay;

  // Quick Action shortcuts
  const handleQuickAddWater = () => {
    sounds.playWater();
    updateCurrentHabit((prev) => ({
      ...prev,
      water: {
        ...prev.water,
        intakeLitres: Math.round(((prev.water.intakeLitres || 0) + 0.25) * 10) / 10,
        completed: (prev.water.intakeLitres + 0.25) >= 2.0,
      },
    }));
  };

  const handleQuickAddDsa = () => {
    sounds.playTap();
    updateCurrentHabit((prev) => ({
      ...prev,
      dsa: {
        ...prev.dsa,
        questionsSolved: (prev.dsa.questionsSolved || 0) + 1,
        completed: true,
      },
    }));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Evening Reminder Banner if missing habits */}
      <ReminderBanner />

      {/* Prominent, Big Inspiring Daily Motivational Quote Hero */}
      <QuoteHeroBanner />

      {/* Daily Progress Banner */}
      <div className={`p-5 sm:p-6 rounded-3xl glass-panel relative overflow-hidden shadow-xl border transition-all duration-300 ${
        isPerfect
          ? 'border-amber-400/50 shadow-amber-500/10 ring-1 ring-amber-400/30'
          : 'border-slate-200/80 dark:border-white/10'
      }`}>
        {/* Ambient Top Glow Line */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 transition-all duration-500 ${
          isPerfect
            ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500'
            : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400'
        }`} />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className={`text-xs uppercase tracking-wider font-extrabold px-3 py-1 rounded-full ${
                isPerfect
                  ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                  : 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400'
              }`}>
                Day {currentDayNumber} Focus
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {currentDate}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5 flex-wrap">
              <span>Daily Completion: {completion}%</span>
              {isPerfect && (
                <span className="shimmer-badge text-xs uppercase tracking-widest font-black px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-lg shadow-amber-500/30 flex items-center gap-1.5 animate-bounce">
                  <Trophy className="w-4 h-4 fill-slate-950" />
                  PERFECT DAY!
                </span>
              )}
            </h2>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {completion === 100
                ? 'Flawless execution! All 10 habits locked in for today. +150 Bonus XP awarded! 🚀'
                : completion >= 60
                ? 'Strong momentum! Just a couple habits left to hit a 100% perfect day.'
                : 'Every single rep counts. Check off your habits below to build streak momentum and earn XP.'}
            </p>

            {/* Quick Action Pills */}
            <div className="flex items-center gap-2 pt-2 flex-wrap">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Quick Log:
              </span>
              <button
                onClick={handleQuickAddDsa}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 border border-purple-500/20 flex items-center gap-1 transition-all active:scale-95"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>+1 DSA Problem</span>
              </button>
              <button
                onClick={handleQuickAddWater}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20 flex items-center gap-1 transition-all active:scale-95"
              >
                <Droplet className="w-3.5 h-3.5" />
                <span>+250ml Water</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics & Radial Ring */}
          <div className="flex items-center gap-4 self-start lg:self-auto shrink-0">
            <div className="text-center px-4 py-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 shadow-inner">
              <span className="text-[10px] uppercase font-bold text-indigo-400 block">
                XP Today
              </span>
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
                +{currentLog.xpEarned}
              </span>
            </div>

            {/* Circular Gauge */}
            <div className="relative w-18 h-18 flex items-center justify-center">
              <svg className="w-18 h-18 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200 dark:text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={`${
                    isPerfect ? 'text-amber-400' : 'text-indigo-500'
                  } transition-all duration-700`}
                  strokeDasharray={`${completion}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-sm font-black font-mono text-slate-800 dark:text-white">
                {completion}%
              </span>
            </div>
          </div>
        </div>

        {/* Linear progress bar */}
        <div className="mt-4 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700/60 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isPerfect
                ? 'bg-gradient-to-r from-amber-400 to-yellow-300'
                : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400'
            }`}
            style={{ width: `${completion}%` }}
          />
        </div>

        {/* Hotkeys reminder banner */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-mono">
          <span>Hotkeys: [← / →] Shift Day • [T] Today</span>
          <span>10 Core Habits Total</span>
        </div>
      </div>

      {/* Grid of Habit Cards (Now with Learned Something New Card!) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {/* 1. Learned Something New Today? (Amber/Gold) */}
        <LearnedCard />

        {/* 2. DSA / LeetCode (purple) */}
        <DsaCard />

        {/* 3. Workout (orange) */}
        <WorkoutCard />

        {/* 4. Eating Healthy (green) */}
        <EatingCard />

        {/* 5. AI/ML Learning (blue) */}
        <AiMlCard />

        {/* 6. Water Intake (cyan) */}
        <WaterCard />

        {/* 7. Sleep (indigo) */}
        <SleepCard />

        {/* 8. Daily Photo (pink) */}
        <PhotoCard />

        {/* 9. Journal / Mood (yellow) */}
        <JournalMoodCard />

        {/* 10. Top 3 Priorities (teal) */}
        <PrioritiesCard />
      </div>

      {/* Quick Footer Links */}
      <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="text-slate-500 dark:text-slate-400">
          Want to log extra routines like Screen Time, Steps, Reading, or Interview Prep?
        </span>
        <button
          onClick={() => {
            sounds.playTap();
            setActiveTab('extras');
          }}
          className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
        >
          <span>Open Extra Trackers</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
