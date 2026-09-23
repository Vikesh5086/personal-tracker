import React from 'react';
import { Target, CheckCircle2, Circle, ListTodo, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PriorityItem } from '../../types';
import { sounds } from '../../services/sound';

export const PrioritiesCard: React.FC = () => {
  const { currentLog, updateCurrentHabit, fireConfetti } = useApp();

  if (!currentLog) return null;
  const priorities = currentLog.priorities;

  const handleUpdateItem = (index: number, partial: Partial<PriorityItem>) => {
    const updatedItems = [...priorities.items] as [PriorityItem, PriorityItem, PriorityItem];
    const willBeDone = partial.done !== undefined ? partial.done : updatedItems[index].done;
    updatedItems[index] = { ...updatedItems[index], ...partial };

    if (partial.done) {
      sounds.playCheck();
    } else if (partial.done === false) {
      sounds.playTap();
    }

    const anyChecked = updatedItems.some((item) => item.done && item.text.trim().length > 0);
    const completedAll = updatedItems.every((item) => item.done && item.text.trim().length > 0);

    if (partial.done && completedAll) {
      fireConfetti();
      sounds.playFanfare();
    }

    updateCurrentHabit((prev) => ({
      ...prev,
      priorities: {
        ...prev.priorities,
        items: updatedItems,
        completed: anyChecked,
      },
    }));
  };

  const completedCount = priorities.items.filter((i) => i.done && i.text.trim().length > 0).length;
  const totalEntered = priorities.items.filter((i) => i.text.trim().length > 0).length;
  const isCompleted = priorities.completed || (totalEntered > 0 && completedCount === totalEntered);

  return (
    <div className={`rounded-3xl p-5 border transition-all duration-200 glass-card relative overflow-hidden ${
      isCompleted
        ? 'border-teal-500/50 shadow-teal-500/10 shadow-xl'
        : 'border-slate-200 dark:border-white/10'
    }`}>
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-500 via-emerald-400 to-cyan-500" />

      {/* Card Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
            <ListTodo className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Top 3 Priorities</span>
            </h3>
            <span className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold">
              Daily Mission Focus
            </span>
          </div>
        </div>

        <span className={`text-xs font-bold font-mono px-2.5 py-1 rounded-xl transition-all ${
          completedCount === 3
            ? 'bg-teal-500 text-white shadow-sm shadow-teal-500/30'
            : 'bg-teal-500/10 text-teal-600 dark:text-teal-400'
        }`}>
          {completedCount} / 3 Done
        </span>
      </div>

      {/* Priorities List */}
      <div className="space-y-2.5">
        {priorities.items.map((item, idx) => (
          <div
            key={item.id}
            className={`flex items-center gap-2.5 p-2.5 rounded-2xl border transition-all ${
              item.done
                ? 'bg-teal-500/15 border-teal-500/40 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 hover:border-teal-400/50'
            }`}
          >
            <button
              type="button"
              onClick={() => handleUpdateItem(idx, { done: !item.done })}
              className="text-teal-500 hover:text-teal-600 shrink-0 transition-transform active:scale-90"
              title={item.done ? 'Mark pending' : 'Mark done'}
            >
              {item.done ? (
                <CheckCircle2 className="w-5 h-5 fill-teal-500 text-white" />
              ) : (
                <Circle className="w-5 h-5 text-slate-400 hover:text-teal-400" />
              )}
            </button>

            <span className="text-xs font-bold text-slate-400 w-4 font-mono">
              #{idx + 1}
            </span>

            <input
              type="text"
              placeholder={`Priority #${idx + 1}...`}
              value={item.text}
              onChange={(e) => handleUpdateItem(idx, { text: e.target.value })}
              className={`w-full text-xs bg-transparent focus:outline-none placeholder:text-slate-400 ${
                item.done ? 'line-through text-slate-400 italic' : 'text-slate-800 dark:text-slate-100 font-semibold'
              }`}
            />
          </div>
        ))}
      </div>
      <p className="text-[10px] text-slate-400 mt-2 text-center">
        Lock these 3 in the morning; checking all 3 triggers fanfare & confetti! 🎯
      </p>
    </div>
  );
};
