import React from 'react';
import { PomodoroTimer } from './PomodoroTimer';
import { TimeBlockPlanner } from './TimeBlockPlanner';
import { SubGoalTracker } from './SubGoalTracker';
import { WeeklyReviewModal } from './WeeklyReviewModal';

export const ProductivitySuite: React.FC = () => {
  return (
    <div className="space-y-6 pb-12">
      {/* 1. Pomodoro Focus Timer */}
      <PomodoroTimer />

      {/* 2. Sub-Goal Milestones */}
      <SubGoalTracker />

      {/* 3. Daily Time-Blocking Planner */}
      <TimeBlockPlanner />

      {/* 4. Sunday Weekly Review */}
      <WeeklyReviewModal />
    </div>
  );
};
