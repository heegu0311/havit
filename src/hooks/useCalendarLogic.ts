import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useHabits } from "./useHabits";
import { useHabitDates } from "./useHabitDates";
import { useMultiHabitDates } from "./useMultiHabitDates";
import { formatDate } from "@/utils/calendar";
import {
  copyHabitData as copyData,
  migrateLocalStorageData as migrateData,
} from "@/utils/dataMigration";
import { calculateHabitStats, HabitStats } from "@/utils/habitStats";

export type ViewMode = "single" | "multi";

/**
 * Centralized hook for all LinearCalendar business logic and state management
 */
export function useCalendarLogic() {
  // UI State
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [copiedData, setCopiedData] = useState(false);
  const [localTitle, setLocalTitle] = useState<string>("");
  const [activeHabitId, setActiveHabitId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("single");

  // Refs for DOM and debouncing
  // @ts-ignore
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mobileMonthRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Auth & Data hooks
  const { signOut, loading } = useAuth();
  const {
    habits,
    loading: habitsLoading,
    error: habitsError,
    isInitialLoadComplete: habitsInitialLoadComplete,
    createHabit,
    updateHabit,
    deleteHabit: deleteHabitFromDB,
  } = useHabits();

  const {
    dates: habitDates,
    loading: datesLoading,
    toggleDate: toggleDateInDB,
    initializeMonth: initializeMonthInDB,
  } = useHabitDates(activeHabitId);

  // Multi-habit data (only fetch when in multi view mode)
  const habitIds = useMemo(() => habits.map((h) => h.id), [habits]);
  const {
    datesMap: multiHabitDatesMap,
    loading: multiHabitDatesLoading,
    getDateStringsForHabit,
  } = useMultiHabitDates(viewMode === "multi" ? habitIds : []);

  // Get current active habit
  const activeHabit = habits.find((h) => h.id === activeHabitId);

  // Calculate stats for all habits (for multi-habit view)
  const habitStats = useMemo<HabitStats[]>(() => {
    if (viewMode !== "multi") return [];

    return habits.map((habit) => {
      const dates = getDateStringsForHabit(habit.id);
      return calculateHabitStats(habit.id, dates, selectedYear);
    });
  }, [viewMode, habits, multiHabitDatesMap, selectedYear, getDateStringsForHabit]);

  // Create a Set of selected dates for fast lookup
  const selectedDatesSet = useMemo(() => {
    return new Set(habitDates.map((d) => d.date));
  }, [habitDates]);

  const selectedDatesCount = habitDates.length;

  // Get localStorage data for migration
  const localStorageKey = "habit-tracker-2026-habits";
  const localDataString = localStorage.getItem(localStorageKey);

  // Initialize local title when active habit changes
  useEffect(() => {
    setLocalTitle(activeHabit?.title || "");
  }, [activeHabit?.id]);

  // Mobile: scroll to current month on year change
  useEffect(() => {
    if (window.innerWidth >= 768) return;

    const now = new Date();
    const currentMonthIndex = now.getMonth();

    const checkRefsReady = () => {
      if (mobileMonthRefs.current[currentMonthIndex]) {
        mobileMonthRefs.current[currentMonthIndex]!.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      } else {
        setTimeout(checkRefsReady, 50);
      }
    };

    const timeoutId = setTimeout(checkRefsReady, 100);
    return () => clearTimeout(timeoutId);
  }, [selectedYear, activeHabitId]);

  // Set active habit when habits are loaded
  useEffect(() => {
    if (habits.length > 0 && !activeHabitId) {
      setActiveHabitId(habits[0].id);
    } else if (habits.length === 0 && activeHabitId) {
      setActiveHabitId(null);
    }
  }, [habits, activeHabitId]);

  // Update habit title with debounce
  const updateHabitTitle = useCallback(
    async (title: string) => {
      if (!activeHabitId) return;
      try {
        await updateHabit(activeHabitId, { title });
      } catch (error) {
        console.error("Error updating habit title:", error);
        alert("An error occurred while updating the habit title.");
      }
    },
    [activeHabitId, updateHabit],
  );

  // Update habit color
  const updateHabitColor = useCallback(
    async (color: string) => {
      if (!activeHabitId) return;
      try {
        await updateHabit(activeHabitId, { color });
      } catch (error) {
        console.error("Error updating habit color:", error);
        alert("An error occurred while updating the habit color.");
      }
    },
    [activeHabitId, updateHabit],
  );

  // Handle title input change with debounce
  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTitle = e.target.value;
      setLocalTitle(newTitle);

      // Clear previous timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // Set new timeout for debounced update
      debounceTimeoutRef.current = setTimeout(() => {
        updateHabitTitle(newTitle);
      }, 500);
    },
    [updateHabitTitle],
  );

  // Add new habit
  const addHabit = useCallback(async () => {
    if (habits.length >= 5) return;
    try {
      const newHabit = await createHabit(`Habit ${habits.length + 1}`);
      setActiveHabitId(newHabit.id);
    } catch (error) {
      console.error("Error creating habit:", error);
      alert("An error occurred while creating a new habit.");
    }
  }, [habits.length, createHabit]);

  // Delete habit
  const deleteHabit = useCallback(
    async (id: string) => {
      if (habits.length <= 1) return;
      try {
        await deleteHabitFromDB(id);
        if (activeHabitId === id) {
          const remainingHabits = habits.filter((h) => h.id !== id);
          setActiveHabitId(remainingHabits[0]?.id || null);
        }
      } catch (error) {
        console.error("Error deleting habit:", error);
        alert("An error occurred while deleting the habit.");
      }
    },
    [habits, activeHabitId, deleteHabitFromDB],
  );

  // Toggle date selection
  const toggleDate = useCallback(
    async (monthIndex: number, day: number) => {
      const dateKey = formatDate(selectedYear, monthIndex + 1, day);
      try {
        await toggleDateInDB(dateKey);
      } catch (error) {
        console.error("Error toggling date:", error);
        alert("An error occurred while updating the date.");
      }
    },
    [selectedYear, toggleDateInDB],
  );

  // Check if a date is selected
  const isDateSelected = useCallback(
    (monthIndex: number, day: number) => {
      const dateKey = formatDate(selectedYear, monthIndex + 1, day);
      return selectedDatesSet.has(dateKey);
    },
    [selectedYear, selectedDatesSet],
  );

  // Initialize entire month (fill/clear all dates)
  const initializeMonth = useCallback(
    async (monthIndex: number) => {
      try {
        await initializeMonthInDB(selectedYear, monthIndex);
      } catch (error) {
        console.error("Error initializing month:", error);
        alert("An error occurred while initializing month data.");
      }
    },
    [selectedYear, initializeMonthInDB],
  );

  // Wrapper for copy habit data
  const copyHabitData = useCallback(async () => {
    await copyData(habits, activeHabitId, setCopiedData);
  }, [habits, activeHabitId]);

  // Wrapper for migrate localStorage data
  const migrateLocalStorageData = useCallback(async () => {
    await migrateData(localStorageKey, createHabit);
  }, [localStorageKey, createHabit]);

  // Switch to single habit view from multi-view (prevents flicker)
  const switchToSingleHabit = useCallback((habitId: string) => {
    setViewMode("single");
    setActiveHabitId(habitId);
  }, []);

  return {
    // Data
    habits,
    activeHabitId,
    activeHabit,
    habitDates,
    selectedDatesSet,
    selectedDatesCount,

    // Multi-habit data
    viewMode,
    setViewMode,
    multiHabitDatesMap,
    habitStats,

    // Loading & Errors
    loading,
    habitsLoading,
    datesLoading,
    multiHabitDatesLoading,
    habitsError,
    habitsInitialLoadComplete,

    // UI State
    selectedYear,
    setSelectedYear,
    showYearDropdown,
    setShowYearDropdown,
    localTitle,
    setLocalTitle,
    copiedData,

    // Handlers
    setActiveHabitId,
    switchToSingleHabit,
    handleTitleChange,
    updateHabitColor,
    addHabit,
    deleteHabit,
    toggleDate,
    isDateSelected,
    initializeMonth,
    copyHabitData,
    migrateLocalStorageData,
    signOut,

    // Refs
    mobileMonthRefs,

    // Utilities
    localDataString,
    getDateStringsForHabit,
  };
}
