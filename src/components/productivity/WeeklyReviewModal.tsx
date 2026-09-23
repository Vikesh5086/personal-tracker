import React, { useState, useEffect } from 'react';
import { Star, MessageSquareQuote, CheckCircle2, History, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WeeklyReview } from '../../types';
import { getWeeklyReviews, saveWeeklyReview } from '../../services/db';
import { Modal } from '../common/Modal';

export const WeeklyReviewModal: React.FC = () => {
  const { currentDayNumber, todayDate, fireConfetti } = useApp();
  const [reviews, setReviews] = useState<WeeklyReview[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const currentWeekNumber = Math.max(1, Math.ceil(currentDayNumber / 7));
  const isSunday = new Date().getDay() === 0;

  const [wins, setWins] = useState('');
  const [improvements, setImprovements] = useState('');
  const [rating, setRating] = useState(5);

  const loadReviews = async () => {
    const list = await getWeeklyReviews();
    setReviews(list.sort((a, b) => b.weekNumber - a.weekNumber));
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wins.trim() && !improvements.trim()) return;

    const review: WeeklyReview = {
      id: `wr_${currentWeekNumber}_${Date.now()}`,
      weekNumber: currentWeekNumber,
      startDate: todayDate,
      endDate: todayDate,
      wins: wins.trim(),
      improvements: improvements.trim(),
      rating,
      createdAt: new Date().toISOString(),
    };

    await saveWeeklyReview(review);
    setWins('');
    setImprovements('');
    setIsOpen(false);
    fireConfetti();
    await loadReviews();
  };

  return (
    <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-white/10 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase mb-1">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>Weekly Reflection</span>
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            Sunday Weekly Review
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isSunday
              ? "It's Sunday! Take 3 minutes to reflect on your wins and dial in next week's focus."
              : 'Reflect on wins, diagnose friction, and recalibrate your trajectory.'}
          </p>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-md shadow-amber-600/20 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Write Week {currentWeekNumber} Review</span>
        </button>
      </div>

      {/* Existing Reviews History */}
      <div className="space-y-3">
        {reviews.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            No weekly reviews logged yet. Submit your first Sunday reflection above!
          </div>
        ) : (
          reviews.map((r) => (
            <div
              key={r.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
                    Week {r.weekNumber}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}
                  </span>
                </div>
                {/* Star rating */}
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                    🎯 What Went Well (Wins)
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {r.wins || 'No specific wins noted.'}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                  <span className="font-bold text-amber-600 dark:text-amber-400 block mb-1">
                    ⚡ What to Improve Next Week
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {r.improvements || 'No specific improvements noted.'}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review Dialog */}
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={`Week ${currentWeekNumber} Review & Retrospective`}
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleSaveReview} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                How would you rate this week's discipline? (1 to 5 Stars)
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    className="p-1 text-slate-300 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        s <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                What went well this week? (Wins & breakthroughs)
              </label>
              <textarea
                required
                rows={3}
                placeholder="e.g. Hit 6 gym workouts, learned Transformer self-attention math, solved 15 graph problems..."
                value={wins}
                onChange={(e) => setWins(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                What should you improve or optimize next week?
              </label>
              <textarea
                required
                rows={3}
                placeholder="e.g. Cut phone scrolling before bed, sleep earlier at 11 PM, drink water first thing in the morning..."
                value={improvements}
                onChange={(e) => setImprovements(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-md shadow-amber-600/30"
              >
                Save Review
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
