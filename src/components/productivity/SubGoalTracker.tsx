import React, { useState, useEffect } from 'react';
import { Target, Plus, CheckCircle2, Trash2, Trophy, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SubGoal } from '../../types';
import { getSubGoals, saveSubGoal, deleteSubGoal } from '../../services/db';

export const SubGoalTracker: React.FC = () => {
  const { currentDayNumber, fireConfetti } = useApp();
  const [goals, setGoals] = useState<SubGoal[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<SubGoal['category']>('dsa');
  const [targetValue, setTargetValue] = useState(50);
  const [currentValue, setCurrentValue] = useState(0);
  const [unit, setUnit] = useState('questions');
  const [deadlineDay, setDeadlineDay] = useState(30);

  const loadGoals = async () => {
    const list = await getSubGoals();
    if (list.length === 0) {
      // Seed default helpful sub-goals
      const seedGoals: SubGoal[] = [
        {
          id: 'sg_1',
          title: '50 LeetCode Questions by Day 30',
          category: 'dsa',
          targetValue: 50,
          currentValue: 12,
          unit: 'questions',
          deadlineDay: 30,
          completed: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'sg_2',
          title: '20 Gym Workouts by Day 40',
          category: 'workout',
          targetValue: 20,
          currentValue: 8,
          unit: 'workouts',
          deadlineDay: 40,
          completed: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'sg_3',
          title: 'Hydration Target (2L+) 25 Times',
          category: 'water',
          targetValue: 25,
          currentValue: 10,
          unit: 'days',
          deadlineDay: 30,
          completed: false,
          createdAt: new Date().toISOString(),
        },
      ];
      for (const g of seedGoals) {
        await saveSubGoal(g);
      }
      setGoals(seedGoals);
    } else {
      setGoals(list);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newGoal: SubGoal = {
      id: 'sg_' + Date.now(),
      title: title.trim(),
      category,
      targetValue: Number(targetValue) || 10,
      currentValue: Number(currentValue) || 0,
      unit: unit.trim() || 'units',
      deadlineDay: Number(deadlineDay) || 30,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    await saveSubGoal(newGoal);
    setTitle('');
    setShowAddForm(false);
    await loadGoals();
  };

  const handleUpdateProgress = async (goal: SubGoal, delta: number) => {
    const nextVal = Math.max(0, goal.currentValue + delta);
    const isCompleted = nextVal >= goal.targetValue;
    const updated = { ...goal, currentValue: nextVal, completed: isCompleted };

    if (!goal.completed && isCompleted) {
      fireConfetti();
    }

    await saveSubGoal(updated);
    await loadGoals();
  };

  const handleDelete = async (id: string) => {
    await deleteSubGoal(id);
    await loadGoals();
  };

  return (
    <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-white/10 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase mb-1">
            <Target className="w-3.5 h-3.5" />
            <span>Intermediate Milestones</span>
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            Sub-Goal Tracking
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Break the 100 days into achievable mini targets (e.g. 50 LeetCode by Day 30).
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New Sub-Goal</span>
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form onSubmit={handleAddGoal} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3 animate-in fade-in duration-200">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              Goal Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 50 LeetCode questions by Day 30..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                Target Value
              </label>
              <input
                type="number"
                min="1"
                value={targetValue}
                onChange={(e) => setTargetValue(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                Current
              </label>
              <input
                type="number"
                min="0"
                value={currentValue}
                onChange={(e) => setCurrentValue(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                Unit
              </label>
              <input
                type="text"
                placeholder="questions, days..."
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                Target Day #
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={deadlineDay}
                onChange={(e) => setDeadlineDay(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm"
            >
              Save Sub-Goal
            </button>
          </div>
        </form>
      )}

      {/* Goals List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {goals.map((g) => {
          const progressPercent = Math.min(100, Math.round((g.currentValue / g.targetValue) * 100));
          const isDone = g.completed || progressPercent >= 100;
          const daysRemaining = g.deadlineDay - currentDayNumber;

          return (
            <div
              key={g.id}
              className={`p-4 rounded-2xl border transition-all ${
                isDone
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>{g.title}</span>
                    {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    Deadline: Day {g.deadlineDay} ({daysRemaining >= 0 ? `${daysRemaining} days left` : 'Expired'})
                  </span>
                </div>

                <button
                  onClick={() => handleDelete(g.id)}
                  className="p-1 text-slate-400 hover:text-rose-500"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Progress bar */}
              <div className="space-y-1 my-2">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-500 dark:text-slate-400 font-bold">
                    {g.currentValue} / {g.targetValue} {g.unit}
                  </span>
                  <span className="font-extrabold text-emerald-500">{progressPercent}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Stepper buttons */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  Quick Adjust
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleUpdateProgress(g, -1)}
                    className="px-2 py-0.5 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                  >
                    -1
                  </button>
                  <button
                    onClick={() => handleUpdateProgress(g, 1)}
                    className="px-2 py-0.5 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                  >
                    +1
                  </button>
                  <button
                    onClick={() => handleUpdateProgress(g, 5)}
                    className="px-2 py-0.5 text-xs font-bold rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/30"
                  >
                    +5
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
