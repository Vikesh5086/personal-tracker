import React from 'react';
import { Utensils, CheckCircle, ArrowRight, CheckCircle2, Flame, AlertTriangle, RotateCcw } from 'lucide-react';
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
      className={`rounded-2xl p-5 border transition-all duration-300 bg-[#0b0f19] flex flex-col justify-between relative overflow-hidden shadow-xl ${
        isCompleted
          ? 'border-emerald-500/40 shadow-emerald-500/5 ring-1 ring-emerald-500/20'
          : 'border-white/[0.08]'
      }`}
    >
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
                  PROTOCOL [03]
                </span>
              </div>
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-tight">
                Food & Nutrition
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleComplete}
            className={`p-1.5 rounded-xl transition-all ${
              isCompleted
                ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                : 'text-zinc-500 hover:text-white bg-zinc-900 border border-white/[0.06]'
            }`}
            title={isCompleted ? 'Marked complete (click to undo/reset)' : 'Quick-lock Food protocol'}
          >
            <CheckCircle className={`w-4 h-4 ${isCompleted ? 'fill-emerald-500 text-zinc-950' : ''}`} />
          </button>
        </div>

        {/* Calorie Stats Strip */}
        <div className="p-3 rounded-xl bg-zinc-900/70 border border-white/[0.06] font-mono space-y-1.5 mb-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400 font-semibold">Today's Intake:</span>
            <span className="text-white font-black text-sm">
              {totalCalories > 0 ? (
                <>
                  {totalCalories.toLocaleString()} <span className="text-xs text-zinc-500 font-normal">/ {dailyTarget} kcal</span>
                </>
              ) : (
                <span className="text-zinc-500 font-normal">No calories logged yet</span>
              )}
            </span>
          </div>

          {totalCalories > 0 && (
            <div className="flex items-center justify-between text-[10px] pt-1 border-t border-white/[0.04]">
              <span className="text-zinc-400">Target Variance:</span>
              <span className={`font-bold px-1.5 py-0.2 rounded ${
                isOver ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                {isOver ? `+${variance} kcal Surplus` : `${variance} kcal Deficit`}
              </span>
            </div>
          )}
        </div>

        {/* Junk Food Quick Switch */}
        <div className="space-y-1.5 font-mono mb-3">
          <span className="text-[10px] uppercase font-bold text-zinc-500 block">
            Junk Food Status:
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleToggleJunk(false)}
              className={`p-2 rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                eating.ateJunkFood === false
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold shadow-sm'
                  : 'bg-zinc-900/60 border-white/[0.06] text-zinc-400 hover:text-white hover:bg-zinc-850'
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
                  ? 'bg-rose-500/20 border-rose-400 text-rose-300 font-bold shadow-sm'
                  : 'bg-zinc-900/60 border-white/[0.06] text-zinc-400 hover:text-white hover:bg-zinc-850'
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
        className="w-full mt-1 py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/[0.08] hover:border-emerald-500/40 text-zinc-300 hover:text-white font-mono text-xs font-bold transition-all flex items-center justify-between group"
      >
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Open Food Terminal</span>
        </span>
        <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
      </button>
    </div>
  );
};
