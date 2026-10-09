import React, { useState, useMemo } from 'react';
import { Sparkles, SlidersHorizontal, Image as ImageIcon, ArrowLeftRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DailyLog } from '../../types';

export const BeforeAfterSlider: React.FC = () => {
  const { allLogs, profile, setActiveTab } = useApp();
  const [sliderPosition, setSliderPosition] = useState(50);
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side'>('slider');

  // Find Day 1 photo (or first photo recorded) and latest photo recorded
  const { firstPhotoLog, latestPhotoLog } = useMemo(() => {
    const withPhotos = allLogs
      .filter((l) => l.photo?.photoBase64 && l.photo.photoBase64.length > 0)
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      firstPhotoLog: withPhotos[0] || null,
      latestPhotoLog: withPhotos.length > 1 ? withPhotos[withPhotos.length - 1] : null,
    };
  }, [allLogs]);

  const hasBothPhotos = Boolean(firstPhotoLog && latestPhotoLog);

  return (
    <div className="rounded-2xl bg-[#0b0f19] border border-white/[0.08] shadow-xl p-5 sm:p-6 space-y-4 text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-400 bg-white/[0.05] border border-white/[0.08] px-2 py-0.5 rounded">
              VISUAL CHRONICLE
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black tracking-tight text-white font-mono uppercase">
            Transformation Photo Progression
          </h3>
          <p className="text-xs text-zinc-400">
            Compare Day 1 against your latest milestone photo. Direct physical proof of your discipline.
          </p>
        </div>

        {hasBothPhotos && (
          <div className="inline-flex items-center p-1 rounded-xl bg-zinc-900 border border-white/[0.08] font-mono text-xs">
            <button
              type="button"
              onClick={() => setViewMode('slider')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                viewMode === 'slider'
                  ? 'bg-zinc-100 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Interactive Slider
            </button>
            <button
              type="button"
              onClick={() => setViewMode('side-by-side')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                viewMode === 'side-by-side'
                  ? 'bg-zinc-100 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Side by Side
            </button>
          </div>
        )}
      </div>

      {!hasBothPhotos ? (
        <div className="p-8 rounded-xl bg-zinc-900/60 border border-white/[0.06] text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-white/[0.08] flex items-center justify-center text-zinc-400 mx-auto">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white font-mono">
              Transformation photos unlocking...
            </h4>
            <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1">
              Upload your Day 1 baseline photo and subsequent milestone progress photos in the Daily Log to unlock the interactive comparison slider!
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-zinc-100 text-zinc-950 hover:bg-white shadow-sm transition-all"
          >
            Log Today's Photo
          </button>
        </div>
      ) : viewMode === 'slider' ? (
        <div className="relative w-full max-w-2xl mx-auto aspect-[4/3] rounded-xl overflow-hidden select-none border border-white/[0.1] shadow-2xl bg-black">
          {/* After Photo (Base layer) */}
          <img
            src={latestPhotoLog?.photo?.photoBase64}
            alt="Latest Progress"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-white font-mono text-[10px] font-bold border border-white/[0.1]">
            LATEST // {latestPhotoLog?.date}
          </div>

          {/* Before Photo (Clipped overlay) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPosition}%` }}
          >
            <img
              src={firstPhotoLog?.photo?.photoBase64}
              alt="Day 1 Baseline"
              className="absolute inset-0 w-full h-full object-cover max-w-none"
              style={{ width: '100%', height: '100%' }}
            />
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-white font-mono text-[10px] font-bold border border-white/[0.1]">
              BASELINE // {firstPhotoLog?.date}
            </div>
          </div>

          {/* Slider Line Divider */}
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-white cursor-ew-resize z-10 shadow-[0_0_10px_rgba(255,255,255,0.8)]"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-zinc-950 flex items-center justify-center shadow-lg border border-black/20">
              <ArrowLeftRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Invisible Range Input Slider for touch & mouse */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPosition}
            onChange={(e) => setSliderPosition(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {/* Day 1 */}
          <div className="rounded-xl overflow-hidden border border-white/[0.1] bg-black relative aspect-[4/3]">
            <img
              src={firstPhotoLog?.photo?.photoBase64}
              alt="Baseline"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-white font-mono text-[10px] font-bold border border-white/[0.1]">
              DAY 1 // {firstPhotoLog?.date}
            </div>
          </div>

          {/* Latest */}
          <div className="rounded-xl overflow-hidden border border-white/[0.1] bg-black relative aspect-[4/3]">
            <img
              src={latestPhotoLog?.photo?.photoBase64}
              alt="Latest"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-white font-mono text-[10px] font-bold border border-white/[0.1]">
              LATEST // {latestPhotoLog?.date}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
