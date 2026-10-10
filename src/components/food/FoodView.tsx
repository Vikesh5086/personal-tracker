import React, { useState, useEffect, useMemo } from 'react';
import {
  Utensils,
  ChevronLeft,
  ChevronRight,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Target,
  Edit2,
  Check,
  X,
  RotateCcw,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { sounds } from '../../services/sound';
import { FoodReports } from './FoodReports';

export const FoodView: React.FC = () => {
  const {
    profile,
    saveUserProfile,
    currentDate,
    setCurrentDate,
    todayDate,
    currentDayNumber,
    currentLog,
    updateCurrentHabit,
    allLogs,
  } = useApp();

  const dailyTarget = profile?.dailyCalorieTarget || 2200;

  // Editing state for daily calorie target
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [targetInput, setTargetInput] = useState<string>(String(dailyTarget));

  useEffect(() => {
    setTargetInput(String(dailyTarget));
  }, [dailyTarget]);

  const handleSaveTarget = async (newVal?: number) => {
    sounds.playCheck();
    const val = newVal !== undefined ? newVal : parseInt(targetInput, 10);
    if (!isNaN(val) && val > 0 && profile) {
      await saveUserProfile({
        ...profile,
        dailyCalorieTarget: val,
      });
      setIsEditingTarget(false);
    }
  };

  // Safe meal numbers from currentLog
  const eating = currentLog?.eating || {
    completed: false,
    breakfastCalories: 0,
    lunchCalories: 0,
    dinnerCalories: 0,
    snacksCalories: 0,
    totalCalories: 0,
    ateJunkFood: null,
    junkFoodLogged: false,
  };

  const breakfast = eating.breakfastCalories || 0;
  const lunch = eating.lunchCalories || 0;
  const dinner = eating.dinnerCalories || 0;
  const snacks = eating.snacksCalories || 0;
  const totalCalories = breakfast + lunch + dinner + snacks;

  const isCompleted = Boolean(
    (breakfast > 0 || lunch > 0 || dinner > 0 || snacks > 0 || (eating.totalCalories && eating.totalCalories > 0)) ||
    typeof eating.ateJunkFood === 'boolean' ||
    eating.junkFoodLogged ||
    (eating.type && eating.type !== 'None' && eating.completed !== false)
  );

  // Calorie variance
  const variance = totalCalories - dailyTarget;
  const isOverTarget = variance > 0;
  const percentOfTarget = dailyTarget > 0 ? Math.round((totalCalories / dailyTarget) * 100) : 0;

  // Navigation handlers
  const handleShiftDate = (offset: number) => {
    sounds.playTap();
    const d = new Date(currentDate + 'T00:00:00');
    d.setDate(d.getDate() + offset);
    setCurrentDate(d.toISOString().split('T')[0]);
  };

  const handleJumpToday = () => {
    sounds.playTap();
    setCurrentDate(todayDate);
  };

  // Real-time Meal Update
  const updateMealCalorie = (
    meal: 'breakfastCalories' | 'lunchCalories' | 'dinnerCalories' | 'snacksCalories',
    value: number
  ) => {
    const safeVal = Math.max(0, isNaN(value) ? 0 : value);
    const updatedBreakfast = meal === 'breakfastCalories' ? safeVal : breakfast;
    const updatedLunch = meal === 'lunchCalories' ? safeVal : lunch;
    const updatedDinner = meal === 'dinnerCalories' ? safeVal : dinner;
    const updatedSnacks = meal === 'snacksCalories' ? safeVal : snacks;
    const nextTotal = updatedBreakfast + updatedLunch + updatedDinner + updatedSnacks;

    const hasAnyCalories = nextTotal > 0;
    const hasJunkLogged = typeof eating.ateJunkFood === 'boolean';
    const isNowDone = hasAnyCalories || hasJunkLogged;

    updateCurrentHabit((prev) => ({
      ...prev,
      eating: {
        ...prev.eating,
        [meal]: safeVal,
        totalCalories: nextTotal,
        completed: isNowDone,
      },
    }));
  };

  // Real-time Junk Food Update
  const setJunkFoodStatus = (ateJunk: boolean) => {
    sounds.playCheck();
    const hasAnyCalories = totalCalories > 0;
    const isNowDone = true; // Setting junk food toggle explicitly fulfills completion criteria

    updateCurrentHabit((prev) => ({
      ...prev,
      eating: {
        ...prev.eating,
        ateJunkFood: ateJunk,
        junkFoodLogged: true,
        completed: isNowDone,
      },
    }));
  };

  const resetJunkFoodStatus = () => {
    sounds.playTap();
    const hasAnyCalories = totalCalories > 0;
    updateCurrentHabit((prev) => ({
      ...prev,
      eating: {
        ...prev.eating,
        ateJunkFood: null,
        junkFoodLogged: false,
        completed: hasAnyCalories,
      },
    }));
  };

  const clearAllMealsForDay = () => {
    sounds.playTap();
    const hasJunkLogged = typeof eating.ateJunkFood === 'boolean';
    updateCurrentHabit((prev) => ({
      ...prev,
      eating: {
        ...prev.eating,
        breakfastCalories: 0,
        lunchCalories: 0,
        dinnerCalories: 0,
        snacksCalories: 0,
        totalCalories: 0,
        type: 'None',
        completed: hasJunkLogged,
      },
    }));
  };

  return (
    <div className="space-y-6 pb-12 font-sans text-slate-100">
      {/* 1. PROTOCOL HEADER & DATE NAVIGATION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-[#0b0f19] border border-white/[0.08] shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                FOOD PROTOCOL // DAY {String(currentDayNumber).padStart(3, '0')}
              </span>
              <span className="text-xs text-zinc-500 font-mono">
                {currentDate}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-mono uppercase mt-0.5">
              Nutrition & Calorie Command
            </h2>
          </div>
        </div>

        {/* Date Switcher */}
        <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-xs">
          <button
            type="button"
            onClick={() => handleShiftDate(-1)}
            className="px-2.5 py-1.5 rounded-xl bg-zinc-900 border border-white/[0.08] text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev</span>
          </button>

          {currentDate !== todayDate && (
            <button
              type="button"
              onClick={handleJumpToday}
              className="px-2.5 py-1.5 rounded-xl bg-white text-zinc-950 font-bold hover:bg-zinc-200 transition-all text-[11px]"
            >
              Today
            </button>
          )}

          <button
            type="button"
            onClick={() => handleShiftDate(1)}
            className="px-2.5 py-1.5 rounded-xl bg-zinc-900 border border-white/[0.08] text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors flex items-center gap-1"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. ONE-TIME / EDITABLE DAILY CALORIE TARGET SETUP */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0b0f19] border border-white/[0.08] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-zinc-400">
                Operating Target
              </span>
              <span className="text-[10px] text-zinc-500">
                (Saves to profile, editable anytime)
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xl sm:text-2xl font-black text-white">
                {dailyTarget} <span className="text-xs font-normal text-zinc-400">kcal / day</span>
              </span>
              {!isEditingTarget && (
                <button
                  type="button"
                  onClick={() => setIsEditingTarget(true)}
                  className="p-1.5 rounded-lg bg-zinc-900 border border-white/[0.08] text-zinc-400 hover:text-white transition-colors"
                  title="Edit Daily Target"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Target Editor Controls */}
        {isEditingTarget ? (
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="number"
              min="1000"
              max="6000"
              step="50"
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              className="w-28 px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/20 text-white font-mono font-bold text-sm focus:outline-none focus:border-cyan-400"
              placeholder="kcal"
              autoFocus
            />
            <button
              type="button"
              onClick={() => handleSaveTarget()}
              className="px-3 py-1.5 rounded-xl bg-cyan-500 text-zinc-950 font-bold hover:bg-cyan-400 transition-colors flex items-center gap-1 text-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
            <button
              type="button"
              onClick={() => setIsEditingTarget(false)}
              className="px-2.5 py-1.5 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white transition-colors text-xs"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          /* Quick Preset Buttons */
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] uppercase font-bold text-zinc-500 mr-1">Presets:</span>
            {[1800, 2000, 2200, 2500].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleSaveTarget(preset)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  dailyTarget === preset
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-zinc-900 border border-white/[0.06] text-zinc-400 hover:text-white'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. DAILY MEAL-WISE CALORIE LOGGING */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0b0f19] border border-white/[0.08] shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
          <div>
            <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold block">
              Daily Intake Ledger
            </span>
            <h3 className="text-base font-bold font-mono text-white flex items-center gap-2">
              <span>Meal-Wise Calorie Inputs</span>
              <span className="text-xs text-zinc-400 font-normal">
                (Type number · Auto-saves immediately)
              </span>
            </h3>
          </div>

          {totalCalories > 0 && (
            <button
              type="button"
              onClick={clearAllMealsForDay}
              className="text-[11px] font-mono text-zinc-400 hover:text-rose-400 flex items-center gap-1 transition-colors self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Today's Meals</span>
            </button>
          )}
        </div>

        {/* Four Fast Meal Number Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
          {/* Breakfast */}
          <div className="p-4 rounded-xl bg-zinc-900/80 border border-white/[0.07] hover:border-amber-400/30 transition-all space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-amber-400">
              <span className="flex items-center gap-1.5">
                <span>🌅</span>
                <span>Breakfast</span>
              </span>
              <span className="text-[10px] text-zinc-500 font-normal">kcal</span>
            </div>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="3000"
                value={breakfast > 0 ? breakfast : ''}
                placeholder="0"
                onChange={(e) => updateMealCalorie('breakfastCalories', parseInt(e.target.value, 10))}
                className="w-full text-2xl font-black text-white bg-zinc-950/70 border border-white/[0.08] rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
            {/* Quick Increment Steppers */}
            <div className="flex items-center gap-1 pt-1">
              {[250, 400, 600].map((step) => (
                <button
                  key={step}
                  type="button"
                  onClick={() => updateMealCalorie('breakfastCalories', step)}
                  className="px-2 py-0.5 text-[10px] rounded bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700"
                >
                  +{step}
                </button>
              ))}
            </div>
          </div>

          {/* Lunch */}
          <div className="p-4 rounded-xl bg-zinc-900/80 border border-white/[0.07] hover:border-emerald-400/30 transition-all space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
              <span className="flex items-center gap-1.5">
                <span>☀️</span>
                <span>Lunch</span>
              </span>
              <span className="text-[10px] text-zinc-500 font-normal">kcal</span>
            </div>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="3000"
                value={lunch > 0 ? lunch : ''}
                placeholder="0"
                onChange={(e) => updateMealCalorie('lunchCalories', parseInt(e.target.value, 10))}
                className="w-full text-2xl font-black text-white bg-zinc-950/70 border border-white/[0.08] rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-400 transition-colors"
              />
            </div>
            <div className="flex items-center gap-1 pt-1">
              {[400, 600, 800].map((step) => (
                <button
                  key={step}
                  type="button"
                  onClick={() => updateMealCalorie('lunchCalories', step)}
                  className="px-2 py-0.5 text-[10px] rounded bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700"
                >
                  +{step}
                </button>
              ))}
            </div>
          </div>

          {/* Dinner */}
          <div className="p-4 rounded-xl bg-zinc-900/80 border border-white/[0.07] hover:border-indigo-400/30 transition-all space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-indigo-400">
              <span className="flex items-center gap-1.5">
                <span>🌙</span>
                <span>Dinner</span>
              </span>
              <span className="text-[10px] text-zinc-500 font-normal">kcal</span>
            </div>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="3000"
                value={dinner > 0 ? dinner : ''}
                placeholder="0"
                onChange={(e) => updateMealCalorie('dinnerCalories', parseInt(e.target.value, 10))}
                className="w-full text-2xl font-black text-white bg-zinc-950/70 border border-white/[0.08] rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-400 transition-colors"
              />
            </div>
            <div className="flex items-center gap-1 pt-1">
              {[400, 600, 800].map((step) => (
                <button
                  key={step}
                  type="button"
                  onClick={() => updateMealCalorie('dinnerCalories', step)}
                  className="px-2 py-0.5 text-[10px] rounded bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700"
                >
                  +{step}
                </button>
              ))}
            </div>
          </div>

          {/* Snacks */}
          <div className="p-4 rounded-xl bg-zinc-900/80 border border-white/[0.07] hover:border-pink-400/30 transition-all space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-pink-400">
              <span className="flex items-center gap-1.5">
                <span>🍎</span>
                <span>Snacks</span>
              </span>
              <span className="text-[10px] text-zinc-500 font-normal">kcal</span>
            </div>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="3000"
                value={snacks > 0 ? snacks : ''}
                placeholder="0"
                onChange={(e) => updateMealCalorie('snacksCalories', parseInt(e.target.value, 10))}
                className="w-full text-2xl font-black text-white bg-zinc-950/70 border border-white/[0.08] rounded-xl px-3 py-2 focus:outline-none focus:border-pink-400 transition-colors"
              />
            </div>
            <div className="flex items-center gap-1 pt-1">
              {[150, 300, 450].map((step) => (
                <button
                  key={step}
                  type="button"
                  onClick={() => updateMealCalorie('snacksCalories', step)}
                  className="px-2 py-0.5 text-[10px] rounded bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700"
                >
                  +{step}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* LIVE AUTO-CALCULATED TOTAL & DEFICIT / SURPLUS TELEMETRY */}
        <div className={`p-4 sm:p-5 rounded-xl border transition-all duration-300 font-mono ${
          totalCalories === 0
            ? 'bg-zinc-900/40 border-white/[0.06]'
            : isOverTarget
            ? 'bg-rose-500/10 border-rose-500/40 shadow-lg shadow-rose-500/5'
            : 'bg-emerald-500/10 border-emerald-500/40 shadow-lg shadow-emerald-500/5'
        }`}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs uppercase font-bold text-zinc-400">
                  Daily Intake Summary:
                </span>
                <span className="text-2xl sm:text-3xl font-black text-white">
                  {totalCalories.toLocaleString()} <span className="text-xs font-normal text-zinc-400">/ {dailyTarget} kcal</span>
                </span>
                {totalCalories > 0 && (
                  <span className={`px-2.5 py-1 rounded-md text-xs font-black tracking-wider uppercase flex items-center gap-1.5 ${
                    isOverTarget
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'bg-emerald-500 text-zinc-950 shadow-sm'
                  }`}>
                    {isOverTarget ? (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5" />
                        SURPLUS +{variance} KCAL
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        DEFICIT {variance} KCAL
                      </>
                    )}
                  </span>
                )}
              </div>

              <p className="text-xs text-zinc-400">
                Target: <strong className="text-white">{dailyTarget}</strong> · Logged:{' '}
                <strong className="text-white">{totalCalories}</strong> ·{' '}
                {variance < 0 ? (
                  <span className="text-emerald-400 font-bold">Deficit {variance} kcal remaining</span>
                ) : variance > 0 ? (
                  <span className="text-rose-400 font-bold">Over Target by +{variance} kcal</span>
                ) : (
                  <span className="text-cyan-400 font-bold">Exactly on Target</span>
                )}
              </p>
            </div>

            {/* Percentage Gauge */}
            <div className="shrink-0 flex items-center gap-3 bg-zinc-900/80 border border-white/[0.06] p-3 rounded-xl">
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-500 block">
                  Intake Ratio
                </span>
                <span className={`text-xl font-black ${isOverTarget ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {percentOfTarget}%
                </span>
              </div>
              <div className="h-7 w-[1px] bg-white/[0.08]" />
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-500 block">
                  Net Fuel
                </span>
                <span className="text-xl font-black text-white">
                  {totalCalories} <span className="text-xs text-zinc-500 font-normal">kcal</span>
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar with 100% Target Reference */}
          <div className="mt-4 space-y-1.5">
            <div className="relative h-2.5 w-full rounded-full bg-zinc-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isOverTarget ? 'bg-rose-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, percentOfTarget)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-zinc-500">
              <span>0 kcal</span>
              <span>Target: {dailyTarget} kcal (100%)</span>
              <span>{Math.max(dailyTarget, totalCalories)} kcal</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. JUNK FOOD TRACKER (INDEPENDENT OF CALORIES) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0b0f19] border border-white/[0.08] shadow-xl space-y-4 font-mono">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.06]">
          <div>
            <span className="text-[10px] text-zinc-400 uppercase font-bold block">
              Discipline Switch
            </span>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Ate Junk Food Today?</span>
              <span className="text-xs text-zinc-500 font-normal">
                (Tracked independently · Single tap saves instantly)
              </span>
            </h3>
          </div>

          {typeof eating.ateJunkFood === 'boolean' && (
            <button
              type="button"
              onClick={resetJunkFoodStatus}
              className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1 transition-colors self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Junk Flag</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Choice 1: Clean Day (No Junk Food) */}
          <button
            type="button"
            onClick={() => setJunkFoodStatus(false)}
            className={`p-4 rounded-xl border text-left transition-all duration-200 flex items-center gap-4 ${
              eating.ateJunkFood === false
                ? 'bg-emerald-500/15 border-emerald-400 text-white shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-400'
                : 'bg-zinc-900/70 border-white/[0.06] text-zinc-400 hover:text-white hover:border-white/20'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${
              eating.ateJunkFood === false
                ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/30 font-black'
                : 'bg-zinc-800 text-zinc-400'
            }`}>
              🥗
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white">No Junk Food (100% Clean)</span>
                {eating.ateJunkFood === false && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">
                Stuck strictly to whole foods and healthy nutrition today.
              </p>
            </div>
          </button>

          {/* Choice 2: Ate Junk Food */}
          <button
            type="button"
            onClick={() => setJunkFoodStatus(true)}
            className={`p-4 rounded-xl border text-left transition-all duration-200 flex items-center gap-4 ${
              eating.ateJunkFood === true
                ? 'bg-rose-500/15 border-rose-400 text-white shadow-lg shadow-rose-500/10 ring-1 ring-rose-400'
                : 'bg-zinc-900/70 border-white/[0.06] text-zinc-400 hover:text-white hover:border-white/20'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${
              eating.ateJunkFood === true
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30 font-black'
                : 'bg-zinc-800 text-zinc-400'
            }`}>
              🍔
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white">Ate Junk Food</span>
                {eating.ateJunkFood === true && (
                  <CheckCircle2 className="w-4 h-4 text-rose-400" />
                )}
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">
                Had fast food, sugary treats, deep-fried or cheat snacks today.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* 5. PROTOCOL COMPLETION STATUS BANNER */}
      <div className={`p-4 rounded-xl border font-mono text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
        isCompleted
          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
          : 'bg-zinc-900/60 border-white/[0.06] text-zinc-400'
      }`}>
        <div className="flex items-center gap-2.5">
          {isCompleted ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <div className="w-4 h-4 rounded-full border border-zinc-500 shrink-0" />
          )}
          <span>
            {isCompleted
              ? '✓ FOOD PROTOCOL LOCKED FOR TODAY (+30 XP) • Contributes to daily completion % & GitHub heatmap'
              : 'PENDING // Enter any meal calorie number OR set junk food toggle to lock today\'s Food protocol'}
          </span>
        </div>
        <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
          Habit 3 of 10 Core
        </span>
      </div>

      {/* 6. WEEKLY & 7-DAY REPORTS (Integrated right here!) */}
      <FoodReports
        allLogs={allLogs}
        todayDate={todayDate}
        dailyTarget={dailyTarget}
      />
    </div>
  );
};
