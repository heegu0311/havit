import { memo } from "react";
import {
  DAY_NAMES_MONDAY,
  generateMonthData,
  getSelectedShapeClasses,
  MONTH_NAMES_SHORT,
} from "@/utils/calendar";
import { CalendarViewProps } from "./types";

const maxCells = 37;

function DesktopCalendarViewComponent({
  year,
  selectedDatesSet,
  onToggleDate,
  onInitializeMonth,
  isDateSelected,
}: CalendarViewProps) {
  return (
    <div className="hidden md:block">
      {/* Day headers */}
      <div className="flex mb-2">
        <div className="w-12 flex-shrink-0"></div>
        <div className="flex-1 grid grid-cols-37 gap-px">
          {Array.from({ length: maxCells }, (_, i) => {
            const dayIndex = i % 7;
            const isWeekend = dayIndex === 5 || dayIndex === 6;
            const textColor = isWeekend
              ? "text-[var(--habit-color)]"
              : "text-gray-500 md:text-gray-900";

            return (
              <div key={i} className={`text-center text-xs py-1 ${textColor}`}>
                <span className="lg:hidden">
                  {DAY_NAMES_MONDAY[dayIndex].slice(0, 1)}
                </span>
                <span className="hidden lg:inline">
                  {DAY_NAMES_MONDAY[dayIndex]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Month rows */}
      {MONTH_NAMES_SHORT.map((_, monthIndex) => {
        const monthDays = generateMonthData(monthIndex, year);

        return (
          <div
            key={monthIndex}
            className="flex items-center border-t border-gray-200 py-1"
          >
            {/* Month number */}
            <div
              className="w-12 flex-shrink-0 text-[var(--habit-color)] text-3xl pr-4 cursor-pointer hover:opacity-70 transition-opacity no-print-click"
              onClick={() => onInitializeMonth(monthIndex)}
              title={`Click to fill/clear all days in ${MONTH_NAMES_SHORT[monthIndex]}`}
            >
              {monthIndex + 1}
            </div>

            {/* Days grid */}
            <div className="flex-1 grid grid-cols-37 gap-px">
              {Array.from({ length: maxCells }, (_, i) => {
                const day = monthDays[i];
                const isWeekend = i % 7 >= 5;
                const isSelected = day
                  ? isDateSelected(monthIndex, day)
                  : false;

                const selectedShapeClasses = getSelectedShapeClasses(
                  monthDays,
                  monthIndex,
                  i,
                  maxCells,
                  isDateSelected,
                );

                const baseClickable = day
                  ? "cursor-pointer hover:bg-gray-100 transition-colors"
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
                    key={i}
                    onClick={() => day && onToggleDate(monthIndex, day)}
                    className={[
                      "flex justify-center items-center text-center min-w-2 min-h-7 w-full h-full text-sm",
                      baseClickable,
                      textColor,
                      isSelected ? "bg-[var(--habit-color)]" : "rounded-full",
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

      <style>{`
        .grid-cols-37 {
          display: grid;
          grid-template-columns: repeat(37, minmax(0, 1fr));
        }
      `}</style>
    </div>
  );
}

export const DesktopCalendarView = memo(DesktopCalendarViewComponent);
