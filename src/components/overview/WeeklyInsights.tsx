import React from 'react';
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DailyLog } from '../../types';

export const WeeklyInsights: React.FC = () => {
  const { allLogs, todayDate } = useApp();

  const logsMap = new Map<string, DailyLog>();
  allLogs.forEach((l) => logsMap.set(l.date, l));

  // Build This Week (last 7 days: 0 to 6 days ago)
  const thisWeekDates: string[] = [];
  const end = new Date(todayDate + 'T00:00:00');
  for (let i = 0; i < 7; i++) {
    const d = new Date(end);
    d.setDate(d.getDate() - i);
    thisWeekDates.push(d.toISOString().split('T')[0]);
  }

  // Build Last Week (7 to 13 days ago)
  const lastWeekDates: string[] = [];
  for (let i = 7; i < 14; i++) {
    const d = new Date(end);
    d.setDate(d.getDate() - i);
    lastWeekDates.push(d.toISOString().split('T')[0]);
  }

  const computeMetrics = (dates: string[]) => {
    let dsa = 0;
    let sleepHours = 0;
    let waterLitres = 0;
    let workouts = 0;
    let perfectDays = 0;
    let count = 0;

    dates.forEach((date) => {
      const log = logsMap.get(date);
      if (log) {
        count++;
        dsa += log.dsa?.questionsSolved || 0;
        sleepHours += log.sleep?.durationHours || 0;
        waterLitres += log.water?.intakeLitres || 0;
        if (log.workout?.type && log.workout.type !== 'None' && log.workout.type !== 'Rest day') workouts++;
        if (log.isPerfectDay) perfectDays++;
      }
    });

    return {
      dsa,
      avgSleep: Number((sleepHours / 7).toFixed(1)),
      avgWater: Number((waterLitres / 7).toFixed(1)),
      workouts,
      perfectDays,
    };
  };

  const cur = computeMetrics(thisWeekDates);
  const prev = computeMetrics(lastWeekDates);

  const diffs = [
    {
      title: 'DSA Practice',
      thisWeek: `${cur.dsa} solved`,
      lastWeek: `${prev.dsa} solved`,
      diff: cur.dsa - prev.dsa,
      unit: 'problems',
      isPositiveGood: true,
    },
    {
      title: 'Sleep Average',
      thisWeek: `${cur.avgSleep}h / night`,
      lastWeek: `${prev.avgSleep}h / night`,
      diff: Number((cur.avgSleep - prev.avgSleep).toFixed(1)),
      unit: 'hrs',
      isPositiveGood: true,
    },
    {
      title: 'Water Intake',
      thisWeek: `${cur.avgWater}L / day`,
      lastWeek: `${prev.avgWater}L / day`,
      diff: Number((cur.avgWater - prev.avgWater).toFixed(1)),
      unit: 'L',
      isPositiveGood: true,
    },
    {
      title: 'Workouts Completed',
      thisWeek: `${cur.workouts} sessions`,
      lastWeek: `${prev.workouts} sessions`,
      diff: cur.workouts - prev.workouts,
      unit: 'sessions',
      isPositiveGood: true,
    },
  ];

  return (
    <div className="rounded-2xl bg-white dark:bg-[#161a25] border border-slate-200 dark:border-white/[0.08] p-5 shadow-xs dark:shadow-xl font-mono">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-white/[0.06]">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400 bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] px-2 py-0.5 rounded">
            VELOCITY
          </span>
          <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white uppercase">
            Discipline Delta Audit // 7-Day Window Comparison
          </h3>
        </div>
        <span className="text-xs text-slate-400 dark:text-zinc-500">Current vs Previous 7d</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {diffs.map((item) => {
          const isUp = item.diff > 0;
          const isDown = item.diff < 0;
          const isNeutral = item.diff === 0;

          const isGood = (isUp && item.isPositiveGood) || (isDown && !item.isPositiveGood);

          return (
            <div
              key={item.title}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-white/[0.06] hover:border-slate-300 dark:hover:border-white/20 transition-all font-mono"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                  {item.title}
                </span>
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded ${
                    isNeutral
                      ? 'bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'
                      : isGood
                      ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30'
                      : 'bg-rose-50 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-500/30'
                  }`}
                >
                  {isUp && <TrendingUp className="w-3 h-3" />}
                  {isDown && <TrendingDown className="w-3 h-3" />}
                  {isNeutral && <Minus className="w-3 h-3" />}
                  <span>
                    {isUp ? `+${item.diff}` : `${item.diff}`} {item.unit}
                  </span>
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between text-slate-900 dark:text-white font-bold">
                  <span className="text-slate-400 dark:text-zinc-500 font-normal">This window:</span>
                  <span>{item.thisWeek}</span>
                </div>
                <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 text-[11px]">
                  <span className="text-slate-400 dark:text-zinc-600">Prior window:</span>
                  <span>{item.lastWeek}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
