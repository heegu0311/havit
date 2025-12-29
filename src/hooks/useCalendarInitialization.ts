import { useEffect, useRef, useState } from "react";

interface UseCalendarInitializationProps {
  authLoading: boolean;
  habitsLoading: boolean;
  datesLoading: boolean;
  hasHabits: boolean;
}

/**
 * Manages unified loading state for LinearCalendar
 * Only shows spinner on initial load, background updates don't trigger it
 */
export function useCalendarInitialization({
  authLoading,
  habitsLoading,
  datesLoading,
  hasHabits,
}: UseCalendarInitializationProps) {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const hasLoadedOnce = useRef(false);

  useEffect(() => {
    // Check if all loading states are complete
    const allLoadingComplete = !authLoading && !habitsLoading && !datesLoading;

    // Only update state once when all loading is complete for the first time
    if (allLoadingComplete && !hasLoadedOnce.current) {
      hasLoadedOnce.current = true;
      setIsInitialLoading(false);
    }
  }, [authLoading, habitsLoading, datesLoading]);

  return {
    isInitialLoading,
    isBackgroundRefreshing: hasLoadedOnce.current && (habitsLoading || datesLoading),
  };
}
