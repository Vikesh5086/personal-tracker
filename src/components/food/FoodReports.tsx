import React, { useMemo } from 'react';
import { PieChart, BarChart2, AlertCircle, CheckCircle2, Flame, Utensils, Sparkles } from 'lucide-react';
import { DailyLog } from '../../types';

interface FoodReportsProps {
  allLogs: DailyLog[];
  todayDate: string;
  dailyTarget: number;
}

export const FoodReports: React.FC<FoodReportsProps> = ({ allLogs, todayDate, dailyTarget }) => {
  const logsMap = useMemo(() => {
    const map = new Map<string, DailyLog>();
    allLogs.forEach((l) => map.set(l.date, l));
    return map;
  }, [allLogs]);

  // Last 7 days ending today (chronological order)
  const last7Days = useMemo(() => {
    const dates: string[] = [];
    const end = new Date(todayDate + 'T00:00:00');
    for (let i = 6; i >= 0; i--) {
      const d = new Date(end);
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  }, [todayDate]);

  // Aggregate calorie breakdown by meal type across the last 7 days
  const mealBreakdown = useMemo(() => {
    let breakfastTotal = 0;
    let lunchTotal = 0;
    let dinnerTotal = 0;
    let snacksTotal = 0;

    last7Days.forEach((date) => {
      const log = logsMap.get(date);
      if (log?.eating) {
        breakfastTotal += log.eating.breakfastCalories || 0;
        lunchTotal += log.eating.lunchCalories || 0;
        dinnerTotal += log.eating.dinnerCalories || 0;
        snacksTotal += log.eating.snacksCalories || 0;
      }
    });

    const grandTotal = breakfastTotal + lunchTotal + dinnerTotal + snacksTotal;

    const items = [
      {
        name: 'Breakfast',
        calories: breakfastTotal,
        color: '#f59e0b', // amber
        bgClass: 'bg-amber-400',
        textClass: 'text-amber-400',
        percent: grandTotal > 0 ? Math.round((breakfastTotal / grandTotal) * 100) : 25,
      },
      {
        name: 'Lunch',
        calories: lunchTotal,
        color: '#10b981', // emerald
        bgClass: 'bg-emerald-400',
        textClass: 'text-emerald-400',
        percent: grandTotal > 0 ? Math.round((lunchTotal / grandTotal) * 100) : 25,
      },
      {
        name: 'Dinner',
        calories: dinnerTotal,
        color: '#6366f1', // indigo
        bgClass: 'bg-indigo-400',
        textClass: 'text-indigo-400',
        percent: grandTotal > 0 ? Math.round((dinnerTotal / grandTotal) * 100) : 25,
      },
      {
        name: 'Snacks',
        calories: snacksTotal,
        color: '#ec4899', // pink
        bgClass: 'bg-pink-400',
        textClass: 'text-pink-400',
        percent: grandTotal > 0 ? Math.round((snacksTotal / grandTotal) * 100) : 25,
      },
    ];

    return { items, grandTotal };
  }, [last7Days, logsMap]);

  // 7-day day-wise calorie bar chart data
  const dayWiseData = useMemo(() => {
    return last7Days.map((date) => {
      const log = logsMap.get(date);
      const total = log?.eating?.totalCalories || 
        ((log?.eating?.breakfastCalories || 0) + 
         (log?.eating?.lunchCalories || 0) + 
         (log?.eating?.dinnerCalories || 0) + 
         (log?.eating?.snacksCalories || 0));

      const d = new Date(date + 'T00:00:00');
      const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];

      return {
        date,
        dayName,
        shortDate: date.slice(5),
        calories: total,
        isOverTarget: total > dailyTarget,
        isToday: date === todayDate,
      };
    });
  }, [last7Days, logsMap, dailyTarget, todayDate]);

  const maxCalorieInWeek = useMemo(() => {
    const maxDay = Math.max(0, ...dayWiseData.map((d) => d.calories));
    return Math.max(dailyTarget * 1.25, maxDay * 1.15, 2500);
  }, [dayWiseData, dailyTarget]);

  // Junk food stats: last 7 days + full challenge
  const junkFoodStats = useMemo(() => {
    let weekYesCount = 0;
    let weekLoggedCount = 0;
    const weekStrip = last7Days.map((date) => {
      const log = logsMap.get(date);
      const d = new Date(date + 'T00:00:00');
      const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
      const ateJunk = log?.eating?.ateJunkFood;
      const isLogged = typeof ateJunk === 'boolean';

      if (isLogged) {
        weekLoggedCount++;
        if (ateJunk === true) weekYesCount++;
      }

      return {
        date,
        dayName,
        shortDate: date.slice(5),
        ateJunk,
        isLogged,
        isToday: date === todayDate,
      };
    });

    // Full challenge stats
    let totalChallengeYes = 0;
    let totalChallengeLogged = 0;
    allLogs.forEach((log) => {
      if (typeof log.eating?.ateJunkFood === 'boolean') {
        totalChallengeLogged++;
        if (log.eating.ateJunkFood === true) {
          totalChallengeYes++;
        }
      }
    });

    const cleanChallengeDays = totalChallengeLogged - totalChallengeYes;

    return {
      weekYesCount,
      weekLoggedCount,
      weekCleanCount: weekLoggedCount - weekYesCount,
      weekStrip,
      totalChallengeYes,
      totalChallengeLogged,
      cleanChallengeDays,
    };
  }, [last7Days, logsMap, allLogs, todayDate]);

  // SVG Pie chart calculation
  const piePaths = useMemo(() => {
    if (mealBreakdown.grandTotal === 0) return [];
    let cumulativeAngle = 0;
    const size = 160;
    const center = size / 2;
    const radius = 64;
    const innerRadius = 42; // Donut style

    return mealBreakdown.items.map((item) => {
      if (item.calories === 0) return null;
      const sliceAngle = (item.calories / mealBreakdown.grandTotal) * 2 * Math.PI;
      const startAngle = cumulativeAngle;
      const endAngle = cumulativeAngle + sliceAngle;
      cumulativeAngle = endAngle;

      // Outer arc
      const x1 = center + radius * Math.cos(startAngle);
      const y1 = center + radius * Math.sin(startAngle);
      const x2 = center + radius * Math.cos(endAngle);
      const y2 = center + radius * Math.sin(endAngle);

      // Inner arc
      const x3 = center + innerRadius * Math.cos(endAngle);
      const y3 = center + innerRadius * Math.sin(endAngle);
      const x4 = center + innerRadius * Math.cos(startAngle);
      const y4 = center + innerRadius * Math.sin(startAngle);

      const largeArc = sliceAngle > Math.PI ? 1 : 0;

      const pathData = [
        `M ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
        `L ${x3} ${y3}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
        'Z',
      ].join(' ');

      return {
        ...item,
        pathData,
      };
    }).filter(Boolean);
  }, [mealBreakdown]);

  return (
    <div className="space-y-6 pt-2 font-mono">
      <div className="flex items-center gap-2 pb-1 border-b border-slate-200 dark:border-white/[0.06]">
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
          7-DAY FOOD TELEMETRY
        </span>
        <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white uppercase">
          Nutrition & Calorie Reports
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* REPORT 1: MEAL BREAKDOWN PIE / DONUT */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#161a25] border border-slate-200 dark:border-white/[0.08] shadow-xs dark:shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.06]">
            <div>
              <span className="text-[10px] text-slate-500 dark:text-zinc-400 uppercase font-bold block">
                7-Day Split
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <PieChart className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                <span>Meal-Wise Calorie Share</span>
              </h4>
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">
              {mealBreakdown.grandTotal.toLocaleString()} kcal total
            </span>
          </div>

          <div className="py-4 flex flex-col sm:flex-row items-center justify-around gap-6">
            {/* SVG Donut */}
            <div className="relative w-40 h-40 shrink-0 flex items-center justify-center">
              {mealBreakdown.grandTotal > 0 ? (
                <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
                  {piePaths.map((slice, i) => (
                    slice && (
                      <path
                        key={i}
                        d={slice.pathData}
                        fill={slice.color}
                        className="transition-all duration-300 hover:opacity-80"
                      />
                    )
                  ))}
                </svg>
              ) : (
                <div className="w-32 h-32 rounded-full border-4 border-dashed border-slate-200 dark:border-zinc-800 flex items-center justify-center text-center p-3 text-[11px] text-slate-400 dark:text-zinc-500">
                  No calories logged in past 7 days
                </div>
              )}

              {/* Center Donut Hub */}
              {mealBreakdown.grandTotal > 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase font-semibold">Total</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    {Math.round(mealBreakdown.grandTotal / 7)}
                  </span>
                  <span className="text-[9px] text-slate-500 dark:text-zinc-400">kcal/day avg</span>
                </div>
              )}
            </div>

            {/* Legend & Breakdown */}
            <div className="space-y-2 w-full sm:w-auto text-xs flex-1 max-w-xs">
              {mealBreakdown.items.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-white/[0.04]"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-sm shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-slate-700 dark:text-zinc-300 font-semibold">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-slate-500 dark:text-zinc-400">{item.calories.toLocaleString()} kcal</span>
                    <span className="font-bold text-slate-900 dark:text-white min-w-[32px] text-right">
                      {item.percent}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 text-[10px] text-slate-400 dark:text-zinc-500 flex justify-between border-t border-slate-100 dark:border-white/[0.04]">
            <span>Aggregated across last 7 calendar days</span>
            <span>4 Core Meal Buckets</span>
          </div>
        </div>

        {/* REPORT 2: 7-DAY DAY-WISE CALORIE BARS WITH TARGET REFERENCE LINE */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#161a25] border border-slate-200 dark:border-white/[0.08] shadow-xs dark:shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.06]">
            <div>
              <span className="text-[10px] text-slate-500 dark:text-zinc-400 uppercase font-bold block">
                Trajectory & Variance
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>Day-Wise Calories vs Target</span>
              </h4>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-zinc-300 font-semibold">
                Target: {dailyTarget} kcal
              </span>
            </div>
          </div>

          {/* Bar Chart Container */}
          <div className="relative pt-6 pb-2 my-2">
            {/* Target Reference Line */}
            {maxCalorieInWeek > 0 && (
              <div
                className="absolute left-0 right-0 z-10 flex items-center pointer-events-none"
                style={{
                  bottom: `${Math.min(92, Math.max(12, (dailyTarget / maxCalorieInWeek) * 160))}px`,
                }}
              >
                <div className="w-full border-b border-dashed border-cyan-500/60" />
                <span className="absolute right-0 -top-3.5 px-1.5 py-0.5 text-[9px] font-bold rounded bg-cyan-100 text-cyan-800 border border-cyan-300 dark:bg-cyan-950/80 dark:text-cyan-300 dark:border-cyan-500/30">
                  TARGET {dailyTarget}
                </span>
              </div>
            )}

            {/* Bars Grid */}
            <div className="grid grid-cols-7 gap-2 items-end h-44 pt-4 border-b border-slate-100 dark:border-white/[0.06] pb-1">
              {dayWiseData.map((day) => {
                const heightPercent = day.calories > 0 
                  ? Math.min(100, Math.max(10, Math.round((day.calories / maxCalorieInWeek) * 100))) 
                  : 0;

                const isOver = day.calories > dailyTarget;

                return (
                  <div key={day.date} className="flex flex-col items-center justify-end h-full group">
                    {/* Hover Callout */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-1 px-1.5 py-0.5 rounded bg-slate-900 dark:bg-zinc-800 text-[10px] text-white whitespace-nowrap shadow-md pointer-events-none">
                      {day.calories > 0 ? `${day.calories} kcal` : 'Unlogged'}
                    </div>

                    {/* Bar Pillar */}
                    <div className="w-full max-w-[28px] h-32 flex items-end justify-center">
                      {day.calories > 0 ? (
                        <div
                          className={`w-full rounded-t-md transition-all duration-300 relative ${
                            isOver
                              ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]'
                              : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                          }`}
                          style={{ height: `${heightPercent}%` }}
                        >
                          <div className="absolute -top-4 left-0 right-0 text-center text-[9px] font-bold text-slate-700 dark:text-zinc-300 truncate">
                            {day.calories}
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-1.5 rounded-sm bg-slate-200 dark:bg-zinc-800 border border-slate-300 dark:border-white/[0.04]" />
                      )}
                    </div>

                    {/* Day label */}
                    <div className="mt-2 text-center">
                      <div className={`text-[11px] font-bold ${day.isToday ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-700 dark:text-zinc-300'}`}>
                        {day.dayName}
                      </div>
                      <div className="text-[9px] text-slate-400 dark:text-zinc-500">{day.shortDate}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2 text-[10px] text-slate-400 dark:text-zinc-500 flex items-center justify-between border-t border-slate-100 dark:border-white/[0.04]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-xs bg-emerald-500" />
              <span>≤ Target</span>
              <span className="w-2 h-2 rounded-xs bg-rose-500 ml-2" />
              <span>&gt; Target (Surplus)</span>
            </span>
            <span>Dashed line = Daily Target</span>
          </div>
        </div>
      </div>

      {/* REPORT 3: JUNK FOOD FREQUENCY & MICRO-SQUARE 7-DAY STRIP */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#161a25] border border-slate-200 dark:border-white/[0.08] shadow-xs dark:shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-white/[0.06]">
          <div>
            <span className="text-[10px] text-slate-500 dark:text-zinc-400 uppercase font-bold block">
              Discipline Audit
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-500 dark:text-orange-400" />
              <span>Junk Food Frequency & Consistency Strip</span>
            </h4>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-xs flex-wrap">
            <div className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-white/[0.08]">
              <span className="text-slate-500 dark:text-zinc-400 mr-2 text-[10px] uppercase font-bold">This Week:</span>
              <span className={`font-black ${junkFoodStats.weekYesCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {junkFoodStats.weekYesCount} of 7 days
              </span>
              <span className="text-slate-400 dark:text-zinc-500 text-[10px] ml-1">junk</span>
            </div>

            <div className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-white/[0.08]">
              <span className="text-slate-500 dark:text-zinc-400 mr-2 text-[10px] uppercase font-bold">Challenge Total:</span>
              <span className="text-slate-900 dark:text-white font-black">
                {junkFoodStats.totalChallengeYes}
              </span>
              <span className="text-slate-400 dark:text-zinc-500 text-[10px] ml-1">
                of {junkFoodStats.totalChallengeLogged} logged days
              </span>
            </div>
          </div>
        </div>

        {/* 7-Day GitHub-style Micro-Square Strip */}
        <div className="space-y-2">
          <div className="text-[11px] text-slate-600 dark:text-zinc-400 font-semibold flex items-center justify-between">
            <span>Last 7 Days Day-by-Day Strip:</span>
            <span className="text-emerald-700 dark:text-emerald-400">{junkFoodStats.weekCleanCount} Clean Days This Week 🥗</span>
          </div>

          <div className="grid grid-cols-7 gap-2 sm:gap-3">
            {junkFoodStats.weekStrip.map((day) => {
              const hasJunk = day.ateJunk === true;
              const isClean = day.ateJunk === false;
              const isUnlogged = day.ateJunk === null || day.ateJunk === undefined;

              return (
                <div
                  key={day.date}
                  className={`p-2.5 sm:p-3 rounded-xl border flex flex-col items-center justify-between transition-all ${
                    hasJunk
                      ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-300 dark:border-rose-500/40 text-rose-800 dark:text-rose-300 shadow-xs'
                      : isClean
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 shadow-xs'
                      : 'bg-slate-50 dark:bg-zinc-900/60 border-slate-200 dark:border-white/[0.06] text-slate-400 dark:text-zinc-500'
                  } ${day.isToday ? 'ring-2 ring-slate-900 dark:ring-white ring-offset-1 ring-offset-white dark:ring-offset-[#161a25]' : ''}`}
                >
                  <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-zinc-400">
                    {day.dayName}
                  </div>

                  {/* Tactile indicator block */}
                  <div className="my-2">
                    {hasJunk ? (
                      <div className="w-6 h-6 rounded-lg bg-rose-500 flex items-center justify-center text-white text-xs shadow-md shadow-rose-500/30">
                        🍔
                      </div>
                    ) : isClean ? (
                      <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center text-white text-xs shadow-md shadow-emerald-500/30">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-zinc-800 border border-slate-300 dark:border-white/[0.08] flex items-center justify-center text-[10px] text-slate-400 dark:text-zinc-500">
                        --
                      </div>
                    )}
                  </div>

                  <div className="text-[10px] font-bold text-center">
                    {hasJunk ? 'Junk Ate' : isClean ? 'Clean' : 'Unset'}
                  </div>
                  <div className="text-[9px] text-slate-400 dark:text-zinc-500">{day.shortDate}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-2 text-[10px] text-slate-400 dark:text-zinc-500 flex items-center justify-between border-t border-slate-100 dark:border-white/[0.04]">
          <span className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-xs bg-emerald-500" /> Clean Day (No Junk)
            </span>
            <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 ml-2 font-semibold">
              <span className="w-2 h-2 rounded-xs bg-rose-500" /> Ate Junk Food
            </span>
          </span>
          <span>Logged independently from calorie counts</span>
        </div>
      </div>
    </div>
  );
};
