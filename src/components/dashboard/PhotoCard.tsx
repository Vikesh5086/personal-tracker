import React, { useState } from 'react';
import { Camera, CheckCircle, Maximize2, Trash2, Image as ImageIcon } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { compressImage } from '../../services/imageUtils';

export const PhotoCard: React.FC = () => {
  const { currentLog, updateCurrentHabit } = useApp();
  const [showFullPhoto, setShowFullPhoto] = useState(false);

  if (!currentLog) return null;
  const photo = currentLog.photo;

  const handleUpdate = (partial: Partial<typeof photo>) => {
    updateCurrentHabit((prev) => ({
      ...prev,
      photo: {
        ...prev.photo,
        ...partial,
        completed: (partial.photoBase64 !== undefined ? partial.photoBase64.length > 0 : prev.photo.photoBase64 !== undefined && prev.photo.photoBase64.length > 0) || (partial.completed ?? prev.photo.completed),
      },
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('Photo must be less than 10MB');
        return;
      }
      try {
        const compressed = await compressImage(file, 800, 0.75);
        handleUpdate({ photoBase64: compressed });
      } catch (err) {
        console.error('Image compression fallback:', err);
        const reader = new FileReader();
        reader.onloadend = () => {
          handleUpdate({ photoBase64: reader.result as string });
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const hasPhoto = Boolean(photo.photoBase64 && photo.photoBase64.length > 0);
  const isCompleted = photo.completed || hasPhoto;

  return (
    <>
      <div className={`rounded-3xl p-5 border transition-all duration-200 glass-card relative overflow-hidden ${
        isCompleted
          ? 'border-pink-500/40 shadow-pink-500/5 shadow-lg'
          : 'border-slate-200 dark:border-white/10'
      }`}>
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-500 to-rose-500" />

        {/* Card Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-pink-500/10 text-pink-600 dark:text-pink-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Daily Photo Log</span>
              </h3>
              <span className="text-[11px] text-pink-600 dark:text-pink-400 font-semibold">
                Visual Transformation
              </span>
            </div>
          </div>

          <button
            onClick={() => handleUpdate({ completed: !isCompleted })}
            className={`p-1.5 rounded-xl transition-colors ${
              isCompleted
                ? 'text-pink-600 dark:text-pink-400 bg-pink-500/10'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
            title={isCompleted ? 'Marked complete' : 'Mark complete'}
          >
            <CheckCircle className={`w-5 h-5 ${isCompleted ? 'fill-pink-500 text-white' : ''}`} />
          </button>
        </div>

        {/* Photo Upload / Preview Area */}
        {hasPhoto ? (
          <div className="space-y-3">
            <div className="relative group rounded-2xl overflow-hidden aspect-video bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-md">
              <img
                src={photo.photoBase64}
                alt="Daily progress"
                className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform duration-300"
                onClick={() => setShowFullPhoto(true)}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowFullPhoto(true)}
                  className="p-2 rounded-xl bg-white/80 hover:bg-white text-slate-900 shadow-lg"
                  title="View full size"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdate({ photoBase64: '' })}
                  className="p-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-lg"
                  title="Remove photo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <input
              type="text"
              placeholder="Caption this day's photo..."
              value={photo.caption || ''}
              onChange={(e) => handleUpdate({ caption: e.target.value })}
              className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-pink-500"
            />
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-pink-400/40 hover:border-pink-500 bg-pink-500/5 hover:bg-pink-500/10 cursor-pointer transition-all">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="sr-only"
            />
            <div className="p-3 rounded-2xl bg-pink-500/10 text-pink-600 dark:text-pink-400 mb-2">
              <ImageIcon className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Upload Today's Photo
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">
              Physique, work setup, or daily memory (stored locally)
            </span>
          </label>
        )}
      </div>

      {/* Lightbox Full Size Modal */}
      {showFullPhoto && (
        <Modal
          isOpen={showFullPhoto}
          onClose={() => setShowFullPhoto(false)}
          title={`Day ${currentLog.dayNumber} Photo`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-3">
            <div className="rounded-2xl overflow-hidden bg-black max-h-[70vh] flex items-center justify-center">
              <img
                src={photo.photoBase64}
                alt="Full size daily log"
                className="max-h-[70vh] w-auto object-contain mx-auto"
              />
            </div>
            {photo.caption && (
              <p className="text-sm text-center italic text-slate-600 dark:text-slate-300">
                "{photo.caption}"
              </p>
            )}
          </div>
        </Modal>
      )}
    </>
  );
};
