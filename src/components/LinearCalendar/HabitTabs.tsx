import { memo, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Plus, X, LogOut, Palette, LayoutGrid } from "lucide-react";
import { Habit } from "@/hooks/useHabits";
import { ColorPicker } from "./ColorPicker";
import { ViewMode } from "@/hooks/useCalendarLogic";

interface HabitTabsProps {
  habits: Habit[];
  activeHabitId: string | null;
  viewMode: ViewMode;
  onSelectHabit: (id: string) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onAddHabit: () => void;
  onDeleteHabit: (id: string) => void;
  onSignOut: () => void;
  onColorChange: (habitId: string, color: string) => void;
  maxHabits: number;
}

function HabitTabsComponent({
  habits,
  activeHabitId,
  viewMode,
  onSelectHabit,
  onViewModeChange,
  onAddHabit,
  onDeleteHabit,
  onSignOut,
  onColorChange,
  maxHabits,
}: HabitTabsProps) {
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);
  const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 });
  const paletteRefs = useRef<{ [key: string]: SVGSVGElement | null }>({});

  return (
    <div className="sticky top-0 z-30 bg-white flex justify-between gap-4 items-center mb-2 print-hide overflow-x-auto scrollbar-hide pb-2">
      {/* Habit Tabs */}
      <div className="flex-1 flex items-center gap-2 border-b-1 border-gray-200">
        {/* All Habits Tab (Multi-view) */}
        <div
          onClick={() => onViewModeChange("multi")}
          className={`relative px-2 py-3 transition-all cursor-pointer flex items-center gap-2 ${
            viewMode === "multi"
              ? "border-b-2 border-gray-700 text-gray-700 -mb-[2px]"
              : "text-gray-500 hover:text-gray-700"
          }`}
          title="View all habits together"
        >
          <LayoutGrid className="w-4 h-4" />
          {/*<span className="whitespace-nowrap">Dashboard</span>*/}
        </div>

        {/* Individual Habit Tabs */}
        {habits.map((habit, index) => (
          <div
            key={habit.id}
            onClick={() => {
              onSelectHabit(habit.id);
              onViewModeChange("single");
            }}
            className={`relative px-4 py-3 transition-all cursor-pointer ${
              activeHabitId === habit.id && viewMode === "single"
                ? "border-b-2 -mb-[2px]"
                : "text-gray-500 hover:text-gray-700"
            }`}
            style={
              activeHabitId === habit.id && viewMode === "single"
                ? { color: habit.color, borderColor: habit.color }
                : { color: habit.color }
            }
          >
            <span className="flex items-center gap-2 whitespace-nowrap">
              {habit.title || `Habit ${index + 1}`}
              {activeHabitId === habit.id && viewMode === "single" && (
                <>
                  <Palette
                    ref={(el) => {
                      paletteRefs.current[habit.id] = el;
                    }}
                    className="w-4 h-4 hover:opacity-70 cursor-pointer transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();

                      if (showColorPicker === habit.id) {
                        setShowColorPicker(null);
                      } else {
                        // Calculate position
                        const rect =
                          paletteRefs.current[
                            habit.id
                          ]?.getBoundingClientRect();
                        if (rect) {
                          setPickerPosition({
                            top: rect.bottom + 8,
                            left: rect.left,
                          });
                        }
                        setShowColorPicker(habit.id);
                      }
                    }}
                  />
                  {habits.length > 1 && (
                    <X
                      className="w-4 h-4 hover:text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteHabit(habit.id);
                      }}
                    />
                  )}
                </>
              )}
            </span>
          </div>
        ))}
        {habits.length < maxHabits && (
          <button
            onClick={onAddHabit}
            className="px-4 py-3 text-gray-400 transition-colors"
            style={{
              color:
                habits.length > 0 && activeHabitId
                  ? habits.find((h) => h.id === activeHabitId)?.color
                  : "#FF6B4A",
            }}
            title="Add new habit"
          >
            <Plus className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Logout Button */}
      <button
        onClick={onSignOut}
        className="sticky right-0 bg-white flex items-center gap-2 px-4 py-2 border-0 border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-all duration-300"
        title="Sign out"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span className="text-sm hidden md:inline">Logout</span>
      </button>

      {/* Color Picker - Portal */}
      {showColorPicker &&
        createPortal(
          <>
            {/* Backdrop to close picker */}
            <div
              className="fixed inset-0 z-[9998]"
              onClick={() => setShowColorPicker(null)}
            />

            {/* Color Picker Dropdown */}
            <div
              className="fixed bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-[9999]"
              style={{
                top: `${pickerPosition.top}px`,
                left: `${pickerPosition.left}px`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-sm text-gray-600 mb-3 font-medium">
                Select color:
              </p>
              <ColorPicker
                selectedColor={
                  habits.find((h) => h.id === showColorPicker)?.color ||
                  "#FF6B4A"
                }
                usedColors={habits
                  .filter((h) => h.id !== showColorPicker)
                  .map((h) => h.color)}
                onColorChange={(color) => {
                  if (showColorPicker) {
                    onColorChange(showColorPicker, color);
                  }
                  setShowColorPicker(null);
                }}
              />
            </div>
          </>,
          document.body,
        )}
    </div>
  );
}

export const HabitTabs = memo(HabitTabsComponent);
