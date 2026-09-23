import React from 'react';
import { Brain, CheckCircle, Clock, BookOpen, Lightbulb } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const COMMON_AI_TOPICS = [
  'Deep Learning', 'PyTorch', 'Transformers', 'LLM Fine-tuning',
  'Prompt Engineering', 'LangChain', 'RAG Systems', 'Mathematics for ML',
  'Reinforcement Learning', 'Computer Vision', 'Diffusion Models'
];

export const AiMlCard: React.FC = () => {
  const { currentLog, updateCurrentHabit } = useApp();

  if (!currentLog) return null;
  const aiMl = currentLog.aiMl;

  const isCompleted = Boolean((aiMl.topic && aiMl.topic.trim().length > 0) || aiMl.completed);

  const handleUpdate = (partial: Partial<typeof aiMl>) => {
    updateCurrentHabit((prev) => {
      const nextTopic = partial.topic !== undefined ? partial.topic : prev.aiMl.topic;
      const hasTopic = Boolean(nextTopic && nextTopic.trim().length > 0);
      let nextCompleted: boolean;
      if (!hasTopic && partial.completed !== true) {
        nextCompleted = false;
      } else if (partial.completed !== undefined) {
        nextCompleted = partial.completed;
      } else {
        nextCompleted = hasTopic || prev.aiMl.completed;
      }

      return {
        ...prev,
        aiMl: {
          ...prev.aiMl,
          ...partial,
          topic: nextTopic,
          completed: nextCompleted,
        },
      };
    });
  };

  const handleToggleComplete = () => {
    if (isCompleted) {
      handleUpdate({ topic: '', completed: false });
    } else {
      handleUpdate({ topic: aiMl.topic && aiMl.topic.trim().length > 0 ? aiMl.topic : 'Machine Learning', completed: true });
    }
  };

  return (
    <div className={`rounded-3xl p-5 border transition-all duration-200 glass-card relative overflow-hidden ${
      isCompleted
        ? 'border-blue-500/40 shadow-blue-500/5 shadow-lg'
        : 'border-slate-200 dark:border-white/10'
    }`}>
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500" />

      {/* Card Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>AI / ML Learning</span>
            </h3>
            <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
              Deep Tech Knowledge
            </span>
          </div>
        </div>

        <button
          onClick={handleToggleComplete}
          className={`p-1.5 rounded-xl transition-colors ${
            isCompleted
              ? 'text-blue-600 dark:text-blue-400 bg-blue-500/10'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
          title={isCompleted ? 'Marked complete (click to undo)' : 'Mark complete'}
        >
          <CheckCircle className={`w-5 h-5 ${isCompleted ? 'fill-blue-500 text-white' : ''}`} />
        </button>
      </div>

      {/* Topic selection and quick pills */}
      <div className="mb-3.5">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1.5">
          <BookOpen className="w-3.5 h-3.5 text-blue-500" />
          <span>Topic Studied</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Attention Mechanism & Multi-Head Self-Attention..."
          value={aiMl.topic || ''}
          onChange={(e) => handleUpdate({ topic: e.target.value })}
          className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 mb-2"
        />

        {/* Suggestion pills */}
        <div className="flex flex-wrap gap-1.5">
          {COMMON_AI_TOPICS.slice(0, 5).map((t) => (
            <button
              key={t}
              onClick={() => handleUpdate({ topic: t })}
              className={`text-[10px] px-2 py-0.5 rounded-lg border transition-all ${
                aiMl.topic === t
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Time spent */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-blue-500/5 border border-blue-500/10 mb-3.5">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-500" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Study Time (minutes)
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {[30, 45, 60, 120].map((m) => (
            <button
              key={m}
              onClick={() => handleUpdate({ durationMinutes: m })}
              className={`px-2 py-0.5 text-[11px] rounded-lg border font-semibold transition-all ${
                aiMl.durationMinutes === m
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              {m >= 60 ? `${m / 60}h` : `${m}m`}
            </button>
          ))}
          <input
            type="number"
            min="0"
            max="600"
            placeholder="m"
            value={aiMl.durationMinutes || ''}
            onChange={(e) => handleUpdate({ durationMinutes: Number(e.target.value) || 0 })}
            className="w-14 px-2 py-1 text-xs text-center rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
          />
        </div>
      </div>

      {/* Key takeaways notes */}
      <div>
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1.5">
          <Lightbulb className="w-3.5 h-3.5 text-blue-500" />
          <span>Key Insights / What You Learned</span>
        </label>
        <textarea
          rows={2}
          placeholder="Implemented forward pass in PyTorch, understood scaled dot-product formula..."
          value={aiMl.learnedNotes || ''}
          onChange={(e) => handleUpdate({ learnedNotes: e.target.value })}
          className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
        />
      </div>
    </div>
  );
};
