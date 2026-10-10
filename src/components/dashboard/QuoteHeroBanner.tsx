import React, { useState } from 'react';
import { Quote as QuoteIcon, Volume2, RefreshCw, Copy, Check } from 'lucide-react';
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

  const categoryLabels: Record<Quote['category'], string> = {
    discipline: 'IRON DISCIPLINE',
    consistency: 'DAILY CONSISTENCY',
    growth: 'EXPONENTIAL GROWTH',
    focus: 'LASER FOCUS',
  };

  const categoryLabel = categoryLabels[quote.category] || 'DISCIPLINE';

  return (
    <div className="relative p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#161a25] border border-slate-200 dark:border-white/[0.08] shadow-xs dark:shadow-xl overflow-hidden group">
      {/* Decorative Subtle Quotation Mark */}
      <QuoteIcon className="w-16 h-16 text-slate-200/50 dark:text-white/[0.03] absolute top-4 right-6 pointer-events-none" />

      <div className="relative z-10 space-y-3.5">
        {/* Header Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300 bg-slate-100 dark:bg-[#1f2433] border border-slate-200 dark:border-white/[0.08] px-2.5 py-1 rounded-md">
              {categoryLabel}
            </span>
            <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-400">
              Daily Operating Principle
            </span>
          </div>

          {/* Interactive controls: Voice, Copy, Next */}
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <button
              type="button"
              onClick={handleSpeakQuote}
              className={`p-1.5 rounded-lg border transition-all ${
                isSpeaking
                  ? 'bg-indigo-500 text-white border-indigo-400 animate-pulse'
                  : 'bg-slate-100 dark:bg-[#1e2330] border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#252c3d]'
              }`}
              title="Listen aloud"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleCopyQuote}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-[#1e2330] border border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#252c3d] transition-all"
              title="Copy quote"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={handleNextQuote}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-[#1e2330] hover:bg-slate-200 dark:hover:bg-[#252c3d] border border-slate-200 dark:border-white/[0.1] text-slate-700 dark:text-zinc-200 hover:text-slate-900 dark:hover:text-white font-mono text-xs font-bold transition-all"
              title="Next operating principle"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Rotate</span>
            </button>
          </div>
        </div>

        {/* Big Inspiring Quote Text */}
        <blockquote className="pt-0.5">
          <p className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-relaxed italic">
            "{quote.text}"
          </p>
          <footer className="mt-2.5 flex items-center gap-2 font-mono text-xs text-slate-500 dark:text-zinc-400">
            <span className="w-5 h-[1px] bg-slate-300 dark:bg-white/[0.2]" />
            <cite className="not-italic uppercase tracking-wider font-semibold text-slate-700 dark:text-zinc-300">
              {quote.author}
            </cite>
          </footer>
        </blockquote>
      </div>
    </div>
  );
};
