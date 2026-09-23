import { db } from './db';
import { DailyLog, UserProfile, SubGoal } from '../types';

// Sample SVG data URLs for before & after transformation
const SAMPLE_PHOTO_BEFORE = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%231e293b"/><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-size="28" font-weight="bold" font-family="sans-serif">Day 1: The Beginning 🏋️‍♂️</text><text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" fill="%2364748b" font-size="16" font-family="sans-serif">Commitment made to 100 days of discipline</text></svg>';

const SAMPLE_PHOTO_AFTER = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%230f172a"/><circle cx="300" cy="180" r="90" fill="%236366f1" opacity="0.2"/><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" fill="%2338bdf8" font-size="28" font-weight="bold" font-family="sans-serif">Day 30: Noticeable Gains! 🔥</text><text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" fill="%23a5b4fc" font-size="16" font-family="sans-serif">+35 LeetCode • 25 Gym Sessions • Peak Energy</text></svg>';

export async function populateSampleJourneyData(todayStr: string) {
  // Set start date 30 days ago
  const today = new Date(todayStr + 'T00:00:00');
  const start = new Date(today);
  start.setDate(start.getDate() - 30);
  const startStr = start.toISOString().split('T')[0];

  const end = new Date(start);
  end.setDate(end.getDate() + 99);
  const endStr = end.toISOString().split('T')[0];

  const profile: UserProfile = {
    id: 'current_user',
    name: 'Alex Hunter',
    age: 24,
    height: '180 cm',
    weight: '75 kg',
    goal: 'Muscle gain',
    startDate: startStr,
    endDate: endStr,
    themeMode: 'dark',
    accentColor: 'indigo',
    onboardingCompleted: true,
    createdAt: startStr,
    updatedAt: new Date().toISOString(),
  };

  await db.profile.put(profile);

  // Generate 31 days of logs with rich variation
  const logs: DailyLog[] = [];
  const dsaTopics = ['Array', 'Two Pointers', 'DP', 'Graph', 'Tree', 'Sliding Window', 'Binary Search'];
  const workoutTypes = ['Strength only', 'Cardio only', 'Both', 'Rest day', 'Strength only'];
  const eatingTypes = ['Healthy', 'Healthy', 'Mixed', 'Healthy', 'Cheat meal'];
  const aiTopics = ['Transformers & Self-Attention', 'PyTorch Tensors', 'Diffusion Models', 'LangChain Agents', 'LoRA Fine-tuning', 'Vector Embeddings'];

  for (let i = 0; i <= 30; i++) {
    const curDate = new Date(start);
    curDate.setDate(curDate.getDate() + i);
    const dateStr = curDate.toISOString().split('T')[0];
    const dayNum = i + 1;

    // High consistency with occasional rest
    const isRest = i % 7 === 6;
    const isPerfect = !isRest && (i % 3 !== 0);

    const questionsSolved = isRest ? 0 : Math.floor(Math.random() * 4) + 1;
    const waterLitres = 2.0 + (Math.floor(Math.random() * 4) * 0.5);
    const sleepHours = 7.0 + (Math.floor(Math.random() * 4) * 0.5);

    let photoBase64 = '';
    if (dayNum === 1) photoBase64 = SAMPLE_PHOTO_BEFORE;
    if (dayNum === 31 || (i === 30)) photoBase64 = SAMPLE_PHOTO_AFTER;

    const log: DailyLog = {
      date: dateStr,
      dayNumber: dayNum,
      dsa: {
        completed: questionsSolved > 0,
        questionsSolved,
        topics: [dsaTopics[i % dsaTopics.length]],
        difficulties: ['Medium'],
        notes: questionsSolved > 0 ? 'Optimal solution using two pointers O(N) time O(1) space.' : '',
      },
      workout: {
        completed: !isRest,
        type: (workoutTypes[i % workoutTypes.length] as any),
        durationMinutes: isRest ? 0 : 50,
        notes: isRest ? 'Active recovery & foam rolling' : 'Heavy push day: Bench press 85kg 4x8, OHP 55kg 3x8',
      },
      eating: {
        completed: true,
        type: (eatingTypes[i % eatingTypes.length] as any),
        notes: 'High protein oatmeal, chicken rice bowl, Greek yogurt',
      },
      aiMl: {
        completed: questionsSolved > 0,
        topic: aiTopics[i % aiTopics.length],
        durationMinutes: 45,
        learnedNotes: 'Implemented scaled dot product attention equation from Scratch in PyTorch',
      },
      water: {
        completed: waterLitres >= 2.0,
        intakeLitres: waterLitres,
        targetLitres: 2.5,
      },
      sleep: {
        completed: sleepHours >= 7.0,
        bedTime: '23:00',
        wakeTime: '07:00',
        durationHours: sleepHours,
        quality: 'good',
      },
      photo: {
        completed: Boolean(photoBase64),
        photoBase64,
        caption: dayNum === 1 ? 'Day 1 starting physique' : 'Day 30 transformation update!',
      },
      journal: {
        completed: true,
        mood: (Math.min(5, Math.max(3, (i % 3) + 3)) as any),
        note: 'Feeling laser-focused. Routine is becoming automatic and effortless.',
      },
      priorities: {
        completed: true,
        items: [
          { id: 'p1', text: 'Solve 2 LeetCode problems', done: true },
          { id: 'p2', text: 'Hit upper body workout', done: true },
          { id: 'p3', text: 'Drink 2.5L water & review AI paper', done: true },
        ],
      },
      extras: {
        steps: 8500 + (i * 120),
        screenTimeMinutes: 45,
        readingBookTitle: 'Atomic Habits',
        readingMinutes: 25,
        meditationMinutes: 10,
        interviewMockDone: Math.floor(i / 10),
        interviewAppsSent: Math.floor(i / 5),
      },
      completionPercentage: isPerfect ? 100 : isRest ? 55 : 88,
      isPerfectDay: isPerfect,
      xpEarned: isPerfect ? 420 : 270,
      updatedAt: new Date().toISOString(),
    };

    logs.push(log);
  }

  // Put all logs
  await db.dailyLogs.clear();
  for (const l of logs) {
    await db.dailyLogs.put(l);
  }

  // Seed helpful SubGoals
  const subGoals: SubGoal[] = [
    {
      id: 'sg_1',
      title: '50 LeetCode Questions by Day 30',
      category: 'dsa',
      targetValue: 50,
      currentValue: 42,
      unit: 'questions',
      deadlineDay: 30,
      completed: false,
      createdAt: startStr,
    },
    {
      id: 'sg_2',
      title: '25 Gym Workouts by Day 40',
      category: 'workout',
      targetValue: 25,
      currentValue: 24,
      unit: 'workouts',
      deadlineDay: 40,
      completed: false,
      createdAt: startStr,
    },
  ];

  await db.subGoals.clear();
  for (const sg of subGoals) {
    await db.subGoals.put(sg);
  }
}
