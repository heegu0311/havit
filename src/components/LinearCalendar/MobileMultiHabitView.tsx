import { memo } from "react";
import {
  generateMonthData,
  MONTH_NAMES_SHORT,
  formatDate,
} from "@/utils/calendar";
import { Habit } from "@/hooks/useHabits";
import { HabitDate } from "@/hooks/useHabitDates";

interface MobileMultiHabitViewProps {
  year: number;
  habits: Habit[];
  datesMap: Map<string, HabitDate[]>;
}

function MobileMultiHabitViewComponent({
  year,
  habits,
  datesMap,
}: MobileMultiHabitViewProps) {
  // Helper to check if a date is selected for a habit
  const isDateSelected = (
    habitId: string,
    monthIndex: number,
    day: number
  ): boolean => {
    const dateKey = formatDate(year, monthIndex + 1, day);
    const habitDates = datesMap.get(habitId) || [];
    return habitDates.some((d) => d.date === dateKey);
  };

  // Get completion stats for a habit in a specific month
  const getMonthCompletionRate = (
    habitId: string,
    monthIndex: number
  ): number => {
    const monthDays = generateMonthData(monthIndex, year);
    const totalDays = monthDays.filter((d) => d !== null).length;
    const completedDays = monthDays.filter(
      (d) => d !== null && isDateSelected(habitId, monthIndex, d)
    ).length;

    return totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
  };

  if (habits.length === 0) {
    return (
      <div className="md:hidden text-center py-12 text-gray-500">
        No habits to display
      </div>
    );
  }

  return (
    <div className="md:hidden space-y-4">
      {MONTH_NAMES_SHORT.map((monthName, monthIndex) => {
        const monthDays = generateMonthData(monthIndex, year);

        return (
          <div
            key={monthIndex}
            className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
          >
            {/* Month header */}
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {monthName} {year}
              </h3>
            </div>

            {/* Habits list for this month */}
            <div className="p-4 space-y-3">
              {habits.map((habit) => {
                const completionRate = getMonthCompletionRate(
                  habit.id,
                  monthIndex
                );
                const monthDates = monthDays.filter((d) => d !== null);
                const completedDays = monthDates.filter((d) =>
                  isDateSelected(habit.id, monthIndex, d!)
                ).length;

                return (
                  <div
                    key={habit.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    {/* Color indicator */}
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: habit.color }}
                    />

                    {/* Habit info */}
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-medium truncate mb-1"
                        style={{ color: habit.color }}
                      >
                        {habit.title || "Habit"}
                      </p>

                      {/* Visual dots representation */}
                      <div className="flex items-center gap-1 flex-wrap">
                        {monthDays.slice(0, Math.min(monthDays.length, 31)).map((day, i) => {
                          if (day === null) return null;

                          const isSelected = isDateSelected(
                            habit.id,
                            monthIndex,
                            day
                          );

                          return (
                            <div
                              key={i}
                              className="w-1.5 h-1.5 rounded-full"
                              style={{
                                backgroundColor: isSelected
                                  ? habit.color
                                  : "#e5e7eb",
                              }}
                              title={`${monthName} ${day}`}
                            />
                          );
                        })}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-lg font-bold" style={{ color: habit.color }}>
                        {completionRate}%
                      </p>
                      <p className="text-xs text-gray-500">
                        {completedDays}/{monthDates.length}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export const MobileMultiHabitView = memo(MobileMultiHabitViewComponent);
