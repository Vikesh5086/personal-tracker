import { db, getAllDailyLogs, getProfile, getSubGoals, getTimeBlocks, getWeeklyReviews, saveProfile } from './db';
import { DailyLog, UserProfile, SubGoal, TimeBlock, WeeklyReview } from '../types';

export interface BackupPayload {
  version: number;
  exportedAt: string;
  profile?: UserProfile;
  dailyLogs: DailyLog[];
  subGoals: SubGoal[];
  timeBlocks: TimeBlock[];
  weeklyReviews: WeeklyReview[];
}

export async function exportAllDataJSON(): Promise<void> {
  const profile = await getProfile();
  const dailyLogs = await getAllDailyLogs();
  const subGoals = await getSubGoals();
  const timeBlocks = await getTimeBlocks('');
  const allTimeBlocks = await db.timeBlocks.toArray();
  const weeklyReviews = await getWeeklyReviews();

  const payload: BackupPayload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    profile,
    dailyLogs,
    subGoals,
    timeBlocks: allTimeBlocks,
    weeklyReviews,
  };

  const jsonString = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `100-day-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function importDataJSON(file: File): Promise<{ success: boolean; message: string }> {
  try {
    const text = await file.text();
    const data: BackupPayload = JSON.parse(text);

    if (!data.dailyLogs || !Array.isArray(data.dailyLogs)) {
      throw new Error('Invalid backup file structure: missing dailyLogs array');
    }

    if (data.profile) {
      await saveProfile(data.profile);
    }

    // Clear and restore daily logs
    await db.dailyLogs.clear();
    for (const log of data.dailyLogs) {
      await db.dailyLogs.put(log);
    }

    // Restore sub-goals
    if (data.subGoals && Array.isArray(data.subGoals)) {
      await db.subGoals.clear();
      for (const g of data.subGoals) {
        await db.subGoals.put(g);
      }
    }

    // Restore time blocks
    if (data.timeBlocks && Array.isArray(data.timeBlocks)) {
      await db.timeBlocks.clear();
      for (const tb of data.timeBlocks) {
        await db.timeBlocks.put(tb);
      }
    }

    // Restore weekly reviews
    if (data.weeklyReviews && Array.isArray(data.weeklyReviews)) {
      await db.weeklyReviews.clear();
      for (const wr of data.weeklyReviews) {
        await db.weeklyReviews.put(wr);
      }
    }

    return { success: true, message: `Successfully imported ${data.dailyLogs.length} daily logs!` };
  } catch (err: any) {
    console.error('Import error:', err);
    return { success: false, message: err?.message || 'Failed to parse JSON backup file.' };
  }
}

export async function exportDailyLogsCSV(): Promise<void> {
  const dailyLogs = await getAllDailyLogs();
  const sorted = [...dailyLogs].sort((a, b) => a.date.localeCompare(b.date));

  const headers = [
    'Date',
    'Day Number',
    'Completion %',
    'Perfect Day',
    'XP Earned',
    'DSA Questions',
    'DSA Topics',
    'DSA Difficulties',
    'Workout Type',
    'Workout Mins',
    'Eating Type',
    'AI/ML Topic',
    'AI/ML Mins',
    'Water Litres',
    'Sleep Hours',
    'Mood (1-5)',
    'Journal Note',
    'Priority 1',
    'Priority 2',
    'Priority 3',
  ];

  const escapeCSV = (str: string | number | undefined) => {
    if (str === undefined || str === null) return '""';
    const clean = String(str).replace(/"/g, '""');
    return `"${clean}"`;
  };

  const rows = sorted.map((l) => [
    escapeCSV(l.date),
    escapeCSV(l.dayNumber),
    escapeCSV(l.completionPercentage + '%'),
    escapeCSV(l.isPerfectDay ? 'Yes' : 'No'),
    escapeCSV(l.xpEarned),
    escapeCSV(l.dsa.questionsSolved),
    escapeCSV(l.dsa.topics.join(', ')),
    escapeCSV(l.dsa.difficulties.join(', ')),
    escapeCSV(l.workout.type),
    escapeCSV(l.workout.durationMinutes),
    escapeCSV(l.eating.type),
    escapeCSV(l.aiMl.topic),
    escapeCSV(l.aiMl.durationMinutes),
    escapeCSV(l.water.intakeLitres + 'L'),
    escapeCSV(l.sleep.durationHours + 'h'),
    escapeCSV(l.journal.mood),
    escapeCSV(l.journal.note || ''),
    escapeCSV(l.priorities.items[0]?.text || ''),
    escapeCSV(l.priorities.items[1]?.text || ''),
    escapeCSV(l.priorities.items[2]?.text || ''),
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `100-day-tracker-export-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
