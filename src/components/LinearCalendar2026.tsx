import { Smile, Plus, X, Download } from "lucide-react";
import { useState, useEffect } from "react";

interface Habit {
  id: string;
  title: string;
  selectedDates: string[];
}

export function LinearCalendar2026() {
  const year = 2026;
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthsShort = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // State to manage multiple habits
  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
      const saved = localStorage.getItem("habit-tracker-2026-habits");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error("Error loading habits from localStorage:", error);
    }
    // Default: one empty habit
    return [{ id: "1", title: "", selectedDates: [] }];
  });

  const [activeHabitId, setActiveHabitId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem("habit-tracker-2026-active");
      return saved || "1";
    } catch (error) {
      console.error("Error loading active habit:", error);
      return "1";
    }
  });

  // Save habits to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("habit-tracker-2026-habits", JSON.stringify(habits));
    } catch (error) {
      console.error("Error saving habits to localStorage:", error);
    }
  }, [habits]);

  // Save active habit to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("habit-tracker-2026-active", activeHabitId);
    } catch (error) {
      console.error("Error saving active habit to localStorage:", error);
    }
  }, [activeHabitId]);

  // Get current active habit
  const activeHabit = habits.find((h) => h.id === activeHabitId) || habits[0];
  const selectedDates = new Set(activeHabit.selectedDates);

  // Update habit title
  const updateHabitTitle = (title: string) => {
    setHabits(
      habits.map((h) => (h.id === activeHabitId ? { ...h, title } : h)),
    );
  };

  // Add new habit
  const addHabit = () => {
    if (habits.length >= 3) return;
    const newHabit: Habit = {
      id: Date.now().toString(),
      title: "",
      selectedDates: [],
    };
    setHabits([...habits, newHabit]);
    setActiveHabitId(newHabit.id);
  };

  // Delete habit
  const deleteHabit = (id: string) => {
    if (habits.length <= 1) return; // Keep at least one habit
    const newHabits = habits.filter((h) => h.id !== id);
    setHabits(newHabits);
    if (activeHabitId === id) {
      setActiveHabitId(newHabits[0].id);
    }
  };

  // Toggle date selection
  const toggleDate = (monthIndex: number, day: number) => {
    const dateKey = `${year}-${monthIndex}-${day}`;
    const currentDates = activeHabit.selectedDates;
    const newDates = currentDates.includes(dateKey)
      ? currentDates.filter((d) => d !== dateKey)
      : [...currentDates, dateKey];

    setHabits(
      habits.map((h) =>
        h.id === activeHabitId ? { ...h, selectedDates: newDates } : h,
      ),
    );
  };

  // Check if a date is selected
  const isDateSelected = (monthIndex: number, day: number) => {
    return selectedDates.has(`${year}-${monthIndex}-${day}`);
  };

  // Initialize entire month (fill all dates for a month)
  const initializeMonth = (monthIndex: number) => {
    const daysInMonth = getDaysInMonth(monthIndex, year);
    const currentDates = activeHabit.selectedDates;

    // Check if all days in this month are already selected
    const monthDates = Array.from(
      { length: daysInMonth },
      (_, i) => `${year}-${monthIndex}-${i + 1}`,
    );
    const allSelected = monthDates.every((date) => currentDates.includes(date));

    let newDates;
    if (allSelected) {
      // If all selected, deselect all days in this month
      newDates = currentDates.filter((date) => {
        const [y, m] = date.split("-").map(Number);
        return !(y === year && m === monthIndex);
      });
    } else {
      // Otherwise, select all days in this month
      const datesToAdd = monthDates.filter(
        (date) => !currentDates.includes(date),
      );
      newDates = [...currentDates, ...datesToAdd];
    }

    setHabits(
      habits.map((h) =>
        h.id === activeHabitId ? { ...h, selectedDates: newDates } : h,
      ),
    );
  };

  // Export to PDF
  const exportToPDF = () => {
    window.print();
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    // Get day of week (0 = Sunday, 1 = Monday, etc.)
    const day = new Date(year, month, 1).getDay();
    // Convert to Monday = 0, Sunday = 6
    return day === 0 ? 6 : day - 1;
  };

  // Generate all days for each month with proper positioning
  const generateMonthData = (monthIndex: number) => {
    const daysInMonth = getDaysInMonth(monthIndex, year);
    const firstDay = getFirstDayOfMonth(monthIndex, year);
    const days = [];

    // Add empty cells before the first day
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  // Calculate max cells needed (31 days + max 6 offset days)
  const maxCells = 37;

  return (
    <div className="max-w-[1600px] mx-auto bg-white rounded-lg shadow-lg p-6">
      {/* Habit Tabs */}
      <div className="mb-6 flex items-center gap-2 border-b-2 border-gray-200">
        {habits.map((habit, index) => (
          <button
            key={habit.id}
            onClick={() => setActiveHabitId(habit.id)}
            className={`relative px-6 py-3 transition-all ${
              activeHabitId === habit.id
                ? "text-[#FF6B4A] border-b-2 border-[#FF6B4A] -mb-[2px]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span className="flex items-center gap-2">
              {habit.title || `Habit ${index + 1}`}
              {habits.length > 1 && activeHabitId === habit.id && (
                <X
                  className="w-4 h-4 hover:text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteHabit(habit.id);
                  }}
                />
              )}
            </span>
          </button>
        ))}
        {habits.length < 3 && (
          <button
            onClick={addHabit}
            className="px-4 py-3 text-gray-400 hover:text-[#FF6B4A] transition-colors"
            title="Add new habit"
          >
            <Plus className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Habit Title Input */}
      <div className="mb-6">
        <input
          type="text"
          value={activeHabit.title}
          onChange={(e) => updateHabitTitle(e.target.value)}
          placeholder="Enter your habit goal (e.g., Daily Exercise, Read Every Day, Meditation...)"
          className="w-full text-2xl md:text-4xl text-center text-[#FF6B4A] border-b-2 border-transparent hover:border-gray-200 focus:border-[#FF6B4A] focus:outline-none transition-colors py-2 placeholder-gray-300"
        />
      </div>

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-[#FF6B4A] text-4xl md:text-7xl mb-2">2026</h1>
          <p className="text-[#FF6B4A] text-xs md:text-sm hidden md:block">
            {monthsShort.join(" • ")}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={exportToPDF}
            className="no-print flex items-center gap-2 px-4 py-2 bg-[#FF6B4A] text-white rounded-lg hover:bg-[#FF5535] transition-colors"
            title="Export to PDF"
          >
            <Download className="w-5 h-5" />
            <span className="hidden md:inline">Export PDF</span>
          </button>
          <Smile className="w-8 h-8 md:w-12 md:h-12 text-[#FF6B4A]" />
        </div>
      </div>

      {/* Desktop View - Linear Calendar */}
      <div className="hidden md:block">
        {/* Day headers - need to repeat for all possible days */}
        <div className="flex mb-2">
          <div className="w-12 flex-shrink-0"></div>
          <div className="flex-1 grid grid-cols-37 gap-px">
            {Array.from({ length: maxCells }, (_, i) => {
              const dayIndex = i % 7;
              return (
                <div key={i} className="text-center text-xs text-gray-500 py-1">
                  {dayNames[dayIndex]}
                </div>
              );
            })}
          </div>
        </div>

        {/* Month rows */}
        {months.map((month, monthIndex) => {
          const monthDays = generateMonthData(monthIndex);

          return (
            <div
              key={monthIndex}
              className="flex border-t border-gray-200 py-1"
            >
              {/* Month number */}
              <div
                className="w-12 flex-shrink-0 text-[#FF6B4A] text-3xl pr-4 cursor-pointer hover:opacity-70 transition-opacity no-print-click"
                onClick={() => initializeMonth(monthIndex)}
                title={`Click to fill/clear all days in ${months[monthIndex]}`}
              >
                {monthIndex + 1}
              </div>

              {/* Days grid */}
              <div className="flex-1 grid grid-cols-37 gap-px">
                {Array.from({ length: maxCells }, (_, i) => {
                  const day = monthDays[i];
                  const isWeekend = i % 7 >= 5; // Saturday or Sunday
                  const isSelected = day
                    ? isDateSelected(monthIndex, day)
                    : false;

                  return (
                    <div
                      key={i}
                      onClick={() => day && toggleDate(monthIndex, day)}
                      className={`text-center py-2 text-sm rounded-full ${
                        day ? "cursor-pointer transition-colors" : ""
                      } ${
                        isSelected
                          ? "bg-[#FF6B4A] text-white"
                          : day
                            ? isWeekend
                              ? "text-[#FF6B4A]"
                              : "text-gray-700"
                            : ""
                      }`}
                    >
                      {day || ""}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile View - Traditional Calendar Grid */}
      <div className="md:hidden space-y-6">
        {months.map((month, monthIndex) => {
          const monthDays = generateMonthData(monthIndex);

          return (
            <div
              key={monthIndex}
              className="border border-gray-200 rounded-lg p-4"
            >
              {/* Month name and number */}
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="text-[#FF6B4A] text-3xl cursor-pointer hover:opacity-70 transition-opacity"
                  onClick={() => initializeMonth(monthIndex)}
                  title={`Click to fill/clear all days in ${month}`}
                >
                  {monthIndex + 1}
                </span>
                <h3 className="text-gray-800 text-xl">{month}</h3>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs text-gray-500 py-1"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Days grid */}
              <div className="grid grid-cols-7 gap-1">
                {monthDays.map((day, index) => {
                  const isWeekend = index % 7 >= 5;
                  const isSelected = day
                    ? isDateSelected(monthIndex, day)
                    : false;

                  return (
                    <div
                      key={index}
                      onClick={() => day && toggleDate(monthIndex, day)}
                      className={`text-center py-3 text-sm ${
                        day
                          ? "cursor-pointer hover:bg-gray-100 transition-colors rounded-full"
                          : ""
                      } ${
                        isSelected
                          ? "bg-[#FF6B4A] text-white rounded-full"
                          : day
                            ? isWeekend
                              ? "text-[#FF6B4A]"
                              : "text-gray-700"
                            : ""
                      }`}
                    >
                      {day || ""}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 gap-2">
        <span>Linear Calendar • 2026 • 12 months • Habit Tracker</span>
        <span className="text-[#FF6B4A]">
          {selectedDates.size} {selectedDates.size === 1 ? "day" : "days"}{" "}
          tracked • Make it a wonderful year
        </span>
      </div>

      <style>{`
        .grid-cols-37 {
          display: grid;
          grid-template-columns: repeat(37, minmax(0, 1fr));
        }
        
        .grid-cols-31 {
          display: grid;
          grid-template-columns: repeat(31, minmax(0, 1fr));
        }
        
        @media print {
          .no-print {
            display: none !important;
          }
          
          .no-print-click {
            cursor: default !important;
            pointer-events: none;
          }
          
          @page {
            size: A2 landscape;
            margin: 0.5cm;
          }
          
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
}
