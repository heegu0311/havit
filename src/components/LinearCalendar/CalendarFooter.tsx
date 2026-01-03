import { memo } from "react";

interface CalendarFooterProps {
  year: number;
  selectedDatesCount: number;
  viewMode?: "single" | "multi";
  habitCount?: number;
  totalDatesCount?: number;
}

function CalendarFooterComponent({
  year,
  selectedDatesCount,
  viewMode = "single",
  habitCount = 1,
  totalDatesCount = 0,
}: CalendarFooterProps) {
  return (
    <div className="mt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 gap-2">
      <span className="text-center">Habit Tracker • {year} • 12 months</span>

      {viewMode === "single" ? (
        <span className="text-[var(--habit-color)]">
          {selectedDatesCount} {selectedDatesCount === 1 ? "day" : "days"} tracked
          • Make it a wonderful year
        </span>
      ) : (
        <span className="text-gray-700">
          {totalDatesCount} {totalDatesCount === 1 ? "day" : "days"} tracked across{" "}
          {habitCount} {habitCount === 1 ? "habit" : "habits"}
          • Keep building your habits
        </span>
      )}
    </div>
  );
}

export const CalendarFooter = memo(CalendarFooterComponent);
