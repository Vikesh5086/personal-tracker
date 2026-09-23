import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Bell, Brain, Code2, Coffee, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

type PomodoroMode = 'work' | 'shortBreak' | 'longBreak';
type FocusCategory = 'DSA' | 'AI/ML' | 'General';

export const PomodoroTimer: React.FC = () => {
  const { currentLog, updateCurrentHabit, fireConfetti } = useApp();

  const [mode, setMode] = useState<PomodoroMode>('work');
  const [category, setCategory] = useState<FocusCategory>('DSA');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);

  const timerRef = useRef<any>(null);

  const DURATIONS: Record<PomodoroMode, number> = {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  };

  // Sound generator using Web Audio API (no external sound file required!)
  const playAlertSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            playAlertSound();

            if (mode === 'work') {
              setCompletedSessions((s) => s + 1);
              fireConfetti();

              // Auto-log 25 mins to category in current day
              if (category === 'AI/ML') {
                updateCurrentHabit((l) => ({
                  ...l,
                  aiMl: {
                    ...l.aiMl,
                    durationMinutes: (l.aiMl.durationMinutes || 0) + 25,
                    completed: true,
                  },
                }));
              }

              // Switch to break
              setMode('shortBreak');
              return DURATIONS.shortBreak;
            } else {
              setMode('work');
              return DURATIONS.work;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, category, fireConfetti, updateCurrentHabit]);

  const switchMode = (newMode: PomodoroMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(DURATIONS[newMode]);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(DURATIONS[mode]);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const totalDuration = DURATIONS[mode];
  const progressPercent = Math.round(((totalDuration - timeLeft) / totalDuration) * 100);

  return (
    <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-white/10 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase mb-1">
            <Brain className="w-3.5 h-3.5" />
            <span>Deep Work Session</span>
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            Pomodoro Focus Timer
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            25-minute deep focus sprints for DSA and AI/ML study.
          </p>
        </div>

        {/* Focus Category Selector */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          {(['DSA', 'AI/ML', 'General'] as FocusCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                category === cat
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Mode Switches */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => switchMode('work')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
            mode === 'work'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
          }`}
        >
          Focus (25m)
        </button>
        <button
          onClick={() => switchMode('shortBreak')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
            mode === 'shortBreak'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
          }`}
        >
          <Coffee className="w-3.5 h-3.5" />
          Short Break (5m)
        </button>
        <button
          onClick={() => switchMode('longBreak')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
            mode === 'longBreak'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
          }`}
        >
          Long Break (15m)
        </button>
      </div>

      {/* Giant Clock Face */}
      <div className="relative w-48 h-48 mx-auto flex flex-col items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <path
            className="text-slate-200 dark:text-slate-800"
            strokeWidth="2.5"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className="text-purple-600 dark:text-purple-400 transition-all duration-300"
            strokeDasharray={`${progressPercent}, 100`}
            strokeWidth="2.5"
            strokeLinecap="round"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-4xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
            {timeFormatted}
          </span>
          <span className="text-xs uppercase font-extrabold text-purple-600 dark:text-purple-400 mt-1">
            {mode === 'work' ? `${category} Session` : 'Rest & Reset'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`py-3 px-8 rounded-2xl font-bold text-white transition-all shadow-lg flex items-center gap-2 ${
            isRunning
              ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/30'
              : 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/30'
          }`}
        >
          {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
          <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
        </button>

        <button
          onClick={resetTimer}
          className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          title="Reset timer"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      <div className="text-center text-xs text-slate-400">
        Completed today: <span className="font-bold text-purple-500">{completedSessions} focus session{completedSessions === 1 ? '' : 's'}</span> ({(completedSessions * 25) / 60} hours)
      </div>
    </div>
  );
};
