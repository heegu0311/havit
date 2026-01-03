import { memo } from "react";
import { Habit } from "@/hooks/useHabits";
import { HabitStats } from "@/utils/habitStats";

interface HabitStatsPanelProps {
  habits: Habit[];
  stats: HabitStats[];
  viewMode: "single" | "multi";
  onSwitchToHabit: (id: string) => void;
}

function HabitStatsPanelComponent({
  habits,
  stats,
  viewMode,
  onSwitchToHabit,
}: HabitStatsPanelProps) {
  // Only show in multi-habit view mode
  if (viewMode !== "multi" || habits.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 border-t border-gray-200 pt-4">
      <p className="text-sm text-gray-600 mb-3 font-medium">
        Habit Overview:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {habits.map((habit, index) => {
          const habitStat = stats.find((s) => s.habitId === habit.id);

          return (
            <div
              key={habit.id}
              onClick={() => onSwitchToHabit(habit.id)}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md hover:border-gray-400 transition-all cursor-pointer"
              title={`Click to view ${habit.title || `Habit ${index + 1}`}`}
            >
              {/* Color indicator */}
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: habit.color }}
                aria-label={`${habit.title} color indicator`}
              />

              {/* Habit info */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-medium truncate mb-1"
                  style={{ color: habit.color }}
                  title={habit.title || `Habit ${index + 1}`}
                >
                  {habit.title || `Habit ${index + 1}`}
                </p>

                <div className="flex items-center gap-3 text-xs text-gray-600">
                  {/* Completion rate */}
                  <span className="flex items-center gap-1">
                    <span className="font-semibold">
                      {habitStat?.completionRate.toFixed(1) || 0}%
                    </span>
                  </span>

                  {/* Divider */}
                  <span className="text-gray-300">|</span>

                  {/* Streak */}
                  <span className="flex items-center gap-1">
                    <span className="font-semibold">
                      {habitStat?.currentStreak || 0}
                    </span>
                    <span>day streak</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const HabitStatsPanel = memo(HabitStatsPanelComponent);
