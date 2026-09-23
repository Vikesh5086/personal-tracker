import Dexie, { type Table } from 'dexie';
import { UserProfile, DailyLog, SubGoal, TimeBlock, WeeklyReview } from '../types';

export class HabitTrackerDB extends Dexie {
  profile!: Table<UserProfile, string>;
  dailyLogs!: Table<DailyLog, string>;
  subGoals!: Table<SubGoal, string>;
  timeBlocks!: Table<TimeBlock, string>;
  weeklyReviews!: Table<WeeklyReview, string>;

  constructor() {
    super('100DayTrackerDB');
    this.version(1).stores({
      profile: 'id',
      dailyLogs: 'date, dayNumber, isPerfectDay, updatedAt',
      subGoals: 'id, category, completed',
      timeBlocks: 'id, date, category',
      weeklyReviews: 'id, weekNumber',
    });
  }
}

export const db = new HabitTrackerDB();

// Helper to create an empty day template
export function createEmptyDailyLog(date: string, dayNumber: number): DailyLog {
  return {
    date,
    dayNumber,
    dsa: {
      completed: false,
      questionsSolved: 0,
      topics: [],
      difficulties: [],
      notes: '',
    },
    workout: {
      completed: false,
      type: 'None',
      durationMinutes: 0,
      notes: '',
    },
    eating: {
      completed: false,
      type: 'None',
      notes: '',
    },
    aiMl: {
      completed: false,
      topic: '',
      durationMinutes: 0,
      learnedNotes: '',
    },
    water: {
      completed: false,
      intakeLitres: 0,
      targetLitres: 2.5,
    },
    sleep: {
      completed: false,
      bedTime: '23:00',
      wakeTime: '07:00',
      durationHours: 8,
      quality: 'good',
    },
    photo: {
      completed: false,
      photoBase64: '',
      caption: '',
    },
    journal: {
      completed: false,
      mood: 4,
      note: '',
    },
    priorities: {
      completed: false,
      items: [
        { id: 'p1', text: '', done: false },
        { id: 'p2', text: '', done: false },
        { id: 'p3', text: '', done: false },
      ],
    },
    learnedNewThing: {
      completed: false,
      learnedSomething: false,
      takeaway: '',
      category: 'Tech & Code',
      sourceUrl: '',
    },
    extras: {
      screenTimeMinutes: 0,
      steps: 0,
      readingBookTitle: '',
      readingMinutes: 0,
      meditationMinutes: 0,
      interviewMockDone: 0,
      interviewAppsSent: 0,
      interviewNotes: '',
    },
    completionPercentage: 0,
    isPerfectDay: false,
    xpEarned: 0,
    updatedAt: new Date().toISOString(),
  };
}

// Compute completion & XP for a log
export function evaluateLogCompletion(log: DailyLog): {
  percentage: number;
  completedCount: number;
  isPerfectDay: boolean;
  xp: number;
} {
  let count = 0;
  const totalCoreSections = 10;

  // 1. DSA (Questions solved > 0 or explicitly completed)
  if (log.dsa.questionsSolved > 0 || log.dsa.completed) count++;

  // 2. Workout (Valid workout type selected and not marked incomplete)
  if (log.workout.type && log.workout.type !== 'None' && log.workout.completed !== false) count++;

  // 3. Eating (Valid meal type selected and not marked incomplete)
  if (log.eating.type && log.eating.type !== 'None' && log.eating.completed !== false) count++;

  // 4. AI/ML (Topic entered or explicitly completed)
  if ((log.aiMl.topic && log.aiMl.topic.trim().length > 0) || log.aiMl.completed) count++;

  // 5. Water (Water intake > 0 and logged)
  if (log.water.intakeLitres > 0 && (log.water.completed || log.water.intakeLitres >= 0.25)) count++;

  // 6. Sleep (Only counted if user confirms/completes sleep)
  if (log.sleep.completed) count++;

  // 7. Photo (Photo uploaded or marked complete)
  if ((log.photo.photoBase64 && log.photo.photoBase64.length > 0) || log.photo.completed) count++;

  // 8. Journal (Reflection note entered or marked complete)
  if ((log.journal.note && log.journal.note.trim().length > 0) || log.journal.completed) count++;

  // 9. Priorities (At least one priority item with text is checked done)
  const hasPriorities = log.priorities.items.some(p => p.text.trim().length > 0 && p.done);
  if (hasPriorities || (log.priorities.completed && log.priorities.items.some(p => p.done))) count++;

  // 10. Learned Something New Today (Insight confirmed or takeaway noted)
  const hasLearned = Boolean((log.learnedNewThing?.takeaway && log.learnedNewThing.takeaway.trim().length > 0) || log.learnedNewThing?.learnedSomething);
  if (hasLearned || log.learnedNewThing?.completed) count++;

  const percentage = Math.round((count / totalCoreSections) * 100);
  const isPerfectDay = count === totalCoreSections;

  // Base 30 XP per completed habit + 150 XP bonus for perfect day
  let xp = count * 30;
  if (isPerfectDay) {
    xp += 150;
  }

  // Bonus for extras
  if (log.extras) {
    if (log.extras.steps && log.extras.steps >= 8000) xp += 20;
    if (log.extras.readingMinutes && log.extras.readingMinutes >= 20) xp += 20;
    if (log.extras.meditationMinutes && log.extras.meditationMinutes >= 10) xp += 20;
  }

  return { percentage, completedCount: count, isPerfectDay, xp };
}

// Profile API
export async function getProfile(): Promise<UserProfile | undefined> {
  const profile = await db.profile.get('current_user');
  return profile;
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  await db.profile.put({ ...profile, id: 'current_user' });
}

// Daily Logs API
export async function getDailyLog(date: string): Promise<DailyLog | undefined> {
  return await db.dailyLogs.get(date);
}

export async function saveDailyLog(log: DailyLog): Promise<void> {
  const evalResult = evaluateLogCompletion(log);
  const updated: DailyLog = {
    ...log,
    completionPercentage: evalResult.percentage,
    isPerfectDay: evalResult.isPerfectDay,
    xpEarned: evalResult.xp,
    updatedAt: new Date().toISOString(),
  };
  await db.dailyLogs.put(updated);
}

export async function getAllDailyLogs(): Promise<DailyLog[]> {
  return await db.dailyLogs.toArray();
}

// Sub-Goals API
export async function getSubGoals(): Promise<SubGoal[]> {
  return await db.subGoals.toArray();
}

export async function saveSubGoal(goal: SubGoal): Promise<void> {
  await db.subGoals.put(goal);
}

export async function deleteSubGoal(id: string): Promise<void> {
  await db.subGoals.delete(id);
}

// Time Blocks API
export async function getTimeBlocks(date: string): Promise<TimeBlock[]> {
  return await db.timeBlocks.where('date').equals(date).toArray();
}

export async function saveTimeBlock(block: TimeBlock): Promise<void> {
  await db.timeBlocks.put(block);
}

export async function deleteTimeBlock(id: string): Promise<void> {
  await db.timeBlocks.delete(id);
}

// Weekly Reviews API
export async function getWeeklyReviews(): Promise<WeeklyReview[]> {
  return await db.weeklyReviews.toArray();
}

export async function saveWeeklyReview(review: WeeklyReview): Promise<void> {
  await db.weeklyReviews.put(review);
}

// Clear all data
export async function clearAllDatabaseData(): Promise<void> {
  await db.profile.clear();
  await db.dailyLogs.clear();
  await db.subGoals.clear();
  await db.timeBlocks.clear();
  await db.weeklyReviews.clear();
}
