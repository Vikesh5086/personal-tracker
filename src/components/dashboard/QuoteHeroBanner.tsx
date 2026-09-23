import React, { useState } from 'react';
import { Quote as QuoteIcon, Volume2, RefreshCw, Copy, Check, Sparkles, Flame } from 'lucide-react';
import { getRandomQuote, Quote } from '../../services/quotes';
import { sounds } from '../../services/sound';

export const QuoteHeroBanner: React.FC = () => {
  const [quote, setQuote] = useState<Quote>(getRandomQuote);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleNextQuote = () => {
    sounds.playTap();
    setQuote(getRandomQuote());
  };

  const handleCopyQuote = () => {
    sounds.playTap();
    navigator.clipboard.writeText(`"${quote.text}" — ${quote.author}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeakQuote = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`${quote.text}. Said by ${quote.author}`);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const categoryBadges: Record<Quote['category'], { label: string; color: string; icon: string }> = {
    discipline: { label: 'Iron Discipline', color: 'from-amber-500/20 to-orange-500/20 text-orange-500 border-orange-500/30', icon: '🔥' },
    consistency: { label: 'Daily Consistency', color: 'from-emerald-500/20 to-teal-500/20 text-emerald-500 border-emerald-500/30', icon: '⚡' },
    growth: { label: 'Exponential Growth', color: 'from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-500/30', icon: '🧠' },
    focus: { label: 'Laser Focus', color: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30', icon: '🎯' },
  };

  const badge = categoryBadges[quote.category] || categoryBadges.discipline;

  return (
    <div className="relative p-6 sm:p-8 rounded-3xl glass-panel shadow-2xl border border-slate-200/90 dark:border-white/10 overflow-hidden group">
      {/* Ambient background glows */}
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-gradient-to-tr from-amber-500/15 via-orange-500/10 to-transparent blur-3xl pointer-events-none" />

      {/* Decorative Giant Quotation Mark */}
      <QuoteIcon className="w-16 h-16 text-indigo-500/10 dark:text-indigo-400/15 absolute top-4 left-6 pointer-events-none" />

      <div className="relative z-10 space-y-4">
        {/* Category Pill and Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border bg-gradient-to-r ${badge.color}`}>
              <span>{badge.icon}</span>
              <span>{badge.label}</span>
            </span>
            <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
              Daily Wisdom
            </span>
          </div>

          {/* Interactive controls: Voice, Copy, Shuffle */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleSpeakQuote}
              className={`p-2 rounded-xl border transition-all ${
                isSpeaking
                  ? 'bg-indigo-600 text-white border-indigo-600 scale-105 animate-pulse'
                  : 'bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-500'
              }`}
              title="Listen to quote spoken aloud"
            >
              <Volume2 className="w-4 h-4" />
            </button>

            <button
              onClick={handleCopyQuote}
              className="p-2 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-500 transition-all active:scale-95"
              title="Copy quote to clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={handleNextQuote}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all active:scale-95"
              title="Get another quote"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Inspire Me</span>
            </button>
          </div>
        </div>

        {/* Big Inspiring Quote Text */}
        <blockquote className="pt-1">
          <p className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-relaxed italic">
            "{quote.text}"
          </p>
          <footer className="mt-3 flex items-center gap-3">
            <div className="h-[2px] w-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
            <cite className="not-italic text-sm sm:text-base font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              {quote.author}
            </cite>
          </footer>
        </blockquote>
      </div>
    </div>
  );
};
