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

  // We show the past 28 days (4 weeks) for each habit
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
      name: 'DSA / LeetCode',
      color: 'text-purple-500',
      icon: <Code2 className="w-4 h-4 text-purple-500" />,
      activeColor: 'bg-purple-500 shadow-sm shadow-purple-500/50',
      check: (log) => log.dsa.completed || log.dsa.questionsSolved > 0,
    },
    {
      id: 'workout',
      name: 'Workout & Fitness',
      color: 'text-orange-500',
      icon: <Dumbbell className="w-4 h-4 text-orange-500" />,
      activeColor: 'bg-orange-500 shadow-sm shadow-orange-500/50',
      check: (log) => log.workout.completed || (log.workout.type !== 'None' && log.workout.type !== undefined),
    },
    {
      id: 'water',
      name: 'Water (2L+)',
      color: 'text-cyan-500',
      icon: <Droplet className="w-4 h-4 text-cyan-500" />,
      activeColor: 'bg-cyan-500 shadow-sm shadow-cyan-500/50',
      check: (log) => log.water.completed || log.water.intakeLitres >= 2.0,
    },
    {
      id: 'sleep',
      name: 'Sleep (7h+)',
      color: 'text-indigo-500',
      icon: <Moon className="w-4 h-4 text-indigo-500" />,
      activeColor: 'bg-indigo-500 shadow-sm shadow-indigo-500/50',
      check: (log) => log.sleep.completed || log.sleep.durationHours >= 7.0,
    },
    {
      id: 'aiml',
      name: 'AI / ML Study',
      color: 'text-blue-500',
      icon: <Brain className="w-4 h-4 text-blue-500" />,
      activeColor: 'bg-blue-500 shadow-sm shadow-blue-500/50',
      check: (log) => Boolean(log.aiMl.completed || (log.aiMl.topic && log.aiMl.topic.trim().length > 0)),
    },
    {
      id: 'eating',
      name: 'Clean Nutrition',
      color: 'text-emerald-500',
      icon: <Apple className="w-4 h-4 text-emerald-500" />,
      activeColor: 'bg-emerald-500 shadow-sm shadow-emerald-500/50',
      check: (log) => Boolean(log.eating.completed || log.eating.type === 'Healthy'),
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Habit Streak Grids (Last 4 Weeks)
        </h3>
        <span className="text-xs text-slate-400">28-Day Consistency</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              className="p-4 rounded-2xl glass-card border border-slate-200 dark:border-white/10"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                    {grid.icon}
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {grid.name}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold font-mono text-slate-800 dark:text-slate-200">
                    {activeCount}/28d
                  </span>
                  <span className="text-[10px] text-slate-400 ml-1">({rate}%)</span>
                </div>
              </div>

              {/* 28 cells: 4 rows of 7 days */}
              <div className="grid grid-cols-7 gap-1.5">
                {days.map((dateStr) => {
                  const log = logsMap.get(dateStr);
                  const isDone = Boolean(log && grid.check(log));
                  return (
                    <div
                      key={dateStr}
                      className={`h-4 rounded-md transition-all ${
                        isDone
                          ? grid.activeColor
                          : 'bg-slate-200 dark:bg-slate-800'
                      }`}
                      title={`${dateStr}: ${isDone ? 'Completed' : 'Missed'}`}
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
