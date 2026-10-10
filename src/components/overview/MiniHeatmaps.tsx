import React from 'react';
import { Code2, Dumbbell, Droplet, Moon, Brain, Apple } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DailyLog } from '../../types';

interface MiniGridConfig {
  id: string;
  name: string;
  color: string;
  icon: React.ReactNode;
  activeColor: string;
  check: (log: DailyLog) => boolean;
}

export const MiniHeatmaps: React.FC = () => {
  const { allLogs, profile, todayDate } = useApp();

  if (!profile) return null;

  const logsMap = new Map<string, DailyLog>();
  allLogs.forEach((l) => logsMap.set(l.date, l));

  // 28 days (4 weeks) ending today
  const days: string[] = [];
  const end = new Date(todayDate + 'T00:00:00');
  for (let i = 27; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }

  const grids: MiniGridConfig[] = [
    {
      id: 'dsa',
      name: 'DSA Practice',
      color: 'text-purple-400',
      icon: <Code2 className="w-3.5 h-3.5 text-purple-400" />,
      activeColor: 'bg-purple-500 shadow-[0_0_6px_rgba(168,85,247,0.5)]',
      check: (log) => log.dsa.completed || log.dsa.questionsSolved > 0,
    },
    {
      id: 'workout',
      name: 'Fitness & Workout',
      color: 'text-orange-400',
      icon: <Dumbbell className="w-3.5 h-3.5 text-orange-400" />,
      activeColor: 'bg-orange-500 shadow-[0_0_6px_rgba(249,115,22,0.5)]',
      check: (log) => log.workout.completed || (log.workout.type !== 'None' && log.workout.type !== undefined),
    },
    {
      id: 'water',
      name: 'Hydration (2L+)',
      color: 'text-cyan-400',
      icon: <Droplet className="w-3.5 h-3.5 text-cyan-400" />,
      activeColor: 'bg-cyan-500 shadow-[0_0_6px_rgba(6,182,212,0.5)]',
      check: (log) => log.water.completed || log.water.intakeLitres >= 2.0,
    },
    {
      id: 'sleep',
      name: 'Sleep (7h+)',
      color: 'text-indigo-400',
      icon: <Moon className="w-3.5 h-3.5 text-indigo-400" />,
      activeColor: 'bg-indigo-500 shadow-[0_0_6px_rgba(99,102,241,0.5)]',
      check: (log) => log.sleep.completed || log.sleep.durationHours >= 7.0,
    },
    {
      id: 'aiml',
      name: 'AI / ML Studies',
      color: 'text-blue-400',
      icon: <Brain className="w-3.5 h-3.5 text-blue-400" />,
      activeColor: 'bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.5)]',
      check: (log) => Boolean(log.aiMl.completed || (log.aiMl.topic && log.aiMl.topic.trim().length > 0)),
    },
    {
      id: 'eating',
      name: 'Clean Nutrition',
      color: 'text-emerald-400',
      icon: <Apple className="w-3.5 h-3.5 text-emerald-400" />,
      activeColor: 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]',
      check: (log) => Boolean(log.eating.completed || log.eating.type === 'Healthy'),
    },
  ];

  return (
    <div className="space-y-3.5 font-mono">
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400 bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] px-2 py-0.5 rounded">
            MATRIX
          </span>
          <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white uppercase">
            Core Habit Trails // Last 28 Days
          </h3>
        </div>
        <span className="text-xs text-slate-400 dark:text-zinc-500">4-Week Trajectory</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {grids.map((grid) => {
          let activeCount = 0;
          days.forEach((dateStr) => {
            const log = logsMap.get(dateStr);
            if (log && grid.check(log)) activeCount++;
          });
          const rate = Math.round((activeCount / 28) * 100);

          return (
            <div
              key={grid.id}
              className="p-4 rounded-xl bg-white dark:bg-[#161a25] border border-slate-200 dark:border-white/[0.08] shadow-xs dark:shadow-md hover:border-slate-300 dark:hover:border-white/20 transition-all"
            >
              <div className="flex items-center justify-between mb-3 font-mono">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-white/[0.08]">
                    {grid.icon}
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                    {grid.name}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-slate-900 dark:text-white font-mono">
                    {activeCount}/28d
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500 ml-1">({rate}%)</span>
                </div>
              </div>

              {/* 28 GitHub-style micro-squares (4 rows x 7 days) */}
              <div className="grid grid-cols-7 gap-1.5 pt-0.5">
                {days.map((dateStr) => {
                  const log = logsMap.get(dateStr);
                  const isDone = Boolean(log && grid.check(log));
                  return (
                    <div
                      key={dateStr}
                      className={`h-3.5 rounded-[3px] transition-all ${
                        isDone
                          ? grid.activeColor
                          : 'bg-slate-200 dark:bg-zinc-800/60 border border-slate-300 dark:border-white/[0.04]'
                      }`}
                      title={`${dateStr}: ${isDone ? 'Locked' : 'Missed'}`}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
