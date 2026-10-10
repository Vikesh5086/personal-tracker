import React from 'react';
import { Utensils, CheckCircle, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { sounds } from '../../services/sound';

export const EatingCard: React.FC = () => {
  const { currentLog, updateCurrentHabit, setActiveTab, profile } = useApp();

  if (!currentLog) return null;
  const eating = currentLog.eating;
  const dailyTarget = profile?.dailyCalorieTarget || 2200;

  const breakfast = eating.breakfastCalories || 0;
  const lunch = eating.lunchCalories || 0;
  const dinner = eating.dinnerCalories || 0;
  const snacks = eating.snacksCalories || 0;
  const totalCalories = eating.totalCalories || (breakfast + lunch + dinner + snacks);

  const isCompleted = Boolean(
    (breakfast > 0 || lunch > 0 || dinner > 0 || snacks > 0 || totalCalories > 0) ||
    typeof eating.ateJunkFood === 'boolean' ||
    eating.junkFoodLogged ||
    (eating.type && eating.type !== 'None' && eating.completed !== false)
  );

  const variance = totalCalories - dailyTarget;
  const isOver = variance > 0;

  const handleToggleJunk = (ateJunk: boolean) => {
    sounds.playCheck();
    updateCurrentHabit((prev) => ({
      ...prev,
      eating: {
        ...prev.eating,
        ateJunkFood: ateJunk,
        junkFoodLogged: true,
        completed: true,
      },
    }));
  };

  const handleToggleComplete = () => {
    sounds.playTap();
    if (isCompleted) {
      // Reset
      updateCurrentHabit((prev) => ({
        ...prev,
        eating: {
          ...prev.eating,
          breakfastCalories: 0,
          lunchCalories: 0,
          dinnerCalories: 0,
          snacksCalories: 0,
          totalCalories: 0,
          ateJunkFood: null,
          junkFoodLogged: false,
          type: 'None',
          completed: false,
        },
      }));
    } else {
      // Mark as clean / on target
      sounds.playCheck();
      updateCurrentHabit((prev) => ({
        ...prev,
        eating: {
          ...prev.eating,
          ateJunkFood: false,
          junkFoodLogged: true,
          completed: true,
        },
      }));
    }
  };

  return (
    <div
      className={`rounded-2xl p-5 border transition-all duration-300 bg-white dark:bg-[#161a25] flex flex-col justify-between relative overflow-hidden shadow-xs dark:shadow-xl ${
        isCompleted
          ? 'border-emerald-500/40 shadow-emerald-500/5 ring-1 ring-emerald-500/20'
          : 'border-slate-200 dark:border-white/[0.08]'
      }`}
    >
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[9px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                  PROTOCOL [03]
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono uppercase tracking-tight">
                Food & Nutrition
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleComplete}
            className={`p-1.5 rounded-xl transition-all ${
              isCompleted
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-800 bg-slate-100 border border-slate-200 dark:text-zinc-500 dark:hover:text-white dark:bg-[#1e2330] dark:border-white/[0.08]'
            }`}
            title={isCompleted ? 'Marked complete (click to undo/reset)' : 'Quick-lock Food protocol'}
          >
            <CheckCircle className={`w-4 h-4 ${isCompleted ? 'fill-emerald-500 text-white dark:text-zinc-950' : ''}`} />
          </button>
        </div>

        {/* Calorie Stats Strip */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#1e2330] border border-slate-200 dark:border-white/[0.08] font-mono space-y-1.5 mb-3 shadow-2xs">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-zinc-400 font-semibold">Today's Intake:</span>
            <span className="text-slate-900 dark:text-white font-black text-sm">
              {totalCalories > 0 ? (
                <>
                  {totalCalories.toLocaleString()} <span className="text-xs text-slate-500 dark:text-zinc-400 font-normal">/ {dailyTarget} kcal</span>
                </>
              ) : (
                <span className="text-slate-500 dark:text-zinc-400 font-normal">No calories logged yet</span>
              )}
            </span>
          </div>

          {totalCalories > 0 && (
            <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-200/60 dark:border-white/[0.04]">
              <span className="text-slate-600 dark:text-zinc-400">Target Variance:</span>
              <span className={`font-bold px-1.5 py-0.5 rounded ${
                isOver ? 'bg-rose-500/15 text-rose-600 dark:text-rose-300' : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300'
              }`}>
                {isOver ? `+${variance} kcal Surplus` : `${variance} kcal Deficit`}
              </span>
            </div>
          )}
        </div>

        {/* Junk Food Quick Switch */}
        <div className="space-y-1.5 font-mono mb-3">
          <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-zinc-400 block">
            Junk Food Status:
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleToggleJunk(false)}
              className={`p-2 rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                eating.ateJunkFood === false
                  ? 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 dark:bg-[#1e2330] dark:border-white/[0.08] dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              <span>🥗</span>
              <span>Clean Day</span>
            </button>

            <button
              type="button"
              onClick={() => handleToggleJunk(true)}
              className={`p-2 rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                eating.ateJunkFood === true
                  ? 'bg-rose-500/15 border-rose-500 text-rose-700 dark:text-rose-300 font-bold shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 dark:bg-[#1e2330] dark:border-white/[0.08] dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              <span>🍔</span>
              <span>Ate Junk</span>
            </button>
          </div>
        </div>
      </div>

      {/* Button to Open Dedicated Food Station */}
      <button
        type="button"
        onClick={() => {
          sounds.playTap();
          setActiveTab('food');
        }}
        className="w-full mt-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 dark:bg-[#1e2330] dark:hover:bg-[#252c3d] dark:border-white/[0.08] dark:text-zinc-200 dark:hover:text-white font-mono text-xs font-bold transition-all flex items-center justify-between group shadow-2xs"
      >
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
          <span>Open Food Terminal</span>
        </span>
        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-600 dark:text-zinc-400 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
      </button>
    </div>
  );
};
