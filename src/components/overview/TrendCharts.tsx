import React, { useState } from 'react';
import { Droplet, Moon, Dumbbell, Code2, TrendingUp, BarChart2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DailyLog } from '../../types';

export const TrendCharts: React.FC = () => {
  const { allLogs, todayDate } = useApp();
  const [rangeDays, setRangeDays] = useState<7 | 14 | 30>(14);

  const logsMap = new Map<string, DailyLog>();
  allLogs.forEach((l) => logsMap.set(l.date, l));

  // Generate date array for the selected range ending today
  const dates: string[] = [];
  const end = new Date(todayDate + 'T00:00:00');
  for (let i = rangeDays - 1; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }

  // 1. Water trend data
  const waterData = dates.map((date) => {
    const log = logsMap.get(date);
    return {
      date,
      value: log?.water?.intakeLitres || 0,
      label: date.slice(5),
    };
  });
  const maxWater = Math.max(3.5, ...waterData.map((d) => d.value));

  // 2. Sleep trend data
  const sleepData = dates.map((date) => {
    const log = logsMap.get(date);
    return {
      date,
      value: log?.sleep?.durationHours || 0,
      label: date.slice(5),
    };
  });
  const maxSleep = Math.max(10, ...sleepData.map((d) => d.value));

  // 3. DSA trend data
  let runningDsa = 0;
  const dsaData = dates.map((date) => {
    const log = logsMap.get(date);
    const count = log?.dsa?.questionsSolved || 0;
    runningDsa += count;
    return {
      date,
      daily: count,
      cumulative: runningDsa,
      label: date.slice(5),
    };
  });
  const maxDsaDaily = Math.max(5, ...dsaData.map((d) => d.daily));

  // 4. Workout split data
  let strengthCount = 0;
  let cardioCount = 0;
  let bothCount = 0;
  let restCount = 0;

  dates.forEach((date) => {
    const log = logsMap.get(date);
    const type = log?.workout?.type;
    if (type === 'Strength only') strengthCount++;
    else if (type === 'Cardio only') cardioCount++;
    else if (type === 'Both') bothCount++;
    else if (type === 'Rest day') restCount++;
  });
  const totalWorkoutLogs = strengthCount + cardioCount + bothCount + restCount || 1;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-400 bg-white/[0.05] border border-white/[0.08] px-2 py-0.5 rounded">
            TELEMETRY
          </span>
          <h3 className="text-sm font-mono font-bold tracking-tight text-white uppercase">
            Habit Trajectory & Distribution
          </h3>
        </div>

        {/* Range Selector */}
        <div className="inline-flex items-center p-1 rounded-xl bg-zinc-900 border border-white/[0.08] font-mono text-xs">
          {([7, 14, 30] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRangeDays(r)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                rangeDays === r
                  ? 'bg-zinc-100 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {r}d Window
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart 1: Water Intake Trend */}
        <div className="p-5 rounded-2xl bg-[#0b0f19] border border-white/[0.08] shadow-lg">
          <div className="flex items-center justify-between mb-4 font-mono">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Droplet className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase">Hydration Track</h4>
                <span className="text-[10px] text-zinc-500">Target: 2.5L / day</span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-400">
              Avg: {(waterData.reduce((acc, d) => acc + d.value, 0) / rangeDays).toFixed(1)}L
            </span>
          </div>

          {/* SVG Bar Chart */}
          <div className="h-36 flex items-end gap-1 sm:gap-1.5 pt-6 pb-2 border-b border-white/[0.06] relative">
            {/* Target 2.5L line */}
            <div
              className="absolute left-0 right-0 border-b border-dashed border-cyan-500/40 pointer-events-none flex items-center justify-end"
              style={{ bottom: `${(2.5 / maxWater) * 100}%` }}
            >
              <span className="text-[9px] font-mono font-bold text-cyan-400 bg-zinc-900 px-1 rounded -translate-y-2 border border-cyan-500/30">
                2.5L Target
              </span>
            </div>

            {waterData.map((d) => {
              const heightPercent = Math.min(100, Math.round((d.value / maxWater) * 100));
              const hitTarget = d.value >= 2.5;
              return (
                <div key={d.date} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  <div
                    className={`w-full rounded-t-[2px] transition-all duration-300 ${
                      hitTarget
                        ? 'bg-cyan-500 hover:bg-cyan-400 shadow-[0_0_4px_rgba(6,182,212,0.4)]'
                        : d.value > 0
                        ? 'bg-cyan-500/40 hover:bg-cyan-500/60'
                        : 'bg-zinc-800/60'
                    }`}
                    style={{ height: `${Math.max(4, heightPercent)}%` }}
                  />
                  {/* Tooltip */}
                  <div className="absolute -top-7 hidden group-hover:flex px-2 py-0.5 rounded bg-zinc-900 border border-white/[0.1] text-white text-[10px] font-mono z-10 whitespace-nowrap shadow-md">
                    {d.label}: {d.value}L
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-[10px] text-zinc-500 mt-2 font-mono">
            <span>{waterData[0]?.label}</span>
            <span>{waterData[Math.floor(waterData.length / 2)]?.label}</span>
            <span>{waterData[waterData.length - 1]?.label}</span>
          </div>
        </div>

        {/* Chart 2: Sleep Pattern Trend */}
        <div className="p-5 rounded-2xl bg-[#0b0f19] border border-white/[0.08] shadow-lg">
          <div className="flex items-center justify-between mb-4 font-mono">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Moon className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase">Sleep Recovery</h4>
                <span className="text-[10px] text-zinc-500">Target: 7.5 - 8.5 Hours</span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-400">
              Avg: {(sleepData.reduce((acc, d) => acc + d.value, 0) / rangeDays).toFixed(1)}h
            </span>
          </div>

          {/* Sleep Bar Chart */}
          <div className="h-36 flex items-end gap-1 sm:gap-1.5 pt-6 pb-2 border-b border-white/[0.06] relative">
            {/* Target 7.5h line */}
            <div
              className="absolute left-0 right-0 border-b border-dashed border-indigo-500/40 pointer-events-none flex items-center justify-end"
              style={{ bottom: `${(7.5 / maxSleep) * 100}%` }}
            >
              <span className="text-[9px] font-mono font-bold text-indigo-400 bg-zinc-900 px-1 rounded -translate-y-2 border border-indigo-500/30">
                7.5h Target
              </span>
            </div>

            {sleepData.map((d) => {
              const heightPercent = Math.min(100, Math.round((d.value / maxSleep) * 100));
              const optimal = d.value >= 7.5 && d.value <= 9.0;
              return (
                <div key={d.date} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  <div
                    className={`w-full rounded-t-[2px] transition-all duration-300 ${
                      optimal
                        ? 'bg-indigo-500 hover:bg-indigo-400 shadow-[0_0_4px_rgba(99,102,241,0.4)]'
                        : d.value >= 6.0
                        ? 'bg-indigo-400/50 hover:bg-indigo-400/70'
                        : d.value > 0
                        ? 'bg-rose-500/50 hover:bg-rose-500'
                        : 'bg-zinc-800/60'
                    }`}
                    style={{ height: `${Math.max(4, heightPercent)}%` }}
                  />
                  <div className="absolute -top-7 hidden group-hover:flex px-2 py-0.5 rounded bg-zinc-900 border border-white/[0.1] text-white text-[10px] font-mono z-10 whitespace-nowrap shadow-md">
                    {d.label}: {d.value}h
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-[10px] text-zinc-500 mt-2 font-mono">
            <span>{sleepData[0]?.label}</span>
            <span>{sleepData[Math.floor(sleepData.length / 2)]?.label}</span>
            <span>{sleepData[sleepData.length - 1]?.label}</span>
          </div>
        </div>

        {/* Chart 3: Workout Split Breakdown */}
        <div className="p-5 rounded-2xl bg-[#0b0f19] border border-white/[0.08] shadow-lg">
          <div className="flex items-center justify-between mb-4 font-mono">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400">
                <Dumbbell className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase">Workout Distribution</h4>
                <span className="text-[10px] text-zinc-500">Training Split Volume</span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-orange-400">
              {strengthCount + cardioCount + bothCount} Active Sessions
            </span>
          </div>

          {/* Segmented bar */}
          <div className="h-5 w-full rounded-lg bg-zinc-800 overflow-hidden flex my-3.5 border border-white/[0.04]">
            <div
              className="bg-orange-500 h-full transition-all"
              style={{ width: `${(strengthCount / totalWorkoutLogs) * 100}%` }}
              title={`Strength: ${strengthCount} days`}
            />
            <div
              className="bg-amber-500 h-full transition-all"
              style={{ width: `${(cardioCount / totalWorkoutLogs) * 100}%` }}
              title={`Cardio: ${cardioCount} days`}
            />
            <div
              className="bg-purple-500 h-full transition-all"
              style={{ width: `${(bothCount / totalWorkoutLogs) * 100}%` }}
              title={`Both: ${bothCount} days`}
            />
            <div
              className="bg-emerald-500 h-full transition-all"
              style={{ width: `${(restCount / totalWorkoutLogs) * 100}%` }}
              title={`Rest Days: ${restCount} days`}
            />
          </div>

          {/* Legend Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
            <div className="p-2.5 rounded-xl bg-zinc-900 border border-white/[0.06]">
              <span className="text-[10px] uppercase font-bold text-orange-400 block">Strength</span>
              <span className="text-base font-black text-white">{strengthCount}</span>
              <span className="text-[9px] text-zinc-500 block">days</span>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-900 border border-white/[0.06]">
              <span className="text-[10px] uppercase font-bold text-amber-400 block">Cardio</span>
              <span className="text-base font-black text-white">{cardioCount}</span>
              <span className="text-[9px] text-zinc-500 block">days</span>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-900 border border-white/[0.06]">
              <span className="text-[10px] uppercase font-bold text-purple-400 block">Both</span>
              <span className="text-base font-black text-white">{bothCount}</span>
              <span className="text-[9px] text-zinc-500 block">days</span>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-900 border border-white/[0.06]">
              <span className="text-[10px] uppercase font-bold text-emerald-400 block">Rest</span>
              <span className="text-base font-black text-white">{restCount}</span>
              <span className="text-[9px] text-zinc-500 block">days</span>
            </div>
          </div>
        </div>

        {/* Chart 4: DSA Questions Solved */}
        <div className="p-5 rounded-2xl bg-[#0b0f19] border border-white/[0.08] shadow-lg">
          <div className="flex items-center justify-between mb-4 font-mono">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Code2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase">DSA Problem Volume</h4>
                <span className="text-[10px] text-zinc-500">Daily LeetCode Execution</span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-purple-400">
              Total: {runningDsa} Problems
            </span>
          </div>

          {/* DSA Bars */}
          <div className="h-36 flex items-end gap-1 sm:gap-1.5 pt-6 pb-2 border-b border-white/[0.06]">
            {dsaData.map((d) => {
              const heightPercent = Math.min(100, Math.round((d.daily / maxDsaDaily) * 100));
              return (
                <div key={d.date} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  <div
                    className={`w-full rounded-t-[2px] transition-all duration-300 ${
                      d.daily > 0
                        ? 'bg-purple-500 hover:bg-purple-400 shadow-[0_0_4px_rgba(168,85,247,0.4)]'
                        : 'bg-zinc-800/60'
                    }`}
                    style={{ height: `${Math.max(4, heightPercent)}%` }}
                  />
                  <div className="absolute -top-7 hidden group-hover:flex px-2 py-0.5 rounded bg-zinc-900 border border-white/[0.1] text-white text-[10px] font-mono z-10 whitespace-nowrap shadow-md">
                    {d.label}: {d.daily} Qs
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-[10px] text-zinc-500 mt-2 font-mono">
            <span>{dsaData[0]?.label}</span>
            <span>{dsaData[Math.floor(dsaData.length / 2)]?.label}</span>
            <span>{dsaData[dsaData.length - 1]?.label}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
