import React from 'react';
import { Sparkles, TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react';
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
        dsa += log.dsa.questionsSolved || 0;
        sleepHours += log.sleep.durationHours || 0;
        waterLitres += log.water.intakeLitres || 0;
        if (log.workout.type && log.workout.type !== 'None' && log.workout.type !== 'Rest day') workouts++;
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
      title: 'DSA Questions',
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
    <div className="p-5 sm:p-6 rounded-3xl glass-card border border-slate-200 dark:border-white/10">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            This Week vs Last Week Insights
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Comparative performance velocity over the last 14 days
          </p>
        </div>
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
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {item.title}
                </span>
                <span
                  className={`inline-flex items-center gap-0.5 text-xs font-black px-2 py-0.5 rounded-lg ${
                    isNeutral
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                      : isGood
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {isUp && <TrendingUp className="w-3.5 h-3.5" />}
                  {isDown && <TrendingDown className="w-3.5 h-3.5" />}
                  {isNeutral && <Minus className="w-3.5 h-3.5" />}
                  <span>
                    {isUp ? `+${item.diff}` : `${item.diff}`} {item.unit}
                  </span>
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between text-slate-900 dark:text-white font-bold">
                  <span className="text-slate-400 font-normal">This week:</span>
                  <span className="font-mono">{item.thisWeek}</span>
                </div>
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span>Last week:</span>
                  <span className="font-mono">{item.lastWeek}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
