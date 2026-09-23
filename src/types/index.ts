// Type definitions for 100-Day Tracker

export type GoalType = 'Weight loss' | 'Muscle gain' | 'General consistency' | 'Custom';

export type AccentColor = 'indigo' | 'purple' | 'emerald' | 'rose' | 'amber' | 'cyan' | 'blue';

export interface UserProfile {
  id?: string;
  name: string;
  age: number;
  height: string;
  weight: string;
  goal: GoalType;
  customGoalText?: string;
  profilePhoto?: string; // base64
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  themeMode: 'light' | 'dark';
  accentColor: AccentColor;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export type DsaDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface DsaHabit {
  completed: boolean;
  questionsSolved: number;
  topics: string[];
  difficulties: DsaDifficulty[];
  notes?: string;
}

export type WorkoutType = 'Cardio only' | 'Strength only' | 'Both' | 'Rest day' | 'None';

export interface WorkoutHabit {
  completed: boolean;
  type: WorkoutType;
  durationMinutes: number;
  notes?: string;
}

export type EatingType = 'Healthy' | 'Cheat meal' | 'Mixed' | 'None';

export interface EatingHabit {
  completed: boolean;
  type: EatingType;
  notes?: string;
}

export interface AiMlHabit {
  completed: boolean;
  topic: string;
  durationMinutes: number;
  learnedNotes?: string;
}

export interface WaterHabit {
  completed: boolean;
  intakeLitres: number;
  targetLitres: number;
}

export interface SleepHabit {
  completed: boolean;
  bedTime: string; // HH:mm
  wakeTime: string; // HH:mm
  durationHours: number;
  quality?: 'poor' | 'fair' | 'good' | 'excellent';
}

export interface PhotoHabit {
  completed: boolean;
  photoBase64?: string;
  caption?: string;
}

export type MoodValue = 1 | 2 | 3 | 4 | 5; // 😞 🙁 😐 🙂 😄

export interface JournalHabit {
  completed: boolean;
  mood: MoodValue;
  note?: string;
}

export interface PriorityItem {
  id: string;
  text: string;
  done: boolean;
}

export interface PrioritiesHabit {
  completed: boolean;
  items: [PriorityItem, PriorityItem, PriorityItem];
}

export interface ExtraHabits {
  screenTimeMinutes?: number;
  steps?: number;
  readingBookTitle?: string;
  readingMinutes?: number;
  meditationMinutes?: number;
  interviewMockDone?: number;
  interviewAppsSent?: number;
  interviewNotes?: string;
}

export type LearnedCategory =
  | 'Tech & Code'
  | 'Life & Wisdom'
  | 'Science & Trivia'
  | 'Health & Fitness'
  | 'Finance & Money'
  | 'Soft Skills'
  | 'General';

export interface LearnedNewThingHabit {
  completed: boolean;
  learnedSomething: boolean;
  takeaway: string;
  category: LearnedCategory;
  sourceUrl?: string;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD (primary key)
  dayNumber: number; // 1 to 100+
  dsa: DsaHabit;
  workout: WorkoutHabit;
  eating: EatingHabit;
  aiMl: AiMlHabit;
  water: WaterHabit;
  sleep: SleepHabit;
  photo: PhotoHabit;
  journal: JournalHabit;
  priorities: PrioritiesHabit;
  learnedNewThing?: LearnedNewThingHabit;
  extras?: ExtraHabits;
  completionPercentage: number; // 0 - 100
  isPerfectDay: boolean;
  xpEarned: number;
  updatedAt: string;
}

export interface SubGoal {
  id: string;
  title: string;
  category: 'dsa' | 'workout' | 'water' | 'reading' | 'custom';
  targetValue: number;
  currentValue: number;
  unit: string;
  deadlineDay: number;
  completed: boolean;
  createdAt: string;
}

export interface TimeBlock {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  task: string;
  category: 'dsa' | 'aiml' | 'workout' | 'reading' | 'work' | 'personal';
  completed: boolean;
}

export interface WeeklyReview {
  id: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  wins: string;
  improvements: string;
  rating: number; // 1 to 5
  createdAt: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streaks' | 'habits' | 'milestones' | 'dedication';
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface GamificationSummary {
  totalXp: number;
  level: number;
  levelTitle: string;
  levelProgress: number; // 0 - 100%
  xpToNextLevel: number;
  currentStreak: number;
  perfectStreak: number;
  totalLoggedDays: number;
  perfectDaysCount: number;
  unlockedBadges: AchievementBadge[];
}
