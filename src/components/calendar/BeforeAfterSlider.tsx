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
    <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-white/10 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 text-xs font-bold uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Visual Evolution</span>
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            Before & After Photo Comparison
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Compare Day 1 against your latest milestone photo. Proof of transformation.
          </p>
        </div>

        {hasBothPhotos && (
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('slider')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'slider'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              Interactive Slider
            </button>
            <button
              onClick={() => setViewMode('side-by-side')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'side-by-side'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              Side-by-Side
            </button>
          </div>
        )}
      </div>

      {hasBothPhotos && firstPhotoLog && latestPhotoLog ? (
        <div className="space-y-4">
          {viewMode === 'slider' ? (
            /* Split Comparison Slider */
            <div className="relative w-full max-w-2xl mx-auto aspect-video rounded-3xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-2xl select-none">
              {/* Background Image: Latest Day (After) */}
              <img
                src={latestPhotoLog.photo.photoBase64}
                alt={`Day ${latestPhotoLog.dayNumber} Progress`}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute bottom-4 right-4 px-3 py-1 rounded-xl bg-black/70 backdrop-blur-md text-white text-xs font-bold z-10">
                Latest (Day {latestPhotoLog.dayNumber} • {latestPhotoLog.date})
              </div>

              {/* Foreground Image: Day 1 (Before) clipped */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPosition}%` }}
              >
                <img
                  src={firstPhotoLog.photo.photoBase64}
                  alt={`Day ${firstPhotoLog.dayNumber} Progress`}
                  className="absolute inset-0 w-full h-full object-cover max-w-none"
                  style={{ width: '100%', height: '100%' }}
                />
                <div className="absolute bottom-4 left-4 px-3 py-1 rounded-xl bg-black/70 backdrop-blur-md text-white text-xs font-bold z-10 whitespace-nowrap">
                  Before (Day {firstPhotoLog.dayNumber} • {firstPhotoLog.date})
                </div>
              </div>

              {/* Slider Divider Line */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20 pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-xl flex items-center justify-center text-slate-800 pointer-events-none">
                  <ArrowLeftRight className="w-4 h-4" />
                </div>
              </div>

              {/* Invisible range input overlaid */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPosition}
                onChange={(e) => setSliderPosition(Number(e.target.value))}
                className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-30"
              />
            </div>
          ) : (
            /* Side-by-side mode */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
              <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 aspect-video relative group">
                <img
                  src={firstPhotoLog.photo.photoBase64}
                  alt="Day 1"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-xl bg-black/70 backdrop-blur-md text-white text-xs font-bold">
                  Day {firstPhotoLog.dayNumber} ({firstPhotoLog.date})
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 aspect-video relative group">
                <img
                  src={latestPhotoLog.photo.photoBase64}
                  alt="Latest"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-xl bg-black/70 backdrop-blur-md text-white text-xs font-bold">
                  Day {latestPhotoLog.dayNumber} ({latestPhotoLog.date})
                </div>
              </div>
            </div>
          )}

          <p className="text-center text-xs text-slate-400">
            {viewMode === 'slider' ? 'Drag left and right across the photo to reveal your evolution.' : 'Side by side comparison of Day 1 vs Latest photo.'}
          </p>
        </div>
      ) : (
        /* Empty / single photo state */
        <div className="p-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-500 flex items-center justify-center mx-auto">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {firstPhotoLog
                ? 'Only 1 Photo Logged So Far'
                : 'No Progress Photos Uploaded Yet'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              {firstPhotoLog
                ? 'Great start! Log a photo on future days to unlock the interactive Before/After comparison slider.'
                : 'Upload daily photos in the Daily Dashboard to visually document your physique and journey!'}
            </p>
          </div>
          <button
            onClick={() => setActiveTab('dashboard')}
            className="px-4 py-2 text-xs font-bold text-white bg-pink-600 hover:bg-pink-700 rounded-xl shadow-md shadow-pink-600/20 transition-all inline-block"
          >
            Upload Photo Today
          </button>
        </div>
      )}
    </div>
  );
};
