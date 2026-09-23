import { DailyLog, GamificationSummary, AchievementBadge } from '../types';

export const LEVEL_TITLES = [
  { level: 1, title: 'Novice Builder', xpReq: 0 },
  { level: 2, title: 'Habit Initiate', xpReq: 300 },
  { level: 3, title: 'Streak Striker', xpReq: 800 },
  { level: 4, title: 'Discipline Adept', xpReq: 1500 },
  { level: 5, title: 'Consistency Titan', xpReq: 2500 },
  { level: 6, title: 'Unstoppable Force', xpReq: 4000 },
  { level: 7, title: 'Master of Will', xpReq: 6000 },
  { level: 8, title: 'Centurion Warrior', xpReq: 8500 },
  { level: 9, title: 'Grandmaster of Life', xpReq: 12000 },
  { level: 10, title: 'Transcendent Legend', xpReq: 16000 },
];

export const ALL_BADGES: Omit<AchievementBadge, 'progress' | 'unlockedAt'>[] = [
  {
    id: 'first_step',
    title: 'First Step',
    description: 'Log your very first habit entry in the challenge',
    icon: '🌱',
    category: 'milestones',
    maxProgress: 1,
  },
  {
    id: 'water_streak_7',
    title: 'Hydration Hero',
    description: 'Log 2L+ of water on 7 different days',
    icon: '💧',
    category: 'habits',
    maxProgress: 7,
  },
  {
    id: 'dsa_50',
    title: 'Algorithm Apprentice',
    description: 'Solve a total of 50 DSA / LeetCode problems',
    icon: '💻',
    category: 'habits',
    maxProgress: 50,
  },
  {
    id: 'workout_10',
    title: 'Iron Will',
    description: 'Complete 10 workouts during the challenge',
    icon: '🔥',
    category: 'habits',
    maxProgress: 10,
  },
  {
    id: 'healthy_eating_7',
    title: 'Clean Fuel',
    description: 'Log healthy meals for 7 days',
    icon: '🥗',
    category: 'habits',
    maxProgress: 7,
  },
  {
    id: 'sleep_rest_7',
    title: 'Deep Rejuvenation',
    description: 'Achieve 7.5+ hours of sleep on 7 days',
    icon: '🌙',
    category: 'habits',
    maxProgress: 7,
  },
  {
    id: 'streak_7',
    title: 'Week of Iron',
    description: 'Maintain a 7-day continuous habit streak',
    icon: '⚡',
    category: 'streaks',
    maxProgress: 7,
  },
  {
    id: 'streak_30',
    title: 'Unbreakable Month',
    description: 'Maintain a 30-day continuous habit streak',
    icon: '🛡️',
    category: 'streaks',
    maxProgress: 30,
  },
  {
    id: 'perfect_week',
    title: 'Flawless Week',
    description: 'Complete all 9 habits on 7 different days',
    icon: '👑',
    category: 'streaks',
    maxProgress: 7,
  },
  {
    id: 'aiml_scholar',
    title: 'Neural Pioneer',
    description: 'Log 10 AI / ML learning sessions',
    icon: '🧠',
    category: 'habits',
    maxProgress: 10,
  },
  {
    id: 'photo_journey',
    title: 'Visual Proof',
    description: 'Upload 10 daily progress photos',
    icon: '📸',
    category: 'habits',
    maxProgress: 10,
  },
  {
    id: 'mindful_soul',
    title: 'Mindful Soul',
    description: 'Log mood & reflection in your journal 10 times',
    icon: '✍️',
    category: 'habits',
    maxProgress: 10,
  },
  {
    id: 'day_25_milestone',
    title: 'Quarter Century',
    description: 'Reach Day 25 of the 100-Day Challenge',
    icon: '🥉',
    category: 'milestones',
    maxProgress: 25,
  },
  {
    id: 'day_50_milestone',
    title: 'Halfway Summit',
    description: 'Reach Day 50 of the 100-Day Challenge',
    icon: '🥈',
    category: 'milestones',
    maxProgress: 50,
  },
  {
    id: 'day_75_milestone',
    title: 'The Home Stretch',
    description: 'Reach Day 75 of the 100-Day Challenge',
    icon: '🥇',
    category: 'milestones',
    maxProgress: 75,
  },
  {
    id: 'day_100_milestone',
    title: 'Century Master',
    description: 'Conquer all 100 days of the Challenge!',
    icon: '🏆',
    category: 'milestones',
    maxProgress: 100,
  },
];

