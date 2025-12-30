import { useCallback } from "react";
import { HabitTabs } from "./HabitTabs";
import { CalendarHeader } from "./CalendarHeader";
import { DesktopCalendarView } from "./DesktopCalendarView";
import { MobileCalendarView } from "./MobileCalendarView";
import { CalendarFooter } from "./CalendarFooter";
import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";
import { useCalendarLogic } from "@/hooks/useCalendarLogic";
import { useCalendarInitialization } from "@/hooks/useCalendarInitialization";
import { useHabitColor } from "@/hooks/useHabitColor";
import { useIsPWA } from "@/hooks/useIsPWA";
import { MAX_HABITS, AVAILABLE_YEARS } from "./types";

/**
 * Main LinearCalendar component - orchestrates all child components
 */
export default function LinearCalendar() {
  const {
    // Data
    habits,
    activeHabitId,
    activeHabit,
    selectedDatesSet,
    selectedDatesCount,

    // Loading & Errors
    loading,
    habitsLoading,
    datesLoading,
    habitsError,

    // UI State
    selectedYear,
    setSelectedYear,
    showYearDropdown,
    setShowYearDropdown,
    localTitle,
    copiedData,

    // Handlers
    setActiveHabitId,
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
  } = useCalendarLogic();

  // Get current habit color for CSS variable
  const habitColor = useHabitColor(activeHabit);

  // Detect PWA mode
  const isPWA = useIsPWA();

  // Handle color change
  const handleColorChange = useCallback(
    async (habitId: string, color: string) => {
      await updateHabitColor(color);
    },
    [updateHabitColor],
  );

  const { isInitialLoading } = useCalendarInitialization({
    authLoading: loading,
    habitsLoading,
    datesLoading,
    hasHabits: habits.length > 0,
  });

  // Show loading only on initial load
  if (isInitialLoading) {
    return <LoadingState />;
  }

  // Show error state if there's an error
  if (habitsError) {
    return <ErrorState error={habitsError} />;
  }

  return (
    <div
      className={`max-w-[1600px] mx-auto bg-white rounded-lg shadow-lg p-4 pt-0 mt-4 overflow-y-auto ${
        isPWA ? "max-h-[calc(100dvh-3.5rem)]" : "max-h-[calc(100dvh-2rem)]"
      }`}
      style={
        {
          "--habit-color": habitColor,
        } as React.CSSProperties
      }
    >
      <HabitTabs
        habits={habits}
        activeHabitId={activeHabitId}
        onSelectHabit={setActiveHabitId}
        onAddHabit={addHabit}
        onDeleteHabit={deleteHabit}
        onSignOut={signOut}
        onColorChange={handleColorChange}
        maxHabits={MAX_HABITS}
      />

      <CalendarHeader
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        showYearDropdown={showYearDropdown}
        onToggleYearDropdown={setShowYearDropdown}
        availableYears={AVAILABLE_YEARS}
        localTitle={localTitle}
        onTitleChange={handleTitleChange}
        hasLocalData={!!localDataString}
        copiedData={copiedData}
        onCopyData={copyHabitData}
        onMigrateData={migrateLocalStorageData}
      />

      <DesktopCalendarView
        year={selectedYear}
        selectedDatesSet={selectedDatesSet}
        onToggleDate={toggleDate}
        onInitializeMonth={initializeMonth}
        isDateSelected={isDateSelected}
      />

      <MobileCalendarView
        year={selectedYear}
        selectedDatesSet={selectedDatesSet}
        onToggleDate={toggleDate}
        onInitializeMonth={initializeMonth}
        isDateSelected={isDateSelected}
        monthRefs={mobileMonthRefs}
      />

      <CalendarFooter
        year={selectedYear}
        selectedDatesCount={selectedDatesCount}
      />

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
