import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Flame,
  CheckCircle2,
  Trophy,
  Camera,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DailyLog } from '../../types';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { Modal } from '../common/Modal';

export const CalendarView: React.FC = () => {
  const { profile, allLogs, currentDate, setCurrentDate, setActiveTab, todayDate } = useApp();
  const [selectedDayLog, setSelectedDayLog] = useState<DailyLog | null>(null);

  if (!profile) return null;

  const logsMap = new Map<string, DailyLog>();
  allLogs.forEach((l) => logsMap.set(l.date, l));

  // Build array of 100 days
  const startDate = new Date(profile.startDate + 'T00:00:00');
  const challengeDays: {
    date: string;
    dayNum: number;
    log?: DailyLog;
    dayOfWeek: string;
  }[] = [];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 0; i < 100; i++) {
    const cur = new Date(startDate);
    cur.setDate(cur.getDate() + i);
    const dateStr = cur.toISOString().split('T')[0];
    challengeDays.push({
      date: dateStr,
      dayNum: i + 1,
      log: logsMap.get(dateStr),
      dayOfWeek: dayNames[cur.getDay()],
    });
  }

  const handleSelectDate = (dateStr: string) => {
    setCurrentDate(dateStr);
    const log = logsMap.get(dateStr);
    if (log) {
      setSelectedDayLog(log);
    } else {
      setActiveTab('dashboard');
    }
  };

  const jumpToDayEdit = (dateStr: string) => {
    setCurrentDate(dateStr);
    setSelectedDayLog(null);
    setActiveTab('dashboard');
  };

  return (
    <div className="space-y-6 pb-12 text-slate-100">
      {/* Before & After Photo Comparison Slider */}
      <BeforeAfterSlider />

      {/* 100-Day Interactive Calendar */}
      <div className="rounded-2xl bg-[#0b0f19] border border-white/[0.08] shadow-xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-white/[0.06]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-400 bg-white/[0.05] border border-white/[0.08] px-2 py-0.5 rounded">
                PROTOCOL // TIMELINE
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black tracking-tight text-white font-mono uppercase">
              100-Day Challenge Day Ledger
            </h3>
            <p className="text-xs text-zinc-400">
              Select any day to inspect logged habits, reflection notes, photo entries, or edit records.
            </p>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-400 shadow-[0_0_4px_rgba(251,191,36,0.5)]" />
              <span>Perfect Day</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
              <span>Logged</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-zinc-800" />
              <span>Unlogged</span>
            </span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-2 font-mono">
          {challengeDays.map(({ date, dayNum, log, dayOfWeek }) => {
            const isToday = date === todayDate;
            const isSelected = date === currentDate;
            const completion = log?.completionPercentage || 0;
            const isPerfect = Boolean(log?.isPerfectDay);
            const hasPhoto = Boolean(log?.photo?.photoBase64);

            return (
              <div
                key={date}
                onClick={() => handleSelectDate(date)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between min-h-[86px] group relative ${
                  isPerfect
                    ? 'bg-amber-400/10 border-amber-400/40 hover:border-amber-400'
                    : completion > 0
                    ? 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-400'
                    : 'bg-zinc-900/60 border-white/[0.06] hover:border-white/20'
                } ${isToday ? 'ring-2 ring-white ring-offset-1 ring-offset-[#0b0f19]' : ''} ${
                  isSelected ? 'border-white bg-zinc-800/80 shadow-md' : ''
                }`}
              >
                {/* Header: Day number + weekday */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-white">
                    D{String(dayNum).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-medium">
                    {dayOfWeek}
                  </span>
                </div>

                {/* Date snippet */}
                <span className="text-[10px] text-zinc-400">
                  {date.slice(5)}
                </span>

                {/* Status Indicator */}
                <div className="flex items-center justify-between mt-1 pt-1 border-t border-white/[0.06]">
                  {isPerfect ? (
                    <span className="text-[10px] font-black text-amber-400 flex items-center gap-0.5">
                      <Trophy className="w-3 h-3 fill-amber-400" />
                      100%
                    </span>
                  ) : completion > 0 ? (
                    <span className="text-[10px] font-bold text-emerald-400">
                      {completion}%
                    </span>
                  ) : (
                    <span className="text-[10px] text-zinc-600">--</span>
                  )}

                  {hasPhoto && (
                    <span title="Photo logged">
                      <Camera className="w-3 h-3 text-pink-400" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Date Inspection Modal */}
      {selectedDayLog && (
        <Modal
          isOpen={Boolean(selectedDayLog)}
          onClose={() => setSelectedDayLog(null)}
          title={`DAY ${selectedDayLog.dayNumber} // ${selectedDayLog.date}`}
          maxWidth="max-w-lg"
        >
          <div className="space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900 border border-white/[0.08]">
              <div>
                <span className="text-[10px] text-zinc-400 uppercase font-bold block">
                  Execution Level
                </span>
                <span className="text-xl font-black text-white">
                  {selectedDayLog.completionPercentage}% Complete
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-zinc-400 uppercase block">XP Awarded</span>
                <span className="text-xl font-black text-amber-400">
                  +{selectedDayLog.xpEarned}
                </span>
              </div>
            </div>

            {/* Photo preview if present */}
            {selectedDayLog.photo?.photoBase64 && (
              <div className="rounded-xl overflow-hidden aspect-video bg-black max-h-48 border border-white/[0.1]">
                <img
                  src={selectedDayLog.photo.photoBase64}
                  alt="Daily log"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Habit Checklist summary */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-zinc-900 border border-white/[0.06]">
                <span className="text-purple-400 font-bold block text-[10px] uppercase">DSA Practice</span>
                <span className="text-white">{selectedDayLog.dsa.questionsSolved} questions solved</span>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-900 border border-white/[0.06]">
                <span className="text-orange-400 font-bold block text-[10px] uppercase">Workout</span>
                <span className="text-white">{selectedDayLog.workout.type} ({selectedDayLog.workout.durationMinutes}m)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-900 border border-white/[0.06]">
                <span className="text-cyan-400 font-bold block text-[10px] uppercase">Hydration</span>
                <span className="text-white">{selectedDayLog.water.intakeLitres}L / {selectedDayLog.water.targetLitres}L</span>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-900 border border-white/[0.06]">
                <span className="text-indigo-400 font-bold block text-[10px] uppercase">Sleep</span>
                <span className="text-white">{selectedDayLog.sleep.durationHours} hours</span>
              </div>
            </div>

            {selectedDayLog.journal.note && (
              <div className="p-3 rounded-xl bg-zinc-900 border border-white/[0.06] text-xs italic text-zinc-300 font-sans">
                "{selectedDayLog.journal.note}"
              </div>
            )}

            <button
              type="button"
              onClick={() => jumpToDayEdit(selectedDayLog.date)}
              className="w-full py-3 px-4 rounded-xl font-bold font-mono text-zinc-950 bg-white hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <span>EDIT DAY {selectedDayLog.dayNumber} IN DAILY LOG</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};
