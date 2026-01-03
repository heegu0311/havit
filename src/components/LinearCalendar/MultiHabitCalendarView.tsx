import { memo } from "react";
import {
  DAY_NAMES_MONDAY,
  generateMonthData,
  MONTH_NAMES_SHORT,
  formatDate,
} from "@/utils/calendar";
import { Habit } from "@/hooks/useHabits";
import { HabitDate } from "@/hooks/useHabitDates";

const maxCells = 37;

interface MultiHabitCalendarViewProps {
  year: number;
  habits: Habit[];
  datesMap: Map<string, HabitDate[]>;
}

function MultiHabitCalendarViewComponent({
  year,
  habits,
  datesMap,
}: MultiHabitCalendarViewProps) {
  // Helper to check if a date is selected for a habit
  const isDateSelected = (
    habitId: string,
    monthIndex: number,
    day: number,
  ): boolean => {
    const dateKey = formatDate(year, monthIndex + 1, day);
    const habitDates = datesMap.get(habitId) || [];
    return habitDates.some((d) => d.date === dateKey);
  };

  if (habits.length === 0) {
    return (
      <div className="hidden md:block text-center py-12 text-gray-500">
        No habits to display
      </div>
    );
  }

  return (
    <div className="hidden md:block">
      {/* Day headers */}
      <div className="flex mb-2">
        <div className="w-12 flex-shrink-0"></div>
        <div className="flex-1 grid grid-cols-37 gap-px">
          {Array.from({ length: maxCells }, (_, i) => {
            const dayIndex = i % 7;
            const isWeekend = dayIndex === 5 || dayIndex === 6;

            return (
              <div
                key={i}
                className={`text-center text-xs py-1 ${
                  isWeekend ? "text-gray-700" : "text-gray-500 md:text-gray-900"
                }`}
              >
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

      {/* Month rows with multiple habit mini-rows */}
      {MONTH_NAMES_SHORT.map((_, monthIndex) => {
        const monthDays = generateMonthData(monthIndex, year);

        return (
          <div key={monthIndex} className="flex border-t border-gray-200 py-1">
            {/* Month number - spans all habit rows */}
            <div className="w-12 flex-shrink-0 text-gray-700 text-3xl pr-4 flex items-center justify-center">
              {monthIndex + 1}
            </div>

            {/* Habit rows container */}
            <div className="flex-1 flex flex-col gap-px">
              {habits.map((habit) => (
                <div key={habit.id} className="grid grid-cols-37 gap-px">
                  {Array.from({ length: maxCells }, (_, i) => {
                    const day = monthDays[i];
                    const isSelected = day
                      ? isDateSelected(habit.id, monthIndex, day)
                      : false;

                    return (
                      <div key={i} className="flex justify-center items-center">
                        {day && isSelected && (
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: habit.color }}
                            title={`${habit.title || "Habit"} - ${MONTH_NAMES_SHORT[monthIndex]} ${day}`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
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

export const MultiHabitCalendarView = memo(MultiHabitCalendarViewComponent);
