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
    <div className="space-y-6 pb-12">
      {/* Before & After Photo Comparison Slider */}
      <BeforeAfterSlider />

      {/* 100-Day Interactive Calendar */}
      <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-white/10 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase mb-1">
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Full Challenge Timeline</span>
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              100-Day Challenge Calendar
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click any date to inspect the daily habits, photo log, or make updates.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-400 ring-2 ring-amber-300" />
              <span className="text-slate-500 dark:text-slate-400">100% Perfect</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-slate-500 dark:text-slate-400">Completed Habits</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700" />
              <span className="text-slate-500 dark:text-slate-400">No Log</span>
            </span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-2.5">
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
                className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between min-h-[92px] group relative ${
                  isPerfect
                    ? 'bg-amber-500/10 border-amber-500/40 shadow-sm hover:border-amber-500'
                    : completion > 0
                    ? 'bg-emerald-500/5 border-emerald-500/30 hover:border-emerald-500'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-indigo-400'
                } ${isToday ? 'ring-2 ring-indigo-500 ring-offset-1 dark:ring-offset-slate-900' : ''} ${
                  isSelected ? 'border-indigo-600 bg-indigo-50/20 dark:bg-indigo-950/30' : ''
                }`}
              >
                {/* Header: Day number + weekday */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black font-mono text-slate-800 dark:text-white">
                    D{dayNum}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    {dayOfWeek}
                  </span>
                </div>

                {/* Date snippet */}
                <span className="text-[10px] text-slate-400">
                  {date.slice(5)}
                </span>

                {/* Status Indicator */}
                <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                  {isPerfect ? (
                    <span className="text-[10px] font-black text-amber-500 flex items-center gap-0.5">
                      <Trophy className="w-3 h-3" />
                      100%
                    </span>
                  ) : completion > 0 ? (
                    <span className="text-[10px] font-bold text-emerald-500">
                      {completion}%
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400">--</span>
                  )}

                  {hasPhoto && (
                    <span title="Photo logged">
                      <Camera className="w-3 h-3 text-pink-500" />
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
          title={`Day ${selectedDayLog.dayNumber} Overview (${selectedDayLog.date})`}
          maxWidth="max-w-lg"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40">
              <div>
                <span className="text-xs text-indigo-500 font-bold block">
                  Completion Level
                </span>
                <span className="text-xl font-black text-slate-900 dark:text-white">
                  {selectedDayLog.completionPercentage}% Complete
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">XP Earned</span>
                <span className="text-xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
                  +{selectedDayLog.xpEarned}
                </span>
              </div>
            </div>

            {/* Photo preview if present */}
            {selectedDayLog.photo?.photoBase64 && (
              <div className="rounded-2xl overflow-hidden aspect-video bg-black max-h-48 border border-slate-200 dark:border-slate-700">
                <img
                  src={selectedDayLog.photo.photoBase64}
                  alt="Daily log"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Habit Checklist summary */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-purple-500 font-bold block">DSA</span>
                <span>{selectedDayLog.dsa.questionsSolved} questions solved</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-orange-500 font-bold block">Workout</span>
                <span>{selectedDayLog.workout.type} ({selectedDayLog.workout.durationMinutes}m)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-cyan-500 font-bold block">Water</span>
                <span>{selectedDayLog.water.intakeLitres}L / {selectedDayLog.water.targetLitres}L</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-indigo-500 font-bold block">Sleep</span>
                <span>{selectedDayLog.sleep.durationHours} hours</span>
              </div>
            </div>

            {selectedDayLog.journal.note && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs italic text-slate-600 dark:text-slate-300">
                "{selectedDayLog.journal.note}"
              </div>
            )}

            <button
              onClick={() => jumpToDayEdit(selectedDayLog.date)}
              className="w-full py-3 px-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Open & Edit Full Day In Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};
