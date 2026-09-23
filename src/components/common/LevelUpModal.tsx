import React from 'react';
import { Trophy, Sparkles, ArrowRight } from 'lucide-react';
import { Modal } from './Modal';
import { useApp } from '../../context/AppContext';

export const LevelUpModal: React.FC = () => {
  const { levelUpModal, setLevelUpModal } = useApp();

  if (!levelUpModal?.show) return null;

  return (
    <Modal
      isOpen={levelUpModal.show}
      onClose={() => setLevelUpModal(null)}
      maxWidth="max-w-md"
    >
      <div className="text-center py-4 space-y-4">
        <div className="relative mx-auto w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-lg shadow-amber-500/30 animate-bounce">
          <Trophy className="w-12 h-12 text-slate-950" />
          <Sparkles className="w-6 h-6 text-yellow-200 absolute -top-1 -right-1 animate-spin" />
        </div>

        <div>
          <span className="text-xs uppercase tracking-widest font-extrabold px-3 py-1 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30">
            Level Up!
          </span>
          <h2 className="text-2xl font-black mt-3 text-slate-900 dark:text-white">
            Level {levelUpModal.level}
          </h2>
          <p className="text-lg font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
            {levelUpModal.title}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Your unstoppable discipline is paying off! Keep pushing every single day to unlock legendary titles.
          </p>
        </div>

        <button
          onClick={() => setLevelUpModal(null)}
          className="w-full py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2"
        >
          <span>Continue Journey</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </Modal>
  );
};
