import React from 'react';
import {
  Trophy,
  Flame,
  Award,
  Sparkles,
  Lock,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LEVEL_TITLES } from '../../services/gamification';

export const BadgesView: React.FC = () => {
  const { gamification, currentDayNumber, fireConfetti } = useApp();

  const categories = [
    { id: 'streaks', name: 'Streak Badges' },
    { id: 'habits', name: 'Habit Mastery' },
    { id: 'milestones', name: 'Challenge Milestones' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Level Banner */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel shadow-xl border border-slate-200/80 dark:border-white/10 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-400 flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/30 shrink-0">
              <Trophy className="w-10 h-10" />
              <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-slate-900 border-2 border-amber-400 text-amber-400 flex items-center justify-center text-[10px] font-black">
                {gamification.level}
              </div>
            </div>

            <div>
              <span className="text-xs uppercase font-extrabold px-3 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                Level {gamification.level} Rank
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                {gamification.levelTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {gamification.totalXp} Total XP earned • {gamification.perfectDaysCount} perfect 100% days
              </p>
            </div>
          </div>

          {/* XP Progress to Next Level */}
          <div className="w-full md:w-72 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center text-xs font-bold mb-1.5">
              <span className="text-slate-500 dark:text-slate-400">Next Level</span>
              <span className="text-amber-500 font-mono">
                {gamification.xpToNextLevel} XP needed
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500"
                style={{ width: `${gamification.levelProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>Lvl {gamification.level}</span>
              <span>{gamification.levelProgress}%</span>
              <span>Lvl {gamification.level + 1}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ranks Ladder */}
      <div className="p-5 rounded-3xl glass-card border border-slate-200 dark:border-white/10">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
          Level Progression Ladder
        </h3>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {LEVEL_TITLES.map((lvl) => {
            const isReached = gamification.level >= lvl.level;
            const isCurrent = gamification.level === lvl.level;
            return (
              <div
                key={lvl.level}
                className={`p-3 rounded-2xl border min-w-[130px] shrink-0 transition-all ${
                  isCurrent
                    ? 'bg-amber-500/15 border-amber-500 shadow-md shadow-amber-500/10'
                    : isReached
                    ? 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
                    : 'bg-slate-100/40 dark:bg-slate-900/20 border-dashed border-slate-200 dark:border-slate-800 opacity-50'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono font-bold mb-1">
                  <span className={isCurrent ? 'text-amber-500' : 'text-slate-400'}>
                    Lvl {lvl.level}
                  </span>
                  {isReached && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-white truncate">
                  {lvl.title}
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-1">
                  {lvl.xpReq} XP
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievement Badges Grid */}
      <div className="space-y-6">
        {categories.map((cat) => {
          const badges = gamification.unlockedBadges.filter((b) => b.category === cat.id);
          if (badges.length === 0) return null;

          return (
            <div key={cat.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-500" />
                  <span>{cat.name}</span>
                </h3>
                <span className="text-xs text-slate-400">
                  {badges.filter((b) => b.unlockedAt).length} / {badges.length} Unlocked
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {badges.map((badge) => {
                  const isUnlocked = Boolean(badge.unlockedAt);
                  const percent = Math.min(100, Math.round((badge.progress / badge.maxProgress) * 100));

                  return (
                    <div
                      key={badge.id}
                      className={`p-4 rounded-3xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                        isUnlocked
                          ? 'glass-card border-amber-500/40 shadow-lg shadow-amber-500/5'
                          : 'bg-slate-50/60 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800 opacity-60'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-md ${
                            isUnlocked
                              ? 'bg-gradient-to-tr from-amber-400/20 to-yellow-300/30 border border-amber-400/40 shadow-amber-500/20'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                          }`}>
                            {badge.icon}
                          </div>

                          {isUnlocked ? (
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                              Unlocked
                            </span>
                          ) : (
                            <div className="p-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-400">
                              <Lock className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {badge.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                          {badge.description}
                        </p>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                        <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                          <span>Progress</span>
                          <span>
                            {badge.progress} / {badge.maxProgress} ({percent}%)
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isUnlocked ? 'bg-amber-400' : 'bg-indigo-500'
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
