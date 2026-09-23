import React, { useState } from 'react';
import { Apple, CheckCircle, FileText, Utensils } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EatingType } from '../../types';

const MEAL_TYPES: { type: EatingType; label: string; desc: string; icon: string; color: string }[] = [
  { type: 'Healthy', label: '100% Clean', desc: 'Whole foods & on plan', icon: '🥗', color: 'emerald' },
  { type: 'Mixed', label: 'Balanced', desc: 'Mostly healthy with minor treats', icon: '🍲', color: 'teal' },
  { type: 'Cheat meal', label: 'Cheat Meal', desc: 'Social or comfort food', icon: '🍕', color: 'amber' },
];

export const EatingCard: React.FC = () => {
  const { currentLog, updateCurrentHabit } = useApp();
  const [showNotes, setShowNotes] = useState(false);

  if (!currentLog) return null;
  const eating = currentLog.eating;

  const isCompleted = Boolean(eating.type && eating.type !== 'None' && eating.completed !== false);

  const handleUpdate = (partial: Partial<typeof eating>) => {
    updateCurrentHabit((prev) => {
      const nextType = partial.type !== undefined ? partial.type : prev.eating.type;
      const isDone = nextType !== 'None' && partial.completed !== false;
      return {
        ...prev,
        eating: {
          ...prev.eating,
          ...partial,
          completed: partial.completed !== undefined ? partial.completed : isDone,
        },
      };
    });
  };

  const handleSelectType = (selectedType: EatingType) => {
    if (eating.type === selectedType) {
      // Toggle off / deselect
      handleUpdate({ type: 'None', completed: false });
    } else {
      handleUpdate({ type: selectedType, completed: true });
    }
  };

  const handleToggleComplete = () => {
    if (isCompleted) {
      handleUpdate({ type: 'None', completed: false });
    } else {
      handleUpdate({ type: eating.type && eating.type !== 'None' ? eating.type : 'Healthy', completed: true });
    }
  };

  return (
    <div className={`rounded-3xl p-5 border transition-all duration-200 glass-card relative overflow-hidden ${
      isCompleted
        ? 'border-emerald-500/40 shadow-emerald-500/5 shadow-lg'
        : 'border-slate-200 dark:border-white/10'
    }`}>
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500" />

      {/* Card Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Apple className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Eating & Nutrition</span>
            </h3>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              Fuel Your Body
            </span>
          </div>
        </div>

        <button
          onClick={handleToggleComplete}
          className={`p-1.5 rounded-xl transition-colors ${
            isCompleted
              ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
          title={isCompleted ? 'Marked complete (click to undo)' : 'Mark complete'}
        >
          <CheckCircle className={`w-5 h-5 ${isCompleted ? 'fill-emerald-500 text-white' : ''}`} />
        </button>
      </div>

      {/* Meal Category Selectors */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {MEAL_TYPES.map((item) => {
          const isSelected = eating.type === item.type;
          return (
            <button
              key={item.type}
              type="button"
              onClick={() => handleSelectType(item.type)}
              className={`p-3 rounded-2xl border text-center transition-all ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/25 scale-[1.02]'
                  : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-emerald-400 text-slate-700 dark:text-slate-200'
              }`}
            >
              <div className="text-2xl mb-1">{item.icon}</div>
              <div className="text-xs font-bold leading-tight">{item.label}</div>
              <div className={`text-[10px] mt-0.5 line-clamp-1 ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                {item.desc}
              </div>
            </button>
          );
        })}
      </div>

      {/* Meal Notes Input */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Utensils className="w-3.5 h-3.5 text-emerald-500" />
            <span>Meals Logged Today</span>
          </label>
          <span className="text-[10px] text-slate-400">Optional notes</span>
        </div>
        <input
          type="text"
          placeholder="e.g. Oatmeal with blueberries, grilled chicken salad, whey shake..."
          value={eating.notes || ''}
          onChange={(e) => handleUpdate({ notes: e.target.value })}
          className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>
    </div>
  );
};
