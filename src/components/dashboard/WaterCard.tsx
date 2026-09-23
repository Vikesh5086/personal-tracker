import React from 'react';
import { Droplet, Plus, Minus, CheckCircle, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { sounds } from '../../services/sound';

export const WaterCard: React.FC = () => {
  const { currentLog, updateCurrentHabit } = useApp();

  if (!currentLog) return null;
  const water = currentLog.water;

  const target = water.targetLitres || 2.5;
  const current = water.intakeLitres || 0;
  const fillPercent = Math.min(100, Math.round((current / target) * 100));

  const isCompleted = Boolean(water.intakeLitres > 0 && (water.completed || current >= target));

  const handleUpdate = (partial: Partial<typeof water>) => {
    updateCurrentHabit((prev) => {
      const nextIntake = partial.intakeLitres !== undefined ? partial.intakeLitres : prev.water.intakeLitres;
      const targetVal = partial.targetLitres || prev.water.targetLitres || 2.5;

      let nextCompleted: boolean;
      if (nextIntake <= 0) {
        nextCompleted = false;
      } else if (partial.completed !== undefined) {
        nextCompleted = partial.completed;
      } else {
        nextCompleted = nextIntake >= targetVal || prev.water.completed;
      }

      return {
        ...prev,
        water: {
          ...prev.water,
          ...partial,
          intakeLitres: nextIntake,
          completed: nextCompleted,
        },
      };
    });
  };

  const addWater = (delta: number) => {
    sounds.playWater();
    const nextVal = Math.max(0, Math.round((current + delta) * 10) / 10);
    handleUpdate({ intakeLitres: nextVal, completed: nextVal > 0 ? (nextVal >= target || water.completed) : false });
  };

  const handleToggleComplete = () => {
    sounds.playCheck();
    if (isCompleted) {
      handleUpdate({ intakeLitres: 0, completed: false });
    } else {
      handleUpdate({ intakeLitres: Math.max(target, 2.5), completed: true });
    }
  };

  return (
    <div className={`rounded-3xl p-5 border transition-all duration-200 glass-card relative overflow-hidden ${
      isCompleted
        ? 'border-cyan-500/50 shadow-cyan-500/10 shadow-xl'
        : 'border-slate-200 dark:border-white/10'
    }`}>
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500" />

      {/* Card Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
            <Droplet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Water Intake</span>
            </h3>
            <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-semibold">
              Daily Hydration
            </span>
          </div>
        </div>

        <button
          onClick={handleToggleComplete}
          className={`p-1.5 rounded-xl transition-colors ${
            isCompleted
              ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
          title={isCompleted ? 'Marked complete (click to reset)' : 'Mark complete'}
        >
          <CheckCircle className={`w-5 h-5 ${isCompleted ? 'fill-cyan-500 text-white' : ''}`} />
        </button>
      </div>

      {/* Visual Fill Bottle / Gauge */}
      <div className="flex items-center gap-5 p-3.5 rounded-2xl bg-cyan-500/5 border border-cyan-500/15 mb-4">
        {/* Sleek Water Bottle Graphic */}
        <div className="relative w-14 h-24 rounded-2xl border-2 border-cyan-500/50 bg-slate-100/50 dark:bg-slate-800/50 overflow-hidden shrink-0 flex flex-col justify-end p-1 shadow-inner">
          {/* Bottle Cap */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-2 bg-cyan-500/70 rounded-t-sm" />

          {/* Water Level Liquid */}
          <div
            className="w-full bg-gradient-to-t from-cyan-600 via-cyan-500 to-cyan-300 rounded-xl transition-all duration-500 flex items-center justify-center relative overflow-hidden"
            style={{ height: `${fillPercent}%` }}
          >
            {/* Animated wave sheen */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-white/40 blur-[1px] animate-pulse" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[10px] font-black font-mono text-cyan-950 dark:text-white drop-shadow">
              {fillPercent}%
            </span>
          </div>
        </div>

        {/* Counter & Target Info */}
        <div className="flex-1">
          <div className="flex items-baseline justify-between mb-1">
            <div>
              <span className="text-2xl font-black text-cyan-600 dark:text-cyan-400 font-mono">
                {current.toFixed(1)}
              </span>
              <span className="text-xs font-semibold text-slate-400 ml-1">/ {target} Litres</span>
            </div>
            {fillPercent >= 100 && (
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-500 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Hydrated!
              </span>
            )}
          </div>

          {/* Stepper Controls */}
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => addWater(-0.25)}
              className="p-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm transition-all"
              title="-250ml"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              onClick={() => addWater(0.25)}
              className="flex-1 py-1.5 px-2 text-xs font-bold rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/20 hover:bg-cyan-500/20 text-center transition-all active:scale-95"
            >
              +250ml Glass
            </button>
            <button
              onClick={() => addWater(0.5)}
              className="flex-1 py-1.5 px-2 text-xs font-bold rounded-xl bg-cyan-600 text-white hover:bg-cyan-700 shadow-md shadow-cyan-600/30 text-center transition-all active:scale-95"
            >
              +500ml Bottle
            </button>
          </div>
        </div>
      </div>

      {/* Target selector slider */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
          <span>Target Goal</span>
          <span className="font-semibold text-slate-700 dark:text-slate-200 font-mono">{target}L</span>
        </div>
        <input
          type="range"
          min="1.5"
          max="4.0"
          step="0.5"
          value={target}
          onChange={(e) => {
            sounds.playTap();
            handleUpdate({ targetLitres: Number(e.target.value) });
          }}
          className="w-full accent-cyan-500 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>1.5L</span>
          <span>2.5L (Recommended)</span>
          <span>4.0L</span>
        </div>
      </div>
    </div>
  );
};
