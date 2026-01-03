import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { HabitDate } from "./useHabitDates";

/**
 * Hook to fetch and manage dates for multiple habits simultaneously
 * Used in multi-habit view mode
 */
export function useMultiHabitDates(habitIds: string[]) {
  const { user } = useAuth();
  const [datesMap, setDatesMap] = useState<Map<string, HabitDate[]>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch dates for all habits
  useEffect(() => {
    if (!user || habitIds.length === 0) {
      setDatesMap(new Map());
      setLoading(false);
      return;
    }

    // Clear existing data when habitIds change
    setDatesMap(new Map());

    const fetchAllDates = async () => {
      try {
        setLoading(true);

        // Fetch dates for all habits in a single query using IN clause
        const { data, error } = await supabase
          .from("habit_dates")
          .select("*")
          .in("habit_id", habitIds)
          .order("date", { ascending: true });

        if (error) throw error;

        // Group dates by habit_id
        const groupedDates = new Map<string, HabitDate[]>();

        // Initialize empty arrays for all habits
        habitIds.forEach((habitId) => {
          groupedDates.set(habitId, []);
        });

        // Populate with actual dates
        (data || []).forEach((date) => {
          const habitDates = groupedDates.get(date.habit_id) || [];
          habitDates.push(date as HabitDate);
          groupedDates.set(date.habit_id, habitDates);
        });

        setDatesMap(groupedDates);
      } catch (err) {
        setError(err as Error);
        console.error("Error fetching multi-habit dates:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllDates();

    // Subscribe to real-time changes for all habit_dates
    // Using a single channel for all habits is more efficient
    const channel = supabase
      .channel("multi-habit-dates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "habit_dates",
        },
        (payload) => {
          // Filter to only process changes for our habits
          const habitId = (payload.new as HabitDate)?.habit_id ||
                         (payload.old as any)?.habit_id;

          if (!habitId || !habitIds.includes(habitId)) {
            return;
          }

          if (payload.eventType === "INSERT") {
            setDatesMap((prev) => {
              const newMap = new Map(prev);
              const habitDates = newMap.get(habitId) || [];
              newMap.set(habitId, [...habitDates, payload.new as HabitDate]);
              return newMap;
            });
          } else if (payload.eventType === "DELETE") {
            setDatesMap((prev) => {
              const newMap = new Map(prev);
              const habitDates = newMap.get(habitId) || [];
              newMap.set(
                habitId,
                habitDates.filter((d) => d.id !== payload.old.id)
              );
              return newMap;
            });
          } else if (payload.eventType === "UPDATE") {
            setDatesMap((prev) => {
              const newMap = new Map(prev);
              const habitDates = newMap.get(habitId) || [];
              const updatedDates = habitDates.map((d) =>
                d.id === (payload.new as HabitDate).id
                  ? (payload.new as HabitDate)
                  : d
              );
              newMap.set(habitId, updatedDates);
              return newMap;
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, habitIds.join(",")]); // Use join to create stable dependency

  /**
   * Get dates for a specific habit
   */
  const getDatesForHabit = (habitId: string): HabitDate[] => {
    return datesMap.get(habitId) || [];
  };

  /**
   * Get all dates as an array of strings for a specific habit
   */
  const getDateStringsForHabit = (habitId: string): string[] => {
    const dates = datesMap.get(habitId) || [];
    return dates.map((d) => d.date);
  };

  /**
   * Check if a specific date is selected for a habit
   */
  const isDateSelected = (habitId: string, date: string): boolean => {
    const dates = datesMap.get(habitId) || [];
    return dates.some((d) => d.date === date);
  };

  /**
   * Get total count of dates across all habits
   */
  const getTotalDatesCount = (): number => {
    let total = 0;
    datesMap.forEach((dates) => {
      total += dates.length;
    });
    return total;
  };

  return {
    datesMap,
    loading,
    error,
    getDatesForHabit,
    getDateStringsForHabit,
    isDateSelected,
    getTotalDatesCount,
  };
}
