/**
 * Utility functions for calculating habit statistics
 */

/**
 * Get the number of eligible days from the start of the year to today
 * (or 2 days ago, whichever is earlier based on the app's recordable range)
 */
export function getEligibleDaysCount(year: number): number {
  const today = new Date();
  const currentYear = today.getFullYear();

  // If the year is in the future, return 0
  if (year > currentYear) {
    return 0;
  }

  const startOfYear = new Date(year, 0, 1);

  // For current year, count from Jan 1 to today
  // For past years, count all 365/366 days
  let endDate: Date;
  if (year === currentYear) {
    endDate = today;
  } else {
    // Last day of the year
    endDate = new Date(year, 11, 31);
  }

  // Calculate days difference
  const diffTime = endDate.getTime() - startOfYear.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include start day

  return Math.max(0, diffDays);
}

/**
 * Calculate completion rate as a percentage
 * @param dates - Array of completed date strings (YYYY-MM-DD format)
 * @param year - The year to calculate for
 * @returns Completion rate as a percentage (0-100)
 */
export function calculateCompletionRate(dates: string[], year: number): number {
  const eligibleDays = getEligibleDaysCount(year);

  if (eligibleDays === 0) {
    return 0;
  }

  // Filter dates that belong to the specified year
  const yearDates = dates.filter((date) => {
    const dateYear = parseInt(date.split("-")[0], 10);
    return dateYear === year;
  });

  const completedDays = yearDates.length;
  const rate = (completedDays / eligibleDays) * 100;

  // Round to 1 decimal place
  return Math.round(rate * 10) / 10;
}

/**
 * Calculate the current streak (consecutive days from today backward)
 * @param dates - Array of completed date strings (YYYY-MM-DD format), should be sorted
 * @returns Current streak count
 */
export function calculateCurrentStreak(dates: string[]): number {
  if (dates.length === 0) {
    return 0;
  }

  // Sort dates in descending order (newest first)
  const sortedDates = [...dates].sort((a, b) => b.localeCompare(a));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Helper function to format date as YYYY-MM-DD
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const todayStr = formatDate(today);
  const yesterdayStr = formatDate(yesterday);

  // Check if today or yesterday is completed (streak is active)
  const latestDate = sortedDates[0];
  if (latestDate !== todayStr && latestDate !== yesterdayStr) {
    // Streak is broken
    return 0;
  }

  // Count consecutive days backward
  let streak = 0;
  let currentDate = new Date(today);

  // Start from today or yesterday depending on which one is the latest completion
  if (latestDate === yesterdayStr) {
    currentDate = yesterday;
  }

  const dateSet = new Set(sortedDates);

  // Count backward
  while (true) {
    const currentDateStr = formatDate(currentDate);

    if (dateSet.has(currentDateStr)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Calculate stats for a single habit
 */
export interface HabitStats {
  habitId: string;
  completionRate: number;
  currentStreak: number;
  totalCompletedDays: number;
}

export function calculateHabitStats(
  habitId: string,
  dates: string[],
  year: number,
): HabitStats {
  return {
    habitId,
    completionRate: calculateCompletionRate(dates, year),
    currentStreak: calculateCurrentStreak(dates),
    totalCompletedDays: dates.length,
  };
}
