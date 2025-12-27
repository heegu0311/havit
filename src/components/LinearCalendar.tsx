import {
  Check,
  ChevronDown,
  ClipboardPaste,
  Copy,
  Database,
  Plus,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useHabitDates } from "../hooks/useHabitDates";
import { useHabits } from "../hooks/useHabits";
import { getSelectedShapeClasses } from "../utils/calendar.ts";

export function LinearCalendar() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [copiedData, setCopiedData] = useState(false);

  const year = selectedYear;
  const availableYears = [2025, 2026];

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

  // Use Supabase hooks
  const {
    habits,
    loading: habitsLoading,
    error: habitsError,
    createHabit,
    updateHabit,
    deleteHabit: deleteHabitFromDB,
  } = useHabits();

  const [activeHabitId, setActiveHabitId] = useState<string | null>(null);

  // Set active habit when habits are loaded
  useEffect(() => {
    if (habits.length > 0 && !activeHabitId) {
      setActiveHabitId(habits[0].id);
    } else if (habits.length === 0 && activeHabitId) {
      setActiveHabitId(null);
    }
  }, [habits, activeHabitId]);

  // Use habit dates hook
  const {
    dates: habitDates,
    loading: datesLoading,
    toggleDate: toggleDateInDB,
    isDateSelected: isDateSelectedInDB,
    getSelectedDates,
    initializeMonth: initializeMonthInDB,
  } = useHabitDates(activeHabitId);

  // Get current active habit
  const activeHabit = habits.find((h) => h.id === activeHabitId);

  // Update habit title
  const updateHabitTitle = async (title: string) => {
    if (!activeHabitId) return;
    try {
      await updateHabit(activeHabitId, title);
    } catch (error) {
      console.error("Error updating habit title:", error);
      alert("습관 제목을 업데이트하는 중 오류가 발생했습니다.");
    }
  };

  // Add new habit
  const addHabit = async () => {
    if (habits.length >= 5) return;
    try {
      const newHabit = await createHabit("도서관 가기");
      setActiveHabitId(newHabit.id);
    } catch (error) {
      console.error("Error creating habit:", error);
      alert("새 습관을 생성하는 중 오류가 발생했습니다.");
    }
  };

  // Delete habit
  const deleteHabit = async (id: string) => {
    if (habits.length <= 1) return; // Keep at least one habit
    try {
      await deleteHabitFromDB(id);
      if (activeHabitId === id) {
        const remainingHabits = habits.filter((h) => h.id !== id);
        setActiveHabitId(remainingHabits[0]?.id || null);
      }
    } catch (error) {
      console.error("Error deleting habit:", error);
      alert("습관을 삭제하는 중 오류가 발생했습니다.");
    }
  };

  // Helper function to format date as YYYY-MM-DD
  const formatDate = (year: number, month: number, day: number) => {
    const monthStr = String(month).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    return `${year}-${monthStr}-${dayStr}`;
  };

  // Toggle date selection
  const toggleDate = async (monthIndex: number, day: number) => {
    const dateKey = formatDate(year, monthIndex + 1, day);
    try {
      await toggleDateInDB(dateKey);
    } catch (error) {
      console.error("Error toggling date:", error);
      alert("날짜를 업데이트하는 중 오류가 발생했습니다.");
    }
  };

  // Check if a date is selected
  const isDateSelected = (monthIndex: number, day: number) => {
    const dateKey = formatDate(year, monthIndex + 1, day);
    return isDateSelectedInDB(dateKey);
  };

  // Initialize entire month (fill all dates for a month)
  const initializeMonth = async (monthIndex: number) => {
    try {
      await initializeMonthInDB(year, monthIndex);
    } catch (error) {
      console.error("Error initializing month:", error);
      alert("월 데이터를 초기화하는 중 오류가 발생했습니다.");
    }
  };

  // Get selected dates count
  const selectedDatesCount = getSelectedDates().length;

  // Export to PDF
  const exportToPDF = () => {
    window.print();
  };

  // Copy habit data to clipboard
  const copyHabitData = async () => {
    try {
      const exportData = {
        habits: habits.map((h) => ({
          id: h.id,
          title: h.title,
          selectedDates: getSelectedDates(),
        })),
        activeHabitId,
        exportDate: new Date().toISOString(),
        version: "2.0",
      };
      const dataString = JSON.stringify(exportData, null, 2);

      // Fallback method using textarea for better browser compatibility
      const textarea = document.createElement("textarea");
      textarea.value = dataString;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();

      try {
        document.execCommand("copy");
        setCopiedData(true);
        setTimeout(() => setCopiedData(false), 2000);
      } catch (err) {
        console.error("Fallback copy failed:", err);
        // Show the data in an alert as last resort
        prompt("Copy this data manually (Ctrl+C/Cmd+C):", dataString);
      } finally {
        document.body.removeChild(textarea);
      }
    } catch (error) {
      console.error("Error copying data:", error);
      alert("데이터를 복사하는 중 오류가 발생했습니다.");
    }
  };

  // Paste habit data from clipboard (for migration from localStorage)
  const pasteHabitData = async () => {
    try {
      // Use prompt as fallback for better browser compatibility
      const pastedText = prompt("여기에 습관 데이터를 붙여넣으세요:");

      if (!pastedText) {
        return; // User cancelled
      }

      const importData = JSON.parse(pastedText);

      // Validate the data structure
      if (!importData.habits || !Array.isArray(importData.habits)) {
        throw new Error("Invalid data format");
      }

      // Confirm before importing
      const confirm = window.confirm(
        `현재 ${habits.length}개의 습관을 ${importData.habits.length}개의 가져온 습관으로 교체하시겠습니까?`,
      );

      if (!confirm) {
        return;
      }

      // Import the data - create habits in database
      for (const habit of importData.habits) {
        try {
          const newHabit = await createHabit(habit.title || "");
          // Import dates if available - need to use supabase directly for bulk insert
          if (
            habit.selectedDates &&
            Array.isArray(habit.selectedDates) &&
            habit.selectedDates.length > 0
          ) {
            const { supabase } = await import("../lib/supabase");
            const datesToInsert = habit.selectedDates.map((date: string) => ({
              habit_id: newHabit.id,
              date,
            }));
            try {
              await supabase.from("habit_dates").insert(datesToInsert);
            } catch (err) {
              console.error("Error importing dates:", err);
            }
          }
        } catch (err) {
          console.error("Error importing habit:", err);
        }
      }

      alert("습관 데이터를 성공적으로 가져왔습니다!");
    } catch (error) {
      console.error("Error pasting data:", error);
      alert(
        "데이터를 가져오는 중 오류가 발생했습니다. 데이터 형식이 올바른지 확인해주세요.",
      );
    }
  };

  // Migrate data from localStorage to server
  const migrateLocalStorageData = async () => {
    try {
      // Get data from localStorage
      const localStorageKey = "habit-tracker-2026-habits";
      const localDataString = localStorage.getItem(localStorageKey);

      if (!localDataString) {
        alert("로컬스토리지에 저장된 데이터가 없습니다.");
        return;
      }

      const localData = JSON.parse(localDataString);

      // Validate the data structure
      if (!Array.isArray(localData) || localData.length === 0) {
        alert("로컬스토리지 데이터 형식이 올바르지 않습니다.");
        return;
      }

      // Confirm before migrating
      const confirm = window.confirm(
        `로컬스토리지의 ${localData.length}개 습관을 서버에 저장하시겠습니까? 이 작업은 현재 서버의 데이터에 추가됩니다.`,
      );

      if (!confirm) {
        return;
      }

      let successCount = 0;
      let errorCount = 0;

      // Import each habit from localStorage
      for (const habit of localData) {
        try {
          // Create habit in database
          const newHabit = await createHabit(habit.title || "새 습관");

          // Import dates if available
          if (
            habit.selectedDates &&
            Array.isArray(habit.selectedDates) &&
            habit.selectedDates.length > 0
          ) {
            const { supabase } = await import("../lib/supabase");
            const datesToInsert = habit.selectedDates.map((date: string) => ({
              habit_id: newHabit.id,
              date,
            }));

            try {
              await supabase.from("habit_dates").insert(datesToInsert);
              successCount++;
            } catch (err) {
              console.error("Error importing dates for habit:", err);
              errorCount++;
            }
          } else {
            successCount++;
          }
        } catch (err) {
          console.error("Error importing habit from localStorage:", err);
          errorCount++;
        }
      }

      if (errorCount === 0) {
        alert(
          `로컬스토리지 데이터를 성공적으로 서버에 저장했습니다! (${successCount}개 습관)`,
        );
      } else {
        alert(
          `일부 데이터를 저장했습니다. 성공: ${successCount}개, 실패: ${errorCount}개`,
        );
      }
    } catch (error) {
      console.error("Error migrating localStorage data:", error);
      alert(
        "로컬스토리지 데이터를 서버로 마이그레이션하는 중 오류가 발생했습니다.",
      );
    }
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

  // Loading state
  if (habitsLoading || datesLoading) {
    return (
      <div className="max-w-[1600px] mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-[#FF6B4A] text-lg">로딩 중...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (habitsError) {
    return (
      <div className="max-w-[1600px] mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-red-500 text-lg">
            오류가 발생했습니다: {habitsError.message}
          </div>
        </div>
      </div>
    );
  }

  // No habits state
  if (habits.length === 0) {
    return (
      <div className="max-w-[1600px] mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-[#FF6B4A] text-lg mb-4">
            아직 습관이 없습니다.
          </div>
          <button
            onClick={addHabit}
            className="px-6 py-3 bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6E] text-white rounded-lg hover:shadow-lg transition-all"
          >
            첫 번째 습관 추가하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto bg-white rounded-lg shadow-lg p-6">
      {/* Habit Tabs */}
      <div className="mb-6 flex items-center gap-2 border-b-2 border-gray-200 overflow-x-auto overflow-y-hidden">
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
            <span className="flex items-center gap-2 whitespace-nowrap">
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
        {habits.length < 5 && (
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
          value={activeHabit?.title || ""}
          onChange={(e) => updateHabitTitle(e.target.value)}
          onBlur={(e) => updateHabitTitle(e.target.value)}
          placeholder="습관 목표를 입력하세요 (예: 매일 운동하기, 독서하기, 명상하기...)"
          className="w-full text-2xl md:text-4xl text-center text-[#FF6B4A] border-b-2 border-transparent hover:border-gray-200 focus:border-[#FF6B4A] focus:outline-none transition-colors py-2 placeholder-gray-300"
        />
      </div>

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          {/* Year Selector */}
          <div className="relative">
            <button
              onClick={() => setShowYearDropdown(!showYearDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6E] text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <span className="text-2xl md:text-4xl font-bold">
                {selectedYear}
              </span>
              <ChevronDown
                className={`w-5 h-5 transition-transform duration-300 ${showYearDropdown ? "rotate-180" : ""}`}
              />
            </button>

            {showYearDropdown && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-10 min-w-[120px]">
                {availableYears.map((yr) => (
                  <button
                    key={yr}
                    onClick={() => {
                      setSelectedYear(yr);
                      setShowYearDropdown(false);
                    }}
                    className={`w-full px-6 py-2 text-left hover:bg-[#FFF5F3] transition-colors ${
                      yr === selectedYear
                        ? "bg-[#FFF5F3] text-[#FF6B4A]"
                        : "text-gray-700"
                    }`}
                  >
                    {yr}
                  </button>
                ))}
              </div>
            )}
          </div>

          <p className="text-[#FF6B4A] text-xs md:text-sm hidden lg:block">
            {months.join(" • ")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Copy Data Button */}
          <button
            onClick={copyHabitData}
            className="flex items-center gap-2 px-4 py-2 border-2 border-[#FF6B4A] text-[#FF6B4A] rounded-lg hover:bg-[#FFF5F3] transition-all duration-300"
            title="Copy habit data to transfer between browsers"
          >
            {copiedData ? (
              <>
                <Check className="w-5 h-5" />
                <span className="hidden md:inline">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                <span className="hidden md:inline">Copy Data</span>
              </>
            )}
          </button>

          {/* Paste Data Button */}
          <button
            onClick={pasteHabitData}
            className="flex items-center gap-2 px-4 py-2 border-2 border-[#FF6B4A] text-[#FF6B4A] rounded-lg hover:bg-[#FFF5F3] transition-all duration-300"
            title="Paste habit data from clipboard"
          >
            <ClipboardPaste className="w-5 h-5" />
            <span className="hidden md:inline">Paste Data</span>
          </button>

          {/* Migrate LocalStorage Data Button */}
          <button
            onClick={migrateLocalStorageData}
            className="flex items-center gap-2 px-4 py-2 bg-[#FF6B4A] text-white rounded-lg hover:bg-[#FF8A6E] transition-all duration-300"
            title="기존 로컬스토리지 데이터를 서버에 저장하기"
          >
            <Database className="w-5 h-5" />
            <span className="hidden md:inline">서버에 저장</span>
          </button>

          {/*<Smile className="w-8 h-8 md:w-12 md:h-12 text-[#FF6B4A]" />*/}
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
                        ? "text-[#FF6B4A]"
                        : "text-gray-700"
                      : "";

                  return (
                    <button
                      key={i}
                      onClick={() => day && toggleDate(monthIndex, day)}
                      className={[
                        "text-center py-2 text-sm",
                        baseClickable,
                        textColor,
                        isSelected ? "bg-[#FF6B4A]" : "hover:rounded-full",
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
              <div className="grid grid-cols-7 gap-0.5">
                {/* Days grid (Mobile) */}
                {monthDays.map((day, index) => {
                  const isWeekend = index % 7 >= 5;
                  const isSelected = day
                    ? isDateSelected(monthIndex, day)
                    : false;

                  const selectedShapeClasses = getSelectedShapeClasses(
                    monthDays,
                    monthIndex,
                    index,
                    monthDays.length, // 모바일은 monthDays 길이 기준
                    isDateSelected,
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
                      onClick={() => day && toggleDate(monthIndex, day)}
                      className={[
                        "text-center py-3 text-sm",
                        baseClickable,
                        textColor,
                        isSelected ? "bg-[#FF6B4A]" : "hover:rounded-full",
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

      {/* Footer */}
      <div className="mt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 gap-2">
        <span>Linear Calendar • {year} • 12 months • Habit Tracker</span>
        <span className="text-[#FF6B4A]">
          {selectedDatesCount} {selectedDatesCount === 1 ? "일" : "일"} 추적됨 •
          멋진 한 해 되세요
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
