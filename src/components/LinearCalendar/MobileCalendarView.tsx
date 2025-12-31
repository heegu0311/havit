import { memo, MutableRefObject } from "react";
import {
  getSelectedShapeClasses,
  generateMonthDataSunday,
  MONTH_NAMES_SHORT,
  DAY_NAMES_SUNDAY,
} from "@/utils/calendar";

interface MobileCalendarViewProps {
  year: number;
  selectedDatesSet: Set<string>;
  onToggleDate: (monthIndex: number, day: number) => void;
  onInitializeMonth: (monthIndex: number) => void;
  isDateSelected: (monthIndex: number, day: number) => boolean;
  monthRefs: MutableRefObject<(HTMLDivElement | null)[]>;
}

function MobileCalendarViewComponent({
  year,
  selectedDatesSet,
  onToggleDate,
  onInitializeMonth,
  isDateSelected,
  monthRefs,
}: MobileCalendarViewProps) {
  // Helper function to check if a date is within allowed range (2 days ago to today)
  const isDateInAllowedRange = (monthIndex: number, day: number): boolean => {
    const today = new Date();
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 2);

    const targetDate = new Date(year, monthIndex, day);

    // Reset time to compare only dates
    today.setHours(23, 59, 59, 999);
    twoDaysAgo.setHours(0, 0, 0, 0);
    targetDate.setHours(12, 0, 0, 0);

    return targetDate >= twoDaysAgo && targetDate <= today;
  };

  return (
    <div className="md:hidden space-y-6">
      {MONTH_NAMES_SHORT.map((month, monthIndex) => {
        const monthDays = generateMonthDataSunday(monthIndex, year);

        return (
          <div
            key={monthIndex}
            ref={(el) => {
              monthRefs.current[monthIndex] = el;
            }}
            className="border border-gray-200 rounded-lg p-4"
          >
            {/* Month name and number */}
            <div className="flex items-center gap-3 mb-4">
              <span
                className="text-[var(--habit-color)] text-3xl cursor-pointer hover:opacity-70 transition-opacity"
                onClick={() => onInitializeMonth(monthIndex)}
                title={`Click to fill/clear all days in ${month}`}
              >
                {monthIndex + 1}
              </span>
              <h3 className="text-gray-800 text-xl">{month}</h3>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAY_NAMES_SUNDAY.map((day, dayIndex) => {
                const isWeekend = dayIndex === 0 || dayIndex === 6;
                const textColor = isWeekend
                  ? "text-[var(--habit-color)]"
                  : "text-gray-500";

                return (
                  <div
                    key={day}
                    className={`text-center text-xs py-1 ${textColor}`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-0.5">
              {monthDays.map((day, index) => {
                const isWeekend = index % 7 === 0 || index % 7 === 6;
                const isSelected = day
                  ? isDateSelected(monthIndex, day)
                  : false;
                const isAllowed = day ? isDateInAllowedRange(monthIndex, day) : false;

                const selectedShapeClasses = getSelectedShapeClasses(
                  monthDays,
                  monthIndex,
                  index,
                  monthDays.length,
                  isDateSelected,
                );

                const baseClickable = day && isAllowed
                  ? "cursor-pointer hover:bg-gray-100 transition-colors"
                  : "";

                const selectableBorder = day && isAllowed && !isSelected
                  ? "border border-dashed border-gray-300"
                  : "";

                const textColor = isSelected
                  ? "text-white"
                  : day
                    ? isWeekend
                      ? "text-[var(--habit-color)]"
                      : "text-gray-700"
                    : "";

                return (
                  <button
                    key={index}
                    onClick={() => day && isAllowed && onToggleDate(monthIndex, day)}
                    disabled={day ? !isAllowed : true}
                    className={[
                      "text-center py-3 text-sm",
                      baseClickable,
                      textColor,
                      isSelected ? "bg-[var(--habit-color)]" : "rounded-full",
                      selectableBorder,
                      selectedShapeClasses,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {day || ""}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export const MobileCalendarView = memo(MobileCalendarViewComponent);
