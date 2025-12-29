import { memo } from "react";
import { Plus, X, LogOut } from "lucide-react";
import { Habit } from "@/hooks/useHabits";

interface HabitTabsProps {
  habits: Habit[];
  activeHabitId: string | null;
  onSelectHabit: (id: string) => void;
  onAddHabit: () => void;
  onDeleteHabit: (id: string) => void;
  onSignOut: () => void;
  maxHabits: number;
}

function HabitTabsComponent({
  habits,
  activeHabitId,
  onSelectHabit,
  onAddHabit,
  onDeleteHabit,
  onSignOut,
  maxHabits,
}: HabitTabsProps) {
  return (
    <div className="flex justify-between gap-4 items-center mb-6 md:mb-10 print-hide">
      {/* Habit Tabs */}
      <div className="flex-1 flex items-center gap-2 border-b-1 border-gray-200 overflow-x-auto overflow-y-hidden">
        {habits.map((habit, index) => (
          <button
            key={habit.id}
            onClick={() => onSelectHabit(habit.id)}
            className={`relative px-6 py-3 transition-all ${
              activeHabitId === habit.id
                ? "text-[#FF6B4A] border-b-2 border-[#FF6B4A] -mb-[2px]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span className="flex items-center gap-2 whitespace-nowrap">
              {habit.title || `Habit ${index + 1}`}
              {habits.length > 1 && activeHabitId === habit.id && (
                <X
                  className="w-4 h-4 hover:text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteHabit(habit.id);
                  }}
                />
              )}
            </span>
          </button>
        ))}
        {habits.length < maxHabits && (
          <button
            onClick={onAddHabit}
            className="px-4 py-3 text-gray-400 hover:text-[#FF6B4A] transition-colors"
            title="Add new habit"
          >
            <Plus className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Logout Button */}
      <button
        onClick={onSignOut}
        className="flex items-center gap-2 px-4 py-2 border-0 border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-all duration-300"
        title="로그아웃"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span className="text-sm hidden md:inline">Logout</span>
      </button>
    </div>
  );
}

export const HabitTabs = memo(HabitTabsComponent);
