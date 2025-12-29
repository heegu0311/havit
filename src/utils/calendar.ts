/**
 * Get number of days in a month
 */
export function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Get first day of month (Monday = 0, Sunday = 6)
 * Converts from JavaScript's Sunday=0 to Monday=0
 */
export function getFirstDayOfMonth(month: number, year: number): number {
  const day = new Date(year, month, 1).getDay();
  // Convert to Monday = 0, Sunday = 6
  return day === 0 ? 6 : day - 1;
}

/**
 * Get first day of month (Sunday = 0, Saturday = 6)
 * Used by Calendar2026.tsx and MonthCalendar.tsx
 */
export function getFirstDayOfMonthSunday(month: number, year: number): number {
  return new Date(year, month, 1).getDay();
}

/**
 * Generate month data with null padding for empty cells
 * Monday-based week (Monday = 0)
 */
export function generateMonthData(monthIndex: number, year: number): (number | null)[] {
  const daysInMonth = getDaysInMonth(monthIndex, year);
  const firstDay = getFirstDayOfMonth(monthIndex, year);
  const days: (number | null)[] = [];

  // Add empty cells before the first day
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  return days;
}

/**
 * Generate month data with null padding (Sunday-based)
 * Used by Calendar2026.tsx and MonthCalendar.tsx
 */
export function generateMonthDataSunday(monthIndex: number, year: number): (number | null)[] {
  const daysInMonth = getDaysInMonth(monthIndex, year);
  const firstDay = getFirstDayOfMonthSunday(monthIndex, year);
  const days: (number | null)[] = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  return days;
}

/**
 * Format date as YYYY-MM-DD
 */
export function formatDate(year: number, month: number, day: number): string {
  const monthStr = String(month).padStart(2, "0");
  const dayStr = String(day).padStart(2, "0");
  return `${year}-${monthStr}-${dayStr}`;
}

/**
 * Month names (short)
 */
export const MONTH_NAMES_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * Day names (Monday first)
 */
export const DAY_NAMES_MONDAY = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/**
 * Day names (Sunday first)
 */
export const DAY_NAMES_SUNDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const getSelectedShapeClasses = (
  monthDays: (number | null)[],
  monthIndex: number,
  cellIndex: number,
  maxCells: number,
  isDateSelected: (monthIndex: number, day: number) => boolean,
) => {
  const day = monthDays[cellIndex];
  if (!day) return "";

  const isSelected = isDateSelected(monthIndex, day);

  if (!isSelected) return "";

  const prevDay = cellIndex > 0 ? monthDays[cellIndex - 1] : null;
  const nextDay = cellIndex < maxCells - 1 ? monthDays[cellIndex + 1] : null;

  const isPrevSelected = prevDay != null && isDateSelected(monthIndex, prevDay);
  const isNextSelected = nextDay != null && isDateSelected(monthIndex, nextDay);

  if (!isPrevSelected && !isNextSelected) {
    return "rounded-full";
  }
  if (!isPrevSelected && isNextSelected) {
    return "rounded-l-full";
  }
  if (isPrevSelected && !isNextSelected) {
    return "rounded-r-full";
  }
  return "rounded-none";
};
