import { memo, MutableRefObject } from "react";
import {
  getSelectedShapeClasses,
  generateMonthData,
  MONTH_NAMES_SHORT,
  DAY_NAMES_MONDAY,
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
  return (
    <div className="md:hidden space-y-6">
      {MONTH_NAMES_SHORT.map((month, monthIndex) => {
        const monthDays = generateMonthData(monthIndex, year);

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
                className="text-[#FF6B4A] text-3xl cursor-pointer hover:opacity-70 transition-opacity"
                onClick={() => onInitializeMonth(monthIndex)}
                title={`Click to fill/clear all days in ${month}`}
              >
                {monthIndex + 1}
              </span>
              <h3 className="text-gray-800 text-xl">{month}</h3>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAY_NAMES_MONDAY.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs text-gray-500 py-1"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-0.5">
              {monthDays.map((day, index) => {
                const isWeekend = index % 7 >= 5;
                const isSelected = day
                  ? isDateSelected(monthIndex, day)
                  : false;

                const selectedShapeClasses = getSelectedShapeClasses(
                  monthDays,
                  monthIndex,
                  index,
                  monthDays.length,
                  isDateSelected
                );

                const baseClickable = day
                  ? "cursor-pointer hover:bg-gray-100 transition-colors"
                  : "";

                const textColor = isSelected
                  ? "text-white"
                  : day
                    ? isWeekend
                      ? "text-[#FF6B4A]"
                      : "text-gray-700"
                    : "";

                return (
                  <button
                    key={index}
                    onClick={() => day && onToggleDate(monthIndex, day)}
                    className={[
                      "text-center py-3 text-sm",
                      baseClickable,
                      textColor,
                      isSelected ? "bg-[#FF6B4A]" : "rounded-full",
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
