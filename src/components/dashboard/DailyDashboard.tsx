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

      {/* Daily Progress Discipline Console */}
      <div className={`p-5 sm:p-6 rounded-2xl bg-[#0b0f19] border transition-all duration-300 shadow-xl ${
        isPerfect
          ? 'border-amber-400/40 shadow-amber-500/5 ring-1 ring-amber-400/20'
          : 'border-white/[0.08]'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className={`font-mono text-[11px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-md border ${
                isPerfect
                  ? 'bg-amber-400/10 text-amber-300 border-amber-400/30'
                  : 'bg-white/[0.05] text-zinc-300 border-white/[0.08]'
              }`}>
                PROTOCOL // DAY {String(currentDayNumber).padStart(3, '0')}
              </span>
              <span className="text-xs text-zinc-500 font-mono">
                {currentDate}
              </span>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono">
                {completion}% COMPLETED
              </h2>
              {isPerfect && (
                <span className="font-mono text-xs uppercase tracking-widest font-black px-2.5 py-1 rounded-md bg-amber-400 text-zinc-950 flex items-center gap-1.5 shadow-sm">
                  <Trophy className="w-3.5 h-3.5 fill-zinc-950" />
                  PERFECT DAY LOCKED
                </span>
              )}
            </div>

            <p className="text-xs text-zinc-400 max-w-xl">
              {completion === 100
                ? 'All 10 protocols locked in for today. Flawless discipline streak maintained. +150 Bonus XP awarded.'
                : completion >= 60
                ? 'Over halfway through today\'s protocols. Execute the remaining habits to secure a 100% perfect day.'
                : 'Every single rep counts. Check off your core habits below to build uninterrupted consistency.'}
            </p>

            {/* Quick Action Pills */}
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider">
                Quick Log:
              </span>
              <button
                type="button"
                onClick={handleQuickAddDsa}
                className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-zinc-900 border border-white/[0.08] text-zinc-300 hover:text-white hover:bg-zinc-800 flex items-center gap-1.5 transition-all active:scale-95"
              >
                <Code2 className="w-3.5 h-3.5 text-purple-400" />
                <span>+1 DSA</span>
              </button>
              <button
                type="button"
                onClick={handleQuickAddWater}
                className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-zinc-900 border border-white/[0.08] text-zinc-300 hover:text-white hover:bg-zinc-800 flex items-center gap-1.5 transition-all active:scale-95"
              >
                <Droplet className="w-3.5 h-3.5 text-cyan-400" />
                <span>+250ml Water</span>
              </button>
            </div>
          </div>

          {/* Telemetry Telemetry Block */}
          <div className="flex items-center gap-4 self-start lg:self-auto shrink-0 bg-zinc-900/60 border border-white/[0.06] p-4 rounded-xl font-mono">
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-500 block">
                Discipline Lock
              </span>
              <span className="text-2xl font-black text-white">
                {Math.round((completion / 100) * 10)} <span className="text-xs text-zinc-500 font-normal">/ 10</span>
              </span>
            </div>
            <div className="h-8 w-[1px] bg-white/[0.08]" />
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-500 block">
                Today XP
              </span>
              <span className="text-2xl font-black text-amber-400">
                +{currentLog.xpEarned}
              </span>
            </div>
          </div>
        </div>

        {/* 10-Segmented Protocol Progress Track (GitHub-inspired tactile bars) */}
        <div className="mt-5 space-y-2">
          <div className="grid grid-cols-10 gap-1.5 sm:gap-2">
            {Array.from({ length: 10 }).map((_, index) => {
              const activeCount = Math.round((completion / 100) * 10);
              const isFilled = index < activeCount;
              return (
                <div
                  key={`seg-${index}`}
                  className={`h-2 sm:h-2.5 rounded-sm transition-all duration-300 ${
                    isFilled
                      ? isPerfect
                        ? 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]'
                        : 'shadow-[0_0_6px_rgba(var(--primary-accent-rgb),0.5)]'
                      : 'bg-zinc-800/80 border border-white/[0.04]'
                  }`}
                  style={{
                    backgroundColor: isFilled && !isPerfect ? 'var(--primary-accent)' : undefined,
                  }}
                  title={`Protocol ${index + 1}: ${isFilled ? 'Locked' : 'Pending'}`}
                />
              );
            })}
          </div>

          {/* Telemetry info bar */}
          <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono pt-1">
            <span>[← / →] Shift Day • [T] Jump to Today</span>
            <span>10 Core Protocols Daily</span>
          </div>
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
      <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/[0.06] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <span className="text-zinc-400">
          Looking for Extra Routines (Screen Time, Steps, Reading, Interview Prep)?
        </span>
        <button
          onClick={() => {
            sounds.playTap();
            setActiveTab('extras');
          }}
          className="font-bold text-white hover:text-emerald-400 hover:underline flex items-center gap-1.5 transition-colors"
        >
          <span>Open Extra Trackers</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
