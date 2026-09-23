import React, { useState } from 'react';
import { Camera, Calendar, Target, User, Sparkles, LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GoalType, UserProfile } from '../../types';

export const OnboardingModal: React.FC = () => {
  const {
    showOnboarding,
    saveUserProfile,
    todayDate,
    loginWithGoogleAction,
    logoutAction,
    firebaseUser,
    isCloudSyncing,
  } = useApp();

  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>(24);
  const [height, setHeight] = useState('175 cm');
  const [weight, setWeight] = useState('70 kg');
  const [goal, setGoal] = useState<GoalType>('General consistency');
  const [customGoalText, setCustomGoalText] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<string>('');

  const [startDate, setStartDate] = useState(todayDate);

  // Default end date is startDate + 100 days
  const calculateDefaultEndDate = (start: string) => {
    const d = new Date(start + 'T00:00:00');
    d.setDate(d.getDate() + 99);
    return d.toISOString().split('T')[0];
  };

  const [endDate, setEndDate] = useState(() => calculateDefaultEndDate(todayDate));

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = e.target.value;
    setStartDate(newStart);
    setEndDate(calculateDefaultEndDate(newStart));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Photo must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter your name');
      return;
    }

    const newProfile: UserProfile = {
      name: name.trim(),
      age: Number(age) || 20,
      height: height.trim() || '175 cm',
      weight: weight.trim() || '70 kg',
      goal,
      customGoalText: goal === 'Custom' ? customGoalText : undefined,
      profilePhoto: profilePhoto || undefined,
      startDate,
      endDate,
      themeMode: 'dark',
      accentColor: 'indigo',
      onboardingCompleted: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveUserProfile(newProfile);
  };

  if (!showOnboarding) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl my-8 glass-panel bg-white/95 dark:bg-slate-900/95 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-xs font-bold tracking-wider uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome to 100-Day Tracker</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Design Your 100-Day Transformation
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Build discipline, master DSA & AI/ML, sculpt your fitness, and level up every day.
          </p>
        </div>
 
        {/* Already have an account / Google Sign-In Card */}
        <div className="mb-6 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 text-center space-y-2.5">
          {firebaseUser ? (
            <div className="space-y-3">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Currently connected with Google:
              </div>
              <div className="flex items-center justify-center gap-2.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 max-w-sm mx-auto shadow-sm">
                {firebaseUser.photoURL ? (
                  <img src={firebaseUser.photoURL} alt="Avatar" className="w-6 h-6 rounded-full border border-indigo-500/40" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                    {(firebaseUser.displayName || firebaseUser.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <div className="text-left truncate">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {firebaseUser.displayName || 'Google Account'}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {firebaseUser.email}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={loginWithGoogleAction}
                  disabled={isCloudSyncing}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
                >
                  <span>{isCloudSyncing ? 'Loading...' : 'Restore / Enter Dashboard'}</span>
                </button>
                <button
                  type="button"
                  onClick={logoutAction}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 border border-rose-500/30 transition-all flex items-center gap-1.5"
                  title="Log out of this Gmail and pick another"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Switch Account / Log Out</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Already started your 100-day journey on your laptop or another device?
              </div>
              <button
                type="button"
                onClick={loginWithGoogleAction}
                disabled={isCloudSyncing}
                className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white text-xs font-bold shadow-sm hover:shadow-md active:scale-98 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>{isCloudSyncing ? 'Restoring Your Journey...' : 'Sign In with Google to Restore Progress'}</span>
              </button>
            </>
          )}

          <div className="flex items-center gap-2 pt-1">
            <div className="flex-1 h-px bg-slate-300 dark:bg-slate-700/60" />
            <span className="text-[10px] uppercase font-bold text-slate-400">or setup new profile</span>
            <div className="flex-1 h-px bg-slate-300 dark:bg-slate-700/60" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Profile Photo Upload */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative group cursor-pointer">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-indigo-400/60 dark:border-indigo-500/60 flex items-center justify-center shadow-inner">
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-2 text-slate-400">
                    <Camera className="w-7 h-7 mx-auto mb-1 text-indigo-500" />
                    <span className="text-[10px] font-semibold block leading-tight">Add Photo</span>
                  </div>
                )}
              </div>
              <label
                htmlFor="photo-upload-input"
                className="absolute inset-0 cursor-pointer rounded-full"
              >
                <input
                  id="photo-upload-input"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="sr-only"
                />
              </label>
            </div>
            <span className="text-xs text-slate-400 mt-1">Optional profile picture</span>
          </div>

          {/* Name & Age */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Your Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Hunter"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Age
              </label>
              <input
                type="number"
                min="10"
                max="100"
                value={age}
                onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Height & Weight */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Height
              </label>
              <input
                type="text"
                placeholder="e.g. 178 cm or 5'10"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Weight
              </label>
              <input
                type="text"
                placeholder="e.g. 72 kg or 160 lbs"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Goal Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Primary 100-Day Goal
            </label>
            <div className="relative">
              <Target className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value as GoalType)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="General consistency">General consistency & Productivity</option>
                <option value="Weight loss">Weight Loss & Lean Fitness</option>
                <option value="Muscle gain">Muscle Gain & Strength Building</option>
                <option value="Custom">Custom Target Goal</option>
              </select>
            </div>
            {goal === 'Custom' && (
              <input
                type="text"
                placeholder="Describe your custom goal..."
                value={customGoalText}
                onChange={(e) => setCustomGoalText(e.target.value)}
                className="mt-2 w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            )}
          </div>

          {/* Challenge Dates */}
          <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              <Calendar className="w-4 h-4" />
              <span>100-Day Challenge Timeline</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Start Date (Day 1)
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  End Date (Day 100)
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
              Note: You can extend your challenge or adjust dates anytime in Settings.
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 text-base"
          >
            <span>Begin Day 1</span>
            <Sparkles className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
