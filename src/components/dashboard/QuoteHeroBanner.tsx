import React, { useState } from 'react';
import { Quote as QuoteIcon, Volume2, RefreshCw, Copy, Check, Terminal } from 'lucide-react';
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
    <div className="relative p-6 sm:p-7 rounded-2xl bg-[#0b0f19] border border-white/[0.08] shadow-xl overflow-hidden group">
      {/* Decorative Subtle Quotation Mark */}
      <QuoteIcon className="w-16 h-16 text-white/[0.03] absolute top-4 right-6 pointer-events-none" />

      <div className="relative z-10 space-y-3.5">
        {/* Header Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-300 bg-zinc-900 border border-white/[0.08] px-2.5 py-1 rounded-md">
              {categoryLabel}
            </span>
            <span className="text-[11px] font-mono text-zinc-500">
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
                  ? 'bg-zinc-100 text-zinc-950 border-white animate-pulse'
                  : 'bg-zinc-900 border-white/[0.08] text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
              title="Listen aloud"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleCopyQuote}
              className="p-1.5 rounded-lg bg-zinc-900 border border-white/[0.08] text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
              title="Copy quote"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={handleNextQuote}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/[0.1] text-zinc-200 hover:text-white font-mono text-xs font-bold transition-all"
              title="Next operating principle"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Rotate</span>
            </button>
          </div>
        </div>

        {/* Big Inspiring Quote Text */}
        <blockquote className="pt-0.5">
          <p className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white leading-relaxed italic">
            "{quote.text}"
          </p>
          <footer className="mt-2.5 flex items-center gap-2 font-mono text-xs text-zinc-400">
            <span className="w-5 h-[1px] bg-white/[0.2]" />
            <cite className="not-italic uppercase tracking-wider font-semibold text-zinc-300">
              {quote.author}
            </cite>
          </footer>
        </blockquote>
      </div>
    </div>
  );
};
