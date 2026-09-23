import React from 'react';
import { Smile, CheckCircle, BookOpen } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MoodValue } from '../../types';
import { sounds } from '../../services/sound';

const MOODS: { value: MoodValue; emoji: string; label: string }[] = [
  { value: 1, emoji: '😞', label: 'Rough' },
  { value: 2, emoji: '🙁', label: 'Down' },
  { value: 3, emoji: '😐', label: 'Neutral' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '😄', label: 'Awesome' },
];

export const JournalMoodCard: React.FC = () => {
  const { currentLog, updateCurrentHabit } = useApp();

  if (!currentLog) return null;
  const journal = currentLog.journal;

  const isCompleted = Boolean((journal.note && journal.note.trim().length > 0) || journal.completed);

  const handleUpdate = (partial: Partial<typeof journal>) => {
    updateCurrentHabit((prev) => {
      const nextNote = partial.note !== undefined ? partial.note : prev.journal.note;
      const hasNote = Boolean(nextNote && nextNote.trim().length > 0);
      let nextCompleted: boolean;
      if (!hasNote && partial.completed !== true) {
        nextCompleted = false;
      } else if (partial.completed !== undefined) {
        nextCompleted = partial.completed;
      } else {
        nextCompleted = hasNote || prev.journal.completed;
      }

      return {
        ...prev,
        journal: {
          ...prev.journal,
          ...partial,
          note: nextNote,
          completed: nextCompleted,
        },
      };
    });
  };

  const handleToggleComplete = () => {
    sounds.playCheck();
    if (isCompleted) {
      handleUpdate({ note: '', completed: false });
    } else {
      handleUpdate({ completed: true });
    }
  };

  return (
    <div className={`rounded-3xl p-5 border transition-all duration-200 glass-card relative overflow-hidden ${
      isCompleted
        ? 'border-yellow-500/50 shadow-yellow-500/10 shadow-xl'
        : 'border-slate-200 dark:border-white/10'
    }`}>
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400" />

      {/* Card Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
            <Smile className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Mood & Daily Journal</span>
            </h3>
            <span className="text-[11px] text-yellow-600 dark:text-yellow-400 font-semibold">
              Mental Clarity
            </span>
          </div>
        </div>

        <button
          onClick={handleToggleComplete}
          className={`p-1.5 rounded-xl transition-colors ${
            isCompleted
              ? 'text-yellow-600 dark:text-yellow-400 bg-yellow-500/10'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
          title={isCompleted ? 'Marked complete (click to undo)' : 'Mark complete'}
        >
          <CheckCircle className={`w-5 h-5 ${isCompleted ? 'fill-yellow-500 text-white' : ''}`} />
        </button>
      </div>

      {/* Mood Selector Buttons */}
      <div className="mb-4">
        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
          How Are You Feeling Today?
        </label>
        <div className="grid grid-cols-5 gap-1.5">
          {MOODS.map((m) => {
            const isSelected = journal.mood === m.value;
            return (
              <button
                key={m.value}
                onClick={() => {
                  sounds.playTap();
                  handleUpdate({ mood: m.value });
                }}
                className={`py-2 px-1 rounded-2xl border text-center transition-all ${
                  isSelected
                    ? 'bg-yellow-500/20 border-yellow-500 shadow-md shadow-yellow-500/20 scale-110 ring-2 ring-yellow-400/40'
                    : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-yellow-400/60 hover:scale-105'
                }`}
              >
                <div className="text-2xl leading-none transition-transform hover:scale-125 duration-200">
                  {m.emoji}
                </div>
                <div className={`text-[10px] font-bold mt-1 ${isSelected ? 'text-yellow-600 dark:text-yellow-400 font-extrabold' : 'text-slate-400'}`}>
                  {m.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Journal Textarea */}
      <div>
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1.5">
          <BookOpen className="w-3.5 h-3.5 text-yellow-500" />
          <span>Daily Reflection / Thoughts</span>
        </label>
        <textarea
          rows={3}
          placeholder="What felt great today? What gave you friction? What are you grateful for?"
          value={journal.note || ''}
          onChange={(e) => handleUpdate({ note: e.target.value })}
          className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 resize-none transition-all"
        />
      </div>
    </div>
  );
};
