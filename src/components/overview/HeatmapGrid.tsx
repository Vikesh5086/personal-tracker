import React, { useState } from 'react';
import { Flame, Info, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DailyLog } from '../../types';

export const HeatmapGrid: React.FC = () => {
  const { profile, allLogs, setCurrentDate, setActiveTab, todayDate } = useApp();
  const [hoveredDay, setHoveredDay] = useState<{
    date: string;
    dayNum: number;
    completion: number;
    perfect: boolean;
    xp: number;
  } | null>(null);

  if (!profile) return null;

  // Build map of date -> DailyLog
  const logsMap = new Map<string, DailyLog>();
  allLogs.forEach((l) => logsMap.set(l.date, l));

  // Generate 100 days starting from profile.startDate
  const startDate = new Date(profile.startDate + 'T00:00:00');
  const days: { date: string; dayNum: number; log?: DailyLog }[] = [];

  for (let i = 0; i < 100; i++) {
    const cur = new Date(startDate);
    cur.setDate(cur.getDate() + i);
    const dateStr = cur.toISOString().split('T')[0];
    days.push({
      date: dateStr,
      dayNum: i + 1,
      log: logsMap.get(dateStr),
    });
  }

  // Get cell color based on completion %
  const getCellColor = (completion: number, isPerfect: boolean, isPast: boolean) => {
    if (isPerfect) return 'bg-amber-400 dark:bg-amber-500 shadow-sm shadow-amber-500/50 ring-1 ring-amber-300';
    if (completion >= 80) return 'bg-emerald-600 dark:bg-emerald-500';
    if (completion >= 55) return 'bg-emerald-500/80 dark:bg-emerald-600/80';
    if (completion >= 30) return 'bg-emerald-400/50 dark:bg-emerald-800/60';
    if (completion > 0) return 'bg-emerald-300/30 dark:bg-emerald-950/80 border border-emerald-500/30';
    if (isPast) return 'bg-slate-200 dark:bg-slate-800/80';
    return 'bg-slate-100 dark:bg-slate-800/30 border border-dashed border-slate-200 dark:border-slate-800';
  };

  const handleCellClick = (dateStr: string) => {
    setCurrentDate(dateStr);
    setActiveTab('dashboard');
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl glass-card border border-slate-200 dark:border-white/10">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>100-Day Challenge Heatmap</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            GitHub-style activity matrix. Darker green = more habits completed. Gold = 100% Perfect Day.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
          <span>Less</span>
          <div className="w-3 h-3 rounded-sm bg-slate-200 dark:bg-slate-800" />
          <div className="w-3 h-3 rounded-sm bg-emerald-300/40 dark:bg-emerald-950" />
          <div className="w-3 h-3 rounded-sm bg-emerald-400/60 dark:bg-emerald-800" />
          <div className="w-3 h-3 rounded-sm bg-emerald-500" />
          <div className="w-3 h-3 rounded-sm bg-amber-400 ring-1 ring-amber-300" />
          <span>Perfect</span>
        </div>
      </div>

      {/* Heatmap Grid (10 columns x 10 rows or responsive flex) */}
      <div className="grid grid-cols-10 sm:grid-cols-20 gap-1.5 sm:gap-2 p-2 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 overflow-x-auto">
        {days.map(({ date, dayNum, log }) => {
          const completion = log?.completionPercentage || 0;
          const isPerfect = Boolean(log?.isPerfectDay);
          const isPast = date <= todayDate;
          const isToday = date === todayDate;

          return (
            <button
              key={date}
              type="button"
              onClick={() => handleCellClick(date)}
              onMouseEnter={() =>
                setHoveredDay({
                  date,
                  dayNum,
                  completion,
                  perfect: isPerfect,
                  xp: log?.xpEarned || 0,
                })
              }
              onMouseLeave={() => setHoveredDay(null)}
              className={`aspect-square rounded-md transition-all relative group cursor-pointer hover:scale-125 hover:z-20 ${getCellColor(
                completion,
                isPerfect,
                isPast
              )} ${isToday ? 'ring-2 ring-indigo-500 ring-offset-1 dark:ring-offset-slate-900' : ''}`}
              title={`Day ${dayNum} (${date}): ${completion}% complete`}
            >
              <span className="sr-only">Day {dayNum}</span>
            </button>
          );
        })}
      </div>

      {/* Tooltip / Active Inspection Bar */}
      <div className="mt-3 min-h-[28px] text-xs flex items-center justify-between text-slate-600 dark:text-slate-300">
        {hoveredDay ? (
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-900 dark:text-white">
              Day {hoveredDay.dayNum} ({hoveredDay.date}):
            </span>
            <span className="font-semibold text-emerald-500">
              {hoveredDay.completion}% Completed
            </span>
            {hoveredDay.perfect && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-amber-500 text-slate-950">
                PERFECT DAY
              </span>
            )}
            <span className="text-slate-400 font-mono">+{hoveredDay.xp} XP</span>
          </div>
        ) : (
          <span className="text-slate-400 text-[11px] italic">
            Hover over any square for details or click to view and edit that day's log.
          </span>
        )}

        <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold cursor-pointer" onClick={() => setActiveTab('calendar')}>
          View Full Calendar →
        </span>
      </div>
    </div>
  );
};
