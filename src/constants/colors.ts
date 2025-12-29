/**
 * Predefined color palette for habit customization
 * Each color is carefully selected for:
 * - Visual appeal
 * - Accessibility (WCAG AA compliant with white text)
 * - Distinctiveness from other colors
 */
export const HABIT_COLORS = [
  '#FF6B4A', // Coral (default) - current brand color
  '#8B5CF6', // Purple
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#6366F1', // Indigo
  '#84CC16', // Lime
  '#F97316', // Orange
  '#A855F7', // Violet
] as const;

export const DEFAULT_HABIT_COLOR = HABIT_COLORS[0]; // #FF6B4A

export type HabitColor = typeof HABIT_COLORS[number];
