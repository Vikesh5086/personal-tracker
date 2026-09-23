import React, { useState, useEffect } from 'react';
import { Clock, Plus, CheckCircle2, Circle, Trash2, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TimeBlock } from '../../types';
import { getTimeBlocks, saveTimeBlock, deleteTimeBlock } from '../../services/db';

export const TimeBlockPlanner: React.FC = () => {
  const { currentDate } = useApp();
  const [blocks, setBlocks] = useState<TimeBlock[]>([]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:30');
  const [task, setTask] = useState('');
  const [category, setCategory] = useState<TimeBlock['category']>('dsa');

  const loadBlocks = async () => {
    const data = await getTimeBlocks(currentDate);
    setBlocks(data.sort((a, b) => a.startTime.localeCompare(b.startTime)));
  };

  useEffect(() => {
    loadBlocks();
  }, [currentDate]);

  const handleAddBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task.trim()) return;

    const newBlock: TimeBlock = {
      id: 'tb_' + Date.now(),
      date: currentDate,
      startTime,
      endTime,
      task: task.trim(),
      category,
      completed: false,
    };

    await saveTimeBlock(newBlock);
    setTask('');
    await loadBlocks();
  };

  const handleToggle = async (block: TimeBlock) => {
    const updated = { ...block, completed: !block.completed };
    await saveTimeBlock(updated);
    await loadBlocks();
  };

  const handleDelete = async (id: string) => {
    await deleteTimeBlock(id);
    await loadBlocks();
  };

  const categoryColors: Record<TimeBlock['category'], { bg: string; text: string }> = {
    dsa: { bg: 'bg-purple-500/10 border-purple-500/30', text: 'text-purple-600 dark:text-purple-400' },
    aiml: { bg: 'bg-blue-500/10 border-blue-500/30', text: 'text-blue-600 dark:text-blue-400' },
    workout: { bg: 'bg-orange-500/10 border-orange-500/30', text: 'text-orange-600 dark:text-orange-400' },
    reading: { bg: 'bg-emerald-500/10 border-emerald-500/30', text: 'text-emerald-600 dark:text-emerald-400' },
    work: { bg: 'bg-indigo-500/10 border-indigo-500/30', text: 'text-indigo-600 dark:text-indigo-400' },
    personal: { bg: 'bg-slate-500/10 border-slate-500/30', text: 'text-slate-600 dark:text-slate-400' },
  };

  return (
    <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-white/10 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Time-Blocking Schedule</span>
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            Daily Hourly Planner
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Design your hours intentionally for {currentDate}. Protect deep work blocks.
          </p>
        </div>
      </div>

      {/* Add new Block Form */}
      <form onSubmit={handleAddBlock} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              Start Time
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs font-mono rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              End Time
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs font-mono rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              Block Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TimeBlock['category'])}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="dsa">DSA Practice</option>
              <option value="aiml">AI / ML Research</option>
              <option value="workout">Gym / Workout</option>
              <option value="reading">Reading / Books</option>
              <option value="work">Career / Work</option>
              <option value="personal">Personal / Life</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Focus objective (e.g., Solve 3 Graph DP problems, PyTorch lecture)..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="flex-1 px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Block</span>
          </button>
        </div>
      </form>

      {/* Block Timeline List */}
      <div className="space-y-2">
        {blocks.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            No time blocks scheduled for {currentDate}. Plan your morning and evening focus!
          </div>
        ) : (
          blocks.map((b) => {
            const style = categoryColors[b.category] || categoryColors.work;
            return (
              <div
                key={b.id}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                  b.completed
                    ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                    : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleToggle(b)}
                    className="text-blue-500 hover:text-blue-600 shrink-0"
                  >
                    {b.completed ? (
                      <CheckCircle2 className="w-5 h-5 fill-blue-500 text-white" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-400 hover:text-blue-400" />
                    )}
                  </button>

                  <div className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 shrink-0">
                    {b.startTime} - {b.endTime}
                  </div>

                  <span
                    className={`text-xs ${
                      b.completed
                        ? 'line-through text-slate-400'
                        : 'font-semibold text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {b.task}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-lg border ${style.bg} ${style.text}`}
                  >
                    {b.category}
                  </span>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-500"
                    title="Delete block"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
