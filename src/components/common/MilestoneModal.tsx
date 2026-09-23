import React from 'react';
import { Award, Flame, CheckCircle2 } from 'lucide-react';
import { Modal } from './Modal';
import { useApp } from '../../context/AppContext';

export const MilestoneModal: React.FC = () => {
  const { milestoneModal, setMilestoneModal, profile } = useApp();

  if (!milestoneModal?.show) return null;

  const day = milestoneModal.dayNumber;

  const milestoneTitles: Record<number, { title: string; subtitle: string; emoji: string; color: string }> = {
    25: {
      title: 'Quarter Century!',
      subtitle: 'You have conquered 25% of your 100-Day Challenge. Your habits are solidifying into identity.',
      emoji: '🥉',
      color: 'from-amber-600 to-amber-400',
    },
    50: {
      title: 'The Halfway Summit!',
      subtitle: '50 Days strong! You are at the pinnacle. Most people quit long ago, but you are unstoppable.',
      emoji: '🥈',
      color: 'from-slate-400 to-slate-200',
    },
    75: {
      title: 'The Final Stretch!',
      subtitle: '75 Days crushed! You are in the home stretch of true transformation. Finish with sheer glory.',
      emoji: '🥇',
      color: 'from-yellow-400 to-amber-500',
    },
    100: {
      title: 'THE 100-DAY MASTER!',
      subtitle: `Congratulations, ${profile?.name || 'Warrior'}! You completed the 100-Day Challenge! You transformed your habits, mindset, and life.`,
      emoji: '🏆',
      color: 'from-purple-500 via-pink-500 to-amber-400',
    },
  };

  const info = milestoneTitles[day] || {
    title: `Day ${day} Milestone!`,
    subtitle: 'Another massive milestone reached on your journey.',
    emoji: '🔥',
    color: 'from-indigo-500 to-purple-600',
  };

  return (
    <Modal
      isOpen={milestoneModal.show}
      onClose={() => setMilestoneModal(null)}
      maxWidth="max-w-md"
    >
      <div className="text-center py-4 space-y-5">
        <div className="text-6xl animate-bounce">{info.emoji}</div>

        <div>
          <span className="text-xs uppercase tracking-widest font-black px-3.5 py-1 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            Day {day} Reached
          </span>
          <h2 className={`text-3xl font-black mt-3 bg-gradient-to-r ${info.color} bg-clip-text text-transparent`}>
            {info.title}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
            {info.subtitle}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-left space-y-2 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Milestone badge unlocked in your profile</span>
          </div>
          <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>+250 Bonus Milestone XP awarded</span>
          </div>
        </div>

        <button
          onClick={() => setMilestoneModal(null)}
          className="w-full py-3 px-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/30 transition-all"
        >
          Keep Crushing It
        </button>
      </div>
    </Modal>
  );
};
