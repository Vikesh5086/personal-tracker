import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { DailyLog } from '../../types';
import { Flame, Trophy, Calendar, Sparkles, CheckCircle2, ChevronRight, BarChart3, Clock } from 'lucide-react';

type HeatmapMode = 'daily' | 'weekly' | 'cumulative';

interface DayCell {
  date: string;
  dayNum: number;
  dayOfWeek: number; // 0 = Sun, 6 = Sat
  isChallengeDay: boolean;
  isToday: boolean;
  isPast: boolean;
  log?: DailyLog;
  completion: number;
  isPerfect: boolean;
  xp: number;
  completedHabitsList: string[];
}

export const HeatmapGrid: React.FC = () => {
  const { profile, allLogs, setCurrentDate, setActiveTab, todayDate, gamification } = useApp();
  const [mode, setMode] = useState<HeatmapMode>('daily');
  const [hoveredDay, setHoveredDay] = useState<DayCell | null>(null);

  if (!profile) return null;

  // Build quick map of date -> DailyLog
  const logsMap = useMemo(() => {
    const map = new Map<string, DailyLog>();
    allLogs.forEach((l) => map.set(l.date, l));
    return map;
  }, [allLogs]);

  // Extract human-readable completed habits list from a DailyLog
  const getCompletedHabitsList = (log?: DailyLog): string[] => {
    if (!log) return [];
    const list: string[] = [];
    if (log.workout?.type && log.workout.type !== 'None') {
      list.push(`Workout (${log.workout.type})`);
    }
    if (log.dsa?.questionsSolved && log.dsa.questionsSolved > 0) {
      list.push(`DSA (${log.dsa.questionsSolved} solved)`);
    }
    if (log.water?.intakeLitres && log.water.intakeLitres > 0) {
      list.push(`Water (${log.water.intakeLitres}L)`);
    }
    if (log.sleep?.completed) {
      list.push(`Sleep (${log.sleep.durationHours || 8}h)`);
    }
    if (log.eating?.type && log.eating.type !== 'None') {
      list.push(`Nutrition (${log.eating.type})`);
    }
    if (log.aiMl?.topic && log.aiMl.topic.trim().length > 0) {
      list.push(`AI/ML (${log.aiMl.topic.slice(0, 18)}...)`);
    }
    if (log.photo?.photoBase64 && log.photo.photoBase64.length > 0) {
      list.push('Photo Logged');
    }
    if (log.journal?.note && log.journal.note.trim().length > 0) {
      list.push('Journal Reflection');
    }
    if (log.priorities?.items?.some((p) => p.done && p.text.trim().length > 0)) {
      list.push('Top Priorities Done');
    }
    if (log.learnedNewThing?.learnedSomething || (log.learnedNewThing?.takeaway && log.learnedNewThing.takeaway.trim().length > 0)) {
      list.push('Insight Learned');
    }
    return list;
  };

  // Build the 100 challenge days data array
  const { weeksData, monthLabels, allChallengeDays, weeklySummaries } = useMemo(() => {
    const startParts = profile.startDate.split('-').map(Number);
    const startYear = startParts[0];
    const startMonth = startParts[1] - 1;
    const startDay = startParts[2];
    const start = new Date(startYear, startMonth, startDay);

    // Collect all 100 days
    const challengeDaysMap = new Map<string, { dayNum: number; dateStr: string }>();
    const challengeDaysList: DayCell[] = [];

    let runningXP = 0;
    let runningHabits = 0;

    for (let i = 0; i < 100; i++) {
      const cur = new Date(startYear, startMonth, startDay + i);
      const dateStr = cur.toISOString().split('T')[0];
      const log = logsMap.get(dateStr);
      const completion = log?.completionPercentage || 0;
      const isPerfect = Boolean(log?.isPerfectDay);
      const xp = log?.xpEarned || 0;
      runningXP += xp;
      const habitsList = getCompletedHabitsList(log);
      runningHabits += habitsList.length;

      const cell: DayCell = {
        date: dateStr,
        dayNum: i + 1,
        dayOfWeek: cur.getDay(),
        isChallengeDay: true,
        isToday: dateStr === todayDate,
        isPast: dateStr <= todayDate,
        log,
        completion,
        isPerfect,
        xp,
        completedHabitsList: habitsList,
      };

      challengeDaysMap.set(dateStr, { dayNum: i + 1, dateStr });
      challengeDaysList.push(cell);
    }

    // Determine calendar bounds for GitHub grid (Sunday on or before day 1 -> Saturday on or after day 100)
    const firstSunday = new Date(start);
    firstSunday.setDate(firstSunday.getDate() - start.getDay());

    const day100 = new Date(startYear, startMonth, startDay + 99);
    const lastSaturday = new Date(day100);
    lastSaturday.setDate(lastSaturday.getDate() + (6 - day100.getDay()));

    const totalCalendarDays = Math.round((lastSaturday.getTime() - firstSunday.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const numWeeks = Math.ceil(totalCalendarDays / 7);

    const weeks: (DayCell | null)[][] = [];
    const months: { label: string; weekIndex: number }[] = [];
    let lastSeenMonth = -1;

    for (let w = 0; w < numWeeks; w++) {
      const currentWeek: (DayCell | null)[] = [];
      for (let d = 0; d < 7; d++) {
        const curDate = new Date(firstSunday);
        curDate.setDate(curDate.getDate() + w * 7 + d);
        const dateStr = curDate.toISOString().split('T')[0];

        // Track month label on first occurrence in a week
        if (d === 0 || curDate.getDate() === 1) {
          const m = curDate.getMonth();
          if (m !== lastSeenMonth) {
            months.push({
              label: curDate.toLocaleDateString('en-US', { month: 'short' }),
              weekIndex: w,
            });
            lastSeenMonth = m;
          }
        }

        const match = challengeDaysMap.get(dateStr);
        if (match) {
          const cell = challengeDaysList[match.dayNum - 1];
          currentWeek.push(cell);
        } else {
          currentWeek.push(null); // Outside 100-day window
        }
      }
      weeks.push(currentWeek);
    }

    // Build Weekly Summaries (15 weeks of the 100-day challenge)
    const weekCount = Math.ceil(100 / 7);
    const summaries: {
      weekNum: number;
      startDate: string;
      endDate: string;
      avgCompletion: number;
      perfectDaysCount: number;
      daysLogged: number;
      totalXp: number;
      habitsCount: number;
    }[] = [];

    for (let wk = 0; wk < weekCount; wk++) {
      const slice = challengeDaysList.slice(wk * 7, Math.min(100, (wk + 1) * 7));
      const daysCount = slice.length;
      let totalComp = 0;
      let perfects = 0;
      let logged = 0;
      let xpSum = 0;
      let habitsSum = 0;

      slice.forEach((s) => {
        if (s.log && s.completion > 0) {
          logged++;
          totalComp += s.completion;
          if (s.isPerfect) perfects++;
          xpSum += s.xp;
          habitsSum += s.completedHabitsList.length;
        }
      });

      summaries.push({
        weekNum: wk + 1,
        startDate: slice[0]?.date || '',
        endDate: slice[slice.length - 1]?.date || '',
        avgCompletion: daysCount > 0 ? Math.round(totalComp / daysCount) : 0,
        perfectDaysCount: perfects,
        daysLogged: logged,
        totalXp: xpSum,
        habitsCount: habitsSum,
      });
    }

    return {
      weeksData: weeks,
      monthLabels: months,
      allChallengeDays: challengeDaysList,
      weeklySummaries: summaries,
    };
  }, [profile.startDate, logsMap, todayDate]);

  // Color Intensity Calculator (Using CSS primary-accent variable)
  const getCellIntensityStyle = (
    cell: DayCell | null,
    viewMode: HeatmapMode,
    cellIndex: number,
    totalCells: number
  ): { bg: string; border?: string; glow?: string } => {
    if (!cell) {
      return { bg: 'transparent' };
    }

    if (viewMode === 'cumulative') {
      // Cumulative intensity: builds up proportional to day index and past logged activity
      const isPast = cell.date <= todayDate;
      if (!isPast) {
        return { bg: 'rgba(255, 255, 255, 0.03)', border: '1px dashed rgba(255, 255, 255, 0.08)' };
      }
      const intensity = Math.min(1, Math.max(0.15, (cellIndex + 1) / totalCells));
      return {
        bg: `rgba(var(--primary-accent-rgb), ${intensity.toFixed(2)})`,
        border: '1px solid rgba(var(--primary-accent-rgb), 0.4)',
      };
    }

    // Daily mode intensity
    const completion = cell.completion;
    const isPast = cell.date <= todayDate;

    if (cell.isPerfect) {
      return {
        bg: 'var(--primary-accent)',
        border: '1px solid #ffffff',
        glow: '0 0 10px rgba(var(--primary-accent-rgb), 0.75), inset 0 0 4px rgba(255, 255, 255, 0.5)',
      };
    }

    if (completion >= 70) {
      return {
        bg: 'rgba(var(--primary-accent-rgb), 0.85)',
        border: '1px solid rgba(var(--primary-accent-rgb), 0.9)',
      };
    }

    if (completion >= 40) {
      return {
        bg: 'rgba(var(--primary-accent-rgb), 0.55)',
        border: '1px solid rgba(var(--primary-accent-rgb), 0.6)',
      };
    }

    if (completion > 0) {
      return {
        bg: 'rgba(var(--primary-accent-rgb), 0.28)',
        border: '1px solid rgba(var(--primary-accent-rgb), 0.35)',
      };
    }

    // 0% completion
    if (isPast) {
      return {
        bg: 'rgba(255, 255, 255, 0.06)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      };
    }

    // Future day
    return {
      bg: 'rgba(255, 255, 255, 0.02)',
      border: '1px dashed rgba(255, 255, 255, 0.05)',
    };
  };

  const handleCellSelect = (dateStr: string) => {
    setCurrentDate(dateStr);
    setActiveTab('dashboard');
  };

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="rounded-2xl bg-[#0b0f19] border border-white/[0.08] shadow-2xl p-5 sm:p-7 relative overflow-hidden text-slate-100">
      {/* Subtle background hairline glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_top_right,rgba(var(--primary-accent-rgb),0.06),transparent_60%)] pointer-events-none" />

      {/* Centerpiece Header with Mission Telemetry & Mode Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.06] mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-zinc-400 bg-white/[0.05] border border-white/[0.08] px-2.5 py-0.5 rounded-md">
              PROTOCOL // STREAK ENGINE
            </span>
            <span className="font-mono text-[11px] text-zinc-500">
              100-Day GitHub Matrix
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <span>Discipline Contribution Heatmap</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Every square records daily habit execution. Brighter squares signify deep focus; saturated squares mark 100% perfect days.
          </p>
        </div>

        {/* View Mode Toggle Tabs (Daily / Weekly / Cumulative) */}
        <div className="inline-flex items-center p-1 rounded-xl bg-zinc-900/90 border border-white/[0.08] self-start sm:self-auto shrink-0 shadow-inner">
          <button
            type="button"
            onClick={() => setMode('daily')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              mode === 'daily'
                ? 'bg-zinc-100 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            Daily
          </button>
          <button
            type="button"
            onClick={() => setMode('weekly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              mode === 'weekly'
                ? 'bg-zinc-100 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            Weekly
          </button>
          <button
            type="button"
            onClick={() => setMode('cumulative')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              mode === 'cumulative'
                ? 'bg-zinc-100 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            Cumulative
          </button>
        </div>
      </div>

      {/* MODE 1: DAILY GITHUB MATRIX */}
      {mode === 'daily' && (
        <div className="space-y-4">
          <div className="overflow-x-auto pb-3 pt-1 scrollbar-thin">
            <div className="inline-block min-w-full">
              {/* Month Header Axis */}
              <div className="flex text-[10px] font-mono text-zinc-400 mb-2 pl-9 select-none">
                {weeksData.map((_, wIdx) => {
                  const mLabel = monthLabels.find((m) => m.weekIndex === wIdx);
                  return (
                    <div key={`m-${wIdx}`} className="w-[18px] sm:w-[22px] shrink-0 text-left">
                      {mLabel ? mLabel.label : ''}
                    </div>
                  );
                })}
              </div>

              {/* Grid: 7 Rows (Sun-Sat) x N Columns (Weeks) */}
              <div className="flex gap-2">
                {/* Left Y-Axis Weekday Labels (Mon, Wed, Fri like GitHub) */}
                <div className="flex flex-col justify-between py-[2px] text-[9px] font-mono font-semibold text-zinc-500 w-7 shrink-0 select-none">
                  <span className="h-[14px] sm:h-[18px] leading-[14px] sm:leading-[18px]"></span>
                  <span className="h-[14px] sm:h-[18px] leading-[14px] sm:leading-[18px]">Mon</span>
                  <span className="h-[14px] sm:h-[18px] leading-[14px] sm:leading-[18px]"></span>
                  <span className="h-[14px] sm:h-[18px] leading-[14px] sm:leading-[18px]">Wed</span>
                  <span className="h-[14px] sm:h-[18px] leading-[14px] sm:leading-[18px]"></span>
                  <span className="h-[14px] sm:h-[18px] leading-[14px] sm:leading-[18px]">Fri</span>
                  <span className="h-[14px] sm:h-[18px] leading-[14px] sm:leading-[18px]"></span>
                </div>

                {/* Heatmap Column Blocks */}
                <div className="flex gap-[3px] sm:gap-1">
                  {weeksData.map((week, wIdx) => (
                    <div key={`week-${wIdx}`} className="flex flex-col gap-[3px] sm:gap-1">
                      {week.map((cell, dIdx) => {
                        if (!cell) {
                          return (
                            <div
                              key={`empty-${wIdx}-${dIdx}`}
                              className="w-[14px] h-[14px] sm:w-[18px] sm:h-[18px] rounded-[3px] opacity-0"
                            />
                          );
                        }

                        const styleObj = getCellIntensityStyle(cell, 'daily', cell.dayNum - 1, 100);

                        return (
                          <button
                            key={cell.date}
                            type="button"
                            onClick={() => handleCellSelect(cell.date)}
                            onMouseEnter={() => setHoveredDay(cell)}
                            className={`w-[14px] h-[14px] sm:w-[18px] sm:h-[18px] rounded-[3px] transition-all relative group cursor-pointer hover:scale-125 hover:z-20 ${
                              cell.isToday
                                ? 'ring-2 ring-white ring-offset-1 ring-offset-[#0b0f19]'
                                : ''
                            }`}
                            style={{
                              backgroundColor: styleObj.bg,
                              border: styleObj.border,
                              boxShadow: styleObj.glow,
                            }}
                            title={`Day ${cell.dayNum} (${cell.date}): ${cell.completion}%`}
                          >
                            <span className="sr-only">Day {cell.dayNum}</span>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: WEEKLY AGGREGATED VIEW */}
      {mode === 'weekly' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {weeklySummaries.map((w) => {
              const intensity = Math.min(1, Math.max(0.12, w.avgCompletion / 100));
              const isPerfectWeek = w.avgCompletion === 100;

              return (
                <div
                  key={`wk-card-${w.weekNum}`}
                  className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between gap-3 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-zinc-300">
                      WEEK {String(w.weekNum).padStart(2, '0')}
                    </span>
                    <div
                      className="w-3.5 h-3.5 rounded-sm"
                      style={{
                        backgroundColor: isPerfectWeek
                          ? 'var(--primary-accent)'
                          : `rgba(var(--primary-accent-rgb), ${intensity})`,
                        boxShadow: isPerfectWeek ? '0 0 8px rgba(var(--primary-accent-rgb), 0.8)' : undefined,
                      }}
                    />
                  </div>

                  <div>
                    <div className="text-xl font-black font-mono text-white">
                      {w.avgCompletion}%
                    </div>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      {w.daysLogged}/7 Days Logged
                    </span>
                  </div>

                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-zinc-500">
                    <span>{w.perfectDaysCount} Perfect Days</span>
                    <span>+{w.totalXp} XP</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODE 3: CUMULATIVE INTENSITY BUILDUP */}
      {mode === 'cumulative' && (
        <div className="space-y-4">
          <p className="text-xs text-zinc-400">
            Cumulative volume visualization: as you progress day-by-day across the 100-day timeline, intensity expands as your aggregate volume of completed reps and discipline compounds.
          </p>
          <div className="overflow-x-auto pb-3 pt-1 scrollbar-thin">
            <div className="inline-block min-w-full">
              <div className="flex gap-[3px] sm:gap-1">
                {weeksData.map((week, wIdx) => (
                  <div key={`cum-week-${wIdx}`} className="flex flex-col gap-[3px] sm:gap-1">
                    {week.map((cell, dIdx) => {
                      if (!cell) {
                        return (
                          <div
                            key={`cum-empty-${wIdx}-${dIdx}`}
                            className="w-[14px] h-[14px] sm:w-[18px] sm:h-[18px] rounded-[3px] opacity-0"
                          />
                        );
                      }

                      const styleObj = getCellIntensityStyle(cell, 'cumulative', cell.dayNum - 1, 100);

                      return (
                        <button
                          key={`cum-${cell.date}`}
                          type="button"
                          onClick={() => handleCellSelect(cell.date)}
                          onMouseEnter={() => setHoveredDay(cell)}
                          className={`w-[14px] h-[14px] sm:w-[18px] sm:h-[18px] rounded-[3px] transition-all relative group cursor-pointer hover:scale-125 hover:z-20 ${
                            cell.isToday ? 'ring-2 ring-white ring-offset-1 ring-offset-[#0b0f19]' : ''
                          }`}
                          style={{
                            backgroundColor: styleObj.bg,
                            border: styleObj.border,
                          }}
                          title={`Day ${cell.dayNum}: Cumulative Progress`}
                        >
                          <span className="sr-only">Day {cell.dayNum}</span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INTERACTIVE INSPECT DOCK & LEGEND */}
      <div className="mt-6 pt-5 border-t border-white/[0.06] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Dynamic Tooltip / Inspect Details */}
        <div className="min-h-[44px] flex-1">
          {hoveredDay ? (
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs">
              <span className="font-mono font-bold text-white bg-white/[0.08] px-2.5 py-1 rounded-md border border-white/[0.1]">
                DAY {String(hoveredDay.dayNum).padStart(3, '0')} // {hoveredDay.date}
              </span>

              <span className="font-mono font-bold" style={{ color: 'var(--primary-accent)' }}>
                {hoveredDay.completion}% Completed
              </span>

              {hoveredDay.isPerfect && (
                <span className="px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase bg-amber-400 text-zinc-950 font-mono shadow-sm">
                  100% PERFECT DAY
                </span>
              )}

              <span className="font-mono text-zinc-400 text-[11px]">
                +{hoveredDay.xp} XP
              </span>

              {hoveredDay.completedHabitsList.length > 0 ? (
                <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-zinc-300">
                  <span className="text-zinc-500 font-mono">• Logged:</span>
                  {hoveredDay.completedHabitsList.slice(0, 4).map((h, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-300 font-medium text-[10px]"
                    >
                      {h}
                    </span>
                  ))}
                  {hoveredDay.completedHabitsList.length > 4 && (
                    <span className="text-zinc-500 text-[10px]">
                      +{hoveredDay.completedHabitsList.length - 4} more
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-zinc-500 italic text-[11px]">
                  {hoveredDay.isPast ? 'No habits logged for this day.' : 'Upcoming challenge day.'}
                </span>
              )}

              <button
                type="button"
                onClick={() => handleCellSelect(hoveredDay.date)}
                className="ml-auto text-[11px] font-mono text-zinc-300 hover:text-white flex items-center gap-1 underline underline-offset-4"
              >
                <span>Edit Day {hoveredDay.dayNum}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span>Hover or tap any square to inspect details • Click to jump directly to that day's log.</span>
            </div>
          )}
        </div>

        {/* GitHub Legend */}
        <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 shrink-0 select-none">
          <span>Less</span>
          {/* Level 0 */}
          <div
            className="w-3 h-3 rounded-sm border border-white/[0.08]"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.06)' }}
            title="0% Complete"
          />
          {/* Level 1 */}
          <div
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: 'rgba(var(--primary-accent-rgb), 0.28)' }}
            title="1-39% Complete"
          />
          {/* Level 2 */}
          <div
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: 'rgba(var(--primary-accent-rgb), 0.55)' }}
            title="40-69% Complete"
          />
          {/* Level 3 */}
          <div
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: 'rgba(var(--primary-accent-rgb), 0.85)' }}
            title="70-99% Complete"
          />
          {/* Level 4 */}
          <div
            className="w-3 h-3 rounded-sm"
            style={{
              backgroundColor: 'var(--primary-accent)',
              boxShadow: '0 0 6px rgba(var(--primary-accent-rgb), 0.75)',
            }}
            title="100% Perfect Day"
          />
          <span>More (100%)</span>
        </div>
      </div>
    </div>
  );
};
