import { memo } from "react";

interface CalendarFooterProps {
  year: number;
  selectedDatesCount: number;
}

function CalendarFooterComponent({
  year,
  selectedDatesCount,
}: CalendarFooterProps) {
  return (
    <div className="mt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 gap-2">
      <span>Linear Calendar • {year} • 12 months • Habit Tracker</span>
      <span className="text-[var(--habit-color)]">
        {selectedDatesCount} {selectedDatesCount === 1 ? "day" : "days"}{" "}
        tracked • Make it a wonderful year
      </span>
    </div>
  );
}

export const CalendarFooter = memo(CalendarFooterComponent);
