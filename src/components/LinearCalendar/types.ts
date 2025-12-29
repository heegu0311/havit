export interface CalendarViewProps {
  year: number;
  selectedDatesSet: Set<string>;
  onToggleDate: (monthIndex: number, day: number) => void;
  onInitializeMonth: (monthIndex: number) => void;
  isDateSelected: (monthIndex: number, day: number) => boolean;
}

export const AVAILABLE_YEARS = [2025, 2026];
export const MAX_HABITS = 5;
