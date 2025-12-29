import { useMemo } from 'react';
import { Habit } from './useHabits';
import { DEFAULT_HABIT_COLOR } from '@/constants/colors';

/**
 * Hook to get the current habit's color with memoization
 * Returns the habit's color or the default color if no habit is active
 */
export function useHabitColor(activeHabit: Habit | undefined): string {
  return useMemo(() => {
    return activeHabit?.color || DEFAULT_HABIT_COLOR;
  }, [activeHabit?.color]);
}