export function calculateGamification(
  logs: DailyLog[],
  challengeStart: string,
  todayStr: string
): GamificationSummary {
  // Sort logs by date ascending
  const sortedLogs = [...logs].sort((a, b) => a.date.localeCompare(b.date));

  // 1. Total XP
  let totalXp = 0;
  let totalLoggedDays = 0;
  let perfectDaysCount = 0;

  let totalDsaQuestions = 0;
  let totalWorkouts = 0;
  let totalHealthyMeals = 0;
  let totalGoodSleep = 0;
  let totalWaterTargets = 0;
  let totalAiMlSessions = 0;
  let totalPhotos = 0;
  let totalJournals = 0;
  let maxDayReached = 0;

  for (const log of sortedLogs) {
    if (log.completionPercentage > 0) {
      totalLoggedDays++;
    }
    if (log.isPerfectDay) {
      perfectDaysCount++;
    }
    totalXp += log.xpEarned || 0;

    if (log.dsa.questionsSolved > 0) totalDsaQuestions += log.dsa.questionsSolved;
    if (log.workout.type && log.workout.type !== 'None' && log.workout.type !== 'Rest day') totalWorkouts++;
    if (log.eating.type === 'Healthy') totalHealthyMeals++;
    if (log.sleep.durationHours >= 7.5) totalGoodSleep++;
    if (log.water.intakeLitres >= 2.0) totalWaterTargets++;
    if (log.aiMl.topic && log.aiMl.topic.trim().length > 0) totalAiMlSessions++;
    if (log.photo.photoBase64 && log.photo.photoBase64.length > 0) totalPhotos++;
    if (log.journal.note && log.journal.note.trim().length > 0) totalJournals++;
    if (log.dayNumber > maxDayReached && log.completionPercentage > 0) maxDayReached = log.dayNumber;
  }

  // Calculate streaks
  const logDateMap = new Map<string, DailyLog>();
  sortedLogs.forEach((l) => logDateMap.set(l.date, l));

  let currentStreak = 0;
  let perfectStreak = 0;

  // Compute active streak backwards from today or yesterday
  const parseDate = (d: string) => new Date(d + 'T00:00:00');
  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  const today = parseDate(todayStr);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Check if today has a log, if not start from yesterday
  const hasLogToday = (logDateMap.get(todayStr)?.completionPercentage || 0) > 0;
  let checkCursor = hasLogToday ? new Date(today) : new Date(yesterday);

  while (true) {
    const curStr = formatDate(checkCursor);
    const log = logDateMap.get(curStr);
    if (log && log.completionPercentage > 0) {
      currentStreak++;
      checkCursor.setDate(checkCursor.getDate() - 1);
    } else {
      break;
    }
  }

  // Compute perfect day streak
  let perfectCursor = (logDateMap.get(todayStr)?.isPerfectDay) ? new Date(today) : new Date(yesterday);
  while (true) {
    const curStr = formatDate(perfectCursor);
    const log = logDateMap.get(curStr);
    if (log && log.isPerfectDay) {
      perfectStreak++;
      perfectCursor.setDate(perfectCursor.getDate() - 1);
    } else {
      break;
    }
  }

  // 2. Level calculation
  let currentLevel = 1;
  let levelTitle = LEVEL_TITLES[0].title;
  let xpForCurrent = 0;
  let xpForNext = LEVEL_TITLES[1].xpReq;

  for (let i = LEVEL_TITLES.length - 1; i >= 0; i--) {
    if (totalXp >= LEVEL_TITLES[i].xpReq) {
      currentLevel = LEVEL_TITLES[i].level;
      levelTitle = LEVEL_TITLES[i].title;
      xpForCurrent = LEVEL_TITLES[i].xpReq;
      xpForNext = LEVEL_TITLES[i + 1]?.xpReq || LEVEL_TITLES[i].xpReq + 4000;
      break;
    }
  }

  const range = xpForNext - xpForCurrent;
  const progressInLevel = Math.min(100, Math.max(0, Math.round(((totalXp - xpForCurrent) / (range || 1)) * 100)));
  const xpToNextLevel = Math.max(0, xpForNext - totalXp);

  // 3. Badges computation
  const unlockedBadges: AchievementBadge[] = ALL_BADGES.map((badge) => {
    let progress = 0;
    switch (badge.id) {
      case 'first_step':
        progress = totalLoggedDays >= 1 ? 1 : 0;
        break;
      case 'water_streak_7':
        progress = Math.min(badge.maxProgress, totalWaterTargets);
        break;
      case 'dsa_50':
        progress = Math.min(badge.maxProgress, totalDsaQuestions);
        break;
      case 'workout_10':
        progress = Math.min(badge.maxProgress, totalWorkouts);
        break;
      case 'healthy_eating_7':
        progress = Math.min(badge.maxProgress, totalHealthyMeals);
        break;
      case 'sleep_rest_7':
        progress = Math.min(badge.maxProgress, totalGoodSleep);
        break;
      case 'streak_7':
        progress = Math.min(badge.maxProgress, currentStreak);
        break;
      case 'streak_30':
        progress = Math.min(badge.maxProgress, currentStreak);
        break;
      case 'perfect_week':
        progress = Math.min(badge.maxProgress, perfectDaysCount);
        break;
      case 'aiml_scholar':
        progress = Math.min(badge.maxProgress, totalAiMlSessions);
        break;
      case 'photo_journey':
        progress = Math.min(badge.maxProgress, totalPhotos);
        break;
      case 'mindful_soul':
        progress = Math.min(badge.maxProgress, totalJournals);
        break;
      case 'day_25_milestone':
        progress = Math.min(badge.maxProgress, maxDayReached);
        break;
      case 'day_50_milestone':
        progress = Math.min(badge.maxProgress, maxDayReached);
        break;
      case 'day_75_milestone':
        progress = Math.min(badge.maxProgress, maxDayReached);
        break;
      case 'day_100_milestone':
        progress = Math.min(badge.maxProgress, maxDayReached);
        break;
      default:
        progress = 0;
    }

    const isUnlocked = progress >= badge.maxProgress;
    return {
      ...badge,
      progress,
      unlockedAt: isUnlocked ? 'Unlocked' : undefined,
    };
  });

  return {
    totalXp,
    level: currentLevel,
    levelTitle,
    levelProgress: progressInLevel,
    xpToNextLevel,
    currentStreak,
    perfectStreak,
    totalLoggedDays,
    perfectDaysCount,
    unlockedBadges,
  };
}
