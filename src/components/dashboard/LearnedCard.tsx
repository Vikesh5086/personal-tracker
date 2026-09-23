import React from 'react';
import { Lightbulb, CheckCircle, Sparkles, BookOpen, Link, Brain, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LearnedCategory } from '../../types';
import { sounds } from '../../services/sound';

const CATEGORIES: { category: LearnedCategory; label: string; icon: string }[] = [
  { category: 'Tech & Code', label: 'Tech & Code', icon: '💻' },
  { category: 'Life & Wisdom', label: 'Life Wisdom', icon: '🧘' },
  { category: 'Science & Trivia', label: 'Science', icon: '🔬' },
  { category: 'Health & Fitness', label: 'Health', icon: '🥗' },
  { category: 'Finance & Money', label: 'Finance', icon: '💰' },
  { category: 'Soft Skills', label: 'Communication', icon: '🗣️' },
  { category: 'General', label: 'General', icon: '✨' },
];

export const LearnedCard: React.FC = () => {
  const { currentLog, updateCurrentHabit } = useApp();

  if (!currentLog) return null;
  const learned = currentLog.learnedNewThing || {
    completed: false,
    learnedSomething: false,
    takeaway: '',
    category: 'Tech & Code',
    sourceUrl: '',
  };

  const isCompleted = Boolean(
    (learned.takeaway && learned.takeaway.trim().length > 0) ||
    learned.learnedSomething ||
    learned.completed
  );

  const handleUpdate = (partial: Partial<typeof learned>) => {
    updateCurrentHabit((prev) => {
      const prevLearned = prev.learnedNewThing || {
        completed: false,
        learnedSomething: false,
        takeaway: '',
        category: 'Tech & Code',
        sourceUrl: '',
      };
      const updatedLearned = { ...prevLearned, ...partial };
      const hasTakeaway = Boolean(updatedLearned.takeaway && updatedLearned.takeaway.trim().length > 0);
      const isSomething = Boolean(updatedLearned.learnedSomething);
      let nextCompleted: boolean;
      if (!isSomething && !hasTakeaway && partial.completed !== true) {
        nextCompleted = false;
      } else if (partial.completed !== undefined) {
        nextCompleted = partial.completed;
      } else {
        nextCompleted = isSomething || hasTakeaway;
      }

      return {
        ...prev,
        learnedNewThing: {
          ...updatedLearned,
          completed: nextCompleted,
        },
      };
    });
  };

  const toggleLearnedStatus = (status: boolean) => {
    if (status) {
      sounds.playCheck();
      handleUpdate({
        learnedSomething: true,
        completed: true,
      });
    } else {
      sounds.playTap();
      handleUpdate({
        learnedSomething: false,
        completed: false,
        takeaway: '',
      });
    }
  };

  const handleToggleComplete = () => {
    sounds.playCheck();
    if (isCompleted) {
      handleUpdate({ learnedSomething: false, completed: false, takeaway: '' });
    } else {
      handleUpdate({ learnedSomething: true, completed: true });
    }
  };

  return (
    <div className={`rounded-3xl p-5 border transition-all duration-200 glass-card relative overflow-hidden ${
      isCompleted
        ? 'border-amber-400/50 shadow-amber-500/10 shadow-xl'
        : 'border-slate-200 dark:border-white/10'
    }`}>
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-emerald-400" />

      {/* Card Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Learned Something New?</span>
            </h3>
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
              Daily Intellectual Growth
            </span>
          </div>
        </div>

        <button
          onClick={handleToggleComplete}
          className={`p-1.5 rounded-xl transition-colors ${
            isCompleted
              ? 'text-amber-500 bg-amber-500/10'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
          title={isCompleted ? 'Marked complete (click to undo)' : 'Mark complete'}
        >
          <CheckCircle className={`w-5 h-5 ${isCompleted ? 'fill-amber-500 text-white' : ''}`} />
        </button>
      </div>

      {/* Yes / No Quick Question Toggle */}
      <div className="mb-4">
        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
          Did you learn or discover a new insight today?
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => toggleLearnedStatus(true)}
            className={`p-2.5 rounded-2xl border text-center transition-all flex items-center justify-center gap-2 font-bold text-xs ${
              learned.learnedSomething
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 border-amber-400 shadow-md shadow-amber-500/25 scale-[1.02]'
                : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-amber-400 text-slate-700 dark:text-slate-200'
            }`}
          >
            <span>💡 Yes, Learned New!</span>
            {learned.learnedSomething && <Check className="w-4 h-4 stroke-[3]" />}
          </button>

          <button
            type="button"
            onClick={() => toggleLearnedStatus(false)}
            className={`p-2.5 rounded-2xl border text-center transition-all font-semibold text-xs ${
              !learned.learnedSomething && !learned.takeaway
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-slate-400 text-slate-500'
            }`}
          >
            <span>Not Yet Today</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="mb-3.5">
        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
          Category of Insight
        </label>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => {
            const isSelected = learned.category === cat.category;
            return (
              <button
                key={cat.category}
                type="button"
                onClick={() => {
                  sounds.playTap();
                  handleUpdate({ category: cat.category });
                }}
                className={`text-[11px] px-2.5 py-1 rounded-xl border transition-all flex items-center gap-1 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-500 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-400'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Takeaway Input Textarea */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Brain className="w-3.5 h-3.5 text-amber-500" />
            <span>Key Takeaway / Discovery</span>
          </span>
          {isCompleted && (
            <span className="text-[10px] font-extrabold uppercase text-amber-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Mind Expanded!
            </span>
          )}
        </label>
        <textarea
          rows={2}
          placeholder="e.g. Understood how garbage collection works in JS, or how compound interest formula scales..."
          value={learned.takeaway || ''}
          onChange={(e) => handleUpdate({ takeaway: e.target.value, learnedSomething: true })}
          className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400/50 resize-none"
        />

        {/* Optional Source / Reference URL */}
        <div className="relative">
          <Link className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Optional source URL, article link, or book title..."
            value={learned.sourceUrl || ''}
            onChange={(e) => handleUpdate({ sourceUrl: e.target.value })}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
        </div>
      </div>
    </div>
  );
};
