import React, { useState } from 'react';
import { Dumbbell, Flame, CheckCircle, Clock, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WorkoutType } from '../../types';

const WORKOUT_TYPES: { type: WorkoutType; label: string; desc: string; icon: string }[] = [
  { type: 'Strength only', label: 'Strength', desc: 'Weights & Hypertrophy', icon: '🏋️' },
  { type: 'Cardio only', label: 'Cardio', desc: 'Running / HIIT / Cycling', icon: '🏃' },
  { type: 'Both', label: 'Both', desc: 'Full Session', icon: '⚡' },
  { type: 'Rest day', label: 'Rest Day', desc: 'Active Recovery', icon: '🧘' },
];

export const WorkoutCard: React.FC = () => {
  const { currentLog, updateCurrentHabit } = useApp();
  const [showNotes, setShowNotes] = useState(false);

  if (!currentLog) return null;
  const workout = currentLog.workout;

  const isCompleted = Boolean(workout.type && workout.type !== 'None' && workout.completed !== false);

  const handleUpdate = (partial: Partial<typeof workout>) => {
    updateCurrentHabit((prev) => {
      const nextType = partial.type !== undefined ? partial.type : prev.workout.type;
      const isDone = nextType !== 'None' && partial.completed !== false;
      return {
        ...prev,
        workout: {
          ...prev.workout,
          ...partial,
          completed: partial.completed !== undefined ? partial.completed : isDone,
        },
      };
    });
  };

  const handleSelectType = (selectedType: WorkoutType) => {
    if (workout.type === selectedType) {
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
      handleUpdate({ type: workout.type && workout.type !== 'None' ? workout.type : 'Strength only', completed: true });
    }
  };

  return (
    <div className={`rounded-3xl p-5 border transition-all duration-200 glass-card relative overflow-hidden ${
      isCompleted
        ? 'border-orange-500/40 shadow-orange-500/5 shadow-lg'
        : 'border-slate-200 dark:border-white/10'
    }`}>
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500" />

      {/* Card Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Workout & Fitness</span>
            </h3>
            <span className="text-[11px] text-orange-600 dark:text-orange-400 font-semibold">
              Physical Discipline
            </span>
          </div>
        </div>

        <button
          onClick={handleToggleComplete}
          className={`p-1.5 rounded-xl transition-colors ${
            isCompleted
              ? 'text-orange-600 dark:text-orange-400 bg-orange-500/10'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
          title={isCompleted ? 'Marked complete (click to undo)' : 'Mark complete'}
        >
          <CheckCircle className={`w-5 h-5 ${isCompleted ? 'fill-orange-500 text-white' : ''}`} />
        </button>
      </div>

      {/* Workout Type Selector */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {WORKOUT_TYPES.map((item) => {
          const isSelected = workout.type === item.type;
          return (
            <button
              key={item.type}
              type="button"
              onClick={() => handleSelectType(item.type)}
              className={`p-3 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/25'
                  : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-orange-400 text-slate-700 dark:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-base">{item.icon}</span>
                <span className="text-xs font-bold">{item.label}</span>
              </div>
              <div className={`text-[10px] ${isSelected ? 'text-orange-100' : 'text-slate-400'}`}>
                {item.desc}
              </div>
            </button>
          );
        })}
      </div>

      {/* Duration input */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-orange-500/5 border border-orange-500/10 mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-orange-500" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Duration (minutes)
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {[30, 45, 60, 90].map((mins) => (
            <button
              key={mins}
              onClick={() => handleUpdate({ durationMinutes: mins })}
              className={`px-2 py-0.5 text-[11px] rounded-lg border font-semibold transition-all ${
                workout.durationMinutes === mins
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              {mins}m
            </button>
          ))}
          <input
            type="number"
            min="0"
            max="300"
            placeholder="m"
            value={workout.durationMinutes || ''}
            onChange={(e) => handleUpdate({ durationMinutes: Number(e.target.value) || 0 })}
            className="w-14 px-2 py-1 text-xs text-center rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-orange-500 font-mono"
          />
        </div>
      </div>

      {/* Optional Workout Notes */}
      <div>
        <button
          onClick={() => setShowNotes(!showNotes)}
          className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 mb-1.5"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{showNotes ? 'Hide Details' : (workout.notes ? 'Edit Exercises' : '+ Add Exercise Details')}</span>
        </button>

        {showNotes && (
          <textarea
            rows={2}
            placeholder="e.g. Chest & Triceps: Bench Press 80kg 4x8, Incline Dumbbell 30kg 3x10..."
            value={workout.notes || ''}
            onChange={(e) => handleUpdate({ notes: e.target.value })}
            className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-orange-500 resize-none"
          />
        )}
      </div>
    </div>
  );
};
