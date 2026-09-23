import React, { useState } from 'react';
import { Code2, Plus, Minus, CheckCircle, Tag, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DsaDifficulty } from '../../types';

const COMMON_TOPICS = [
  'Array', 'String', 'Two Pointers', 'Sliding Window', 'DP',
  'Tree', 'Graph', 'Binary Search', 'Linked List', 'Stack/Queue',
  'Heap', 'Backtracking', 'Greedy', 'Trie', 'Bit Manipulation'
];

export const DsaCard: React.FC = () => {
  const { currentLog, updateCurrentHabit } = useApp();
  const [customTopicInput, setCustomTopicInput] = useState('');
  const [showNotes, setShowNotes] = useState(false);

  if (!currentLog) return null;
  const dsa = currentLog.dsa;

  const handleUpdate = (partial: Partial<typeof dsa>) => {
    updateCurrentHabit((prev) => ({
      ...prev,
      dsa: {
        ...prev.dsa,
        ...partial,
        completed: (partial.questionsSolved !== undefined ? partial.questionsSolved > 0 : prev.dsa.questionsSolved > 0) || (partial.completed ?? prev.dsa.completed),
      },
    }));
  };

  const toggleDifficulty = (diff: DsaDifficulty) => {
    const exists = dsa.difficulties.includes(diff);
    const updated = exists
      ? dsa.difficulties.filter((d) => d !== diff)
      : [...dsa.difficulties, diff];
    handleUpdate({ difficulties: updated });
  };

  const toggleTopic = (topic: string) => {
    const exists = dsa.topics.includes(topic);
    const updated = exists
      ? dsa.topics.filter((t) => t !== topic)
      : [...dsa.topics, topic];
    handleUpdate({ topics: updated });
  };

  const addCustomTopic = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customTopicInput.trim()) {
      e.preventDefault();
      if (!dsa.topics.includes(customTopicInput.trim())) {
        handleUpdate({ topics: [...dsa.topics, customTopicInput.trim()] });
      }
      setCustomTopicInput('');
    }
  };

  const isCompleted = dsa.completed || dsa.questionsSolved > 0;

  return (
    <div className={`rounded-3xl p-5 border transition-all duration-200 glass-card relative overflow-hidden ${
      isCompleted
        ? 'border-purple-500/40 shadow-purple-500/5 shadow-lg'
        : 'border-slate-200 dark:border-white/10'
    }`}>
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 to-indigo-500" />

      {/* Card Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>DSA / LeetCode</span>
            </h3>
            <span className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
              Algorithm Mastery
            </span>
          </div>
        </div>

        <button
          onClick={() => handleUpdate({ completed: !isCompleted })}
          className={`p-1.5 rounded-xl transition-colors ${
            isCompleted
              ? 'text-purple-600 dark:text-purple-400 bg-purple-500/10'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
          title={isCompleted ? 'Marked complete' : 'Mark complete'}
        >
          <CheckCircle className={`w-5 h-5 ${isCompleted ? 'fill-purple-500 text-white' : ''}`} />
        </button>
      </div>

      {/* Counter & Stepper */}
      <div className="p-3.5 rounded-2xl bg-purple-500/5 border border-purple-500/10 flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 block">
            Problems Solved Today
          </span>
          <span className="text-2xl font-black text-purple-600 dark:text-purple-400 font-mono">
            {dsa.questionsSolved} <span className="text-xs font-normal text-slate-400">questions</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleUpdate({ questionsSolved: Math.max(0, dsa.questionsSolved - 1) })}
            className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleUpdate({ questionsSolved: dsa.questionsSolved + 1 })}
            className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center hover:bg-purple-700 transition-colors shadow-sm shadow-purple-600/30"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Difficulty badges */}
      <div className="mb-4">
        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
          Difficulty Breakdown
        </label>
        <div className="flex items-center gap-2">
          {(['Easy', 'Medium', 'Hard'] as DsaDifficulty[]).map((diff) => {
            const isSelected = dsa.difficulties.includes(diff);
            const colorClass =
              diff === 'Easy'
                ? isSelected ? 'bg-emerald-500 text-white border-emerald-500' : 'text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10'
                : diff === 'Medium'
                ? isSelected ? 'bg-amber-500 text-white border-amber-500' : 'text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/10'
                : isSelected ? 'bg-rose-500 text-white border-rose-500' : 'text-rose-600 dark:text-rose-400 border-rose-500/30 hover:bg-rose-500/10';

            return (
              <button
                key={diff}
                onClick={() => toggleDifficulty(diff)}
                className={`px-3 py-1 text-xs font-bold rounded-xl border transition-all ${colorClass}`}
              >
                {diff}
              </button>
            );
          })}
        </div>
      </div>

      {/* Topic Tags */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Tag className="w-3 h-3" />
            <span>Topics / Tags</span>
          </label>
          <span className="text-[10px] text-slate-400">{dsa.topics.length} selected</span>
        </div>

        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
          {COMMON_TOPICS.map((topic) => {
            const isSelected = dsa.topics.includes(topic);
            return (
              <button
                key={topic}
                onClick={() => toggleTopic(topic)}
                className={`text-[11px] px-2.5 py-0.5 rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-purple-600 text-white border-purple-600 font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/60 hover:border-purple-400'
                }`}
              >
                {topic}
              </button>
            );
          })}
        </div>

        <input
          type="text"
          placeholder="Type custom topic & press Enter..."
          value={customTopicInput}
          onChange={(e) => setCustomTopicInput(e.target.value)}
          onKeyDown={addCustomTopic}
          className="mt-2 w-full px-2.5 py-1 text-xs rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-purple-500"
        />
      </div>

      {/* Optional Notes toggle */}
      <div>
        <button
          onClick={() => setShowNotes(!showNotes)}
          className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 mb-1.5"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{showNotes ? 'Hide Notes' : (dsa.notes ? 'Edit Notes' : '+ Add Problem Notes')}</span>
        </button>

        {showNotes && (
          <textarea
            rows={2}
            placeholder="Key insights, time complexity, optimal trick..."
            value={dsa.notes || ''}
            onChange={(e) => handleUpdate({ notes: e.target.value })}
            className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none"
          />
        )}
      </div>
    </div>
  );
};
