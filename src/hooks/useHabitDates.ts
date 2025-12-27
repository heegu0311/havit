import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

export interface HabitDate {
  id: string;
  habit_id: string;
  date: string;
  created_at: string;
}

export function useHabitDates(habitId: string | null) {
  const { user } = useAuth();
  const [dates, setDates] = useState<HabitDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch habit dates
  useEffect(() => {
    if (!user || !habitId) {
      setDates([]);
      setLoading(false);
      return;
    }

    const fetchDates = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("habit_dates")
          .select("*")
          .eq("habit_id", habitId)
          .order("date", { ascending: true });

        if (error) throw error;
        setDates(data || []);
      } catch (err) {
        setError(err as Error);
        console.error("Error fetching habit dates:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDates();

    // Subscribe to real-time changes
    const channel = supabase
      .channel(`habit-dates-${habitId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "habit_dates",
          filter: `habit_id=eq.${habitId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setDates((prev) => [...prev, payload.new as HabitDate]);
          } else if (payload.eventType === "DELETE") {
            setDates((prev) => prev.filter((d) => d.id !== payload.old.id));
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, habitId]);

  // Toggle date (add if not exists, remove if exists)
  const toggleDate = async (date: string) => {
    if (!user || !habitId)
      throw new Error("User not authenticated or habit not selected");

    // Check if date already exists
    const existingDate = dates.find((d) => d.date === date);

    if (existingDate) {
      // Remove date
      const { error } = await supabase
        .from("habit_dates")
        .delete()
        .eq("id", existingDate.id);

      if (error) throw error;
      // Update local state immediately
      setDates((prev) => prev.filter((d) => d.id !== existingDate.id));
    } else {
      // Add date
      const { data, error } = await supabase
        .from("habit_dates")
        .insert([{ habit_id: habitId, date }])
        .select();

      if (error) throw error;
      // Update local state immediately
      if (data && data.length > 0) {
        setDates((prev) => [...prev, data[0] as HabitDate]);
      }
    }
  };

  // Check if date is selected
  const isDateSelected = (date: string) => {
    return dates.some((d) => d.date === date);
  };

  // Get selected dates as array of strings
  const getSelectedDates = () => {
    return dates.map((d) => d.date);
  };

  // Helper function to format date as YYYY-MM-DD
  const formatDate = (year: number, month: number, day: number) => {
    const monthStr = String(month).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    return `${year}-${monthStr}-${dayStr}`;
  };

  // Initialize month (select all dates in a month)
  const initializeMonth = async (year: number, monthIndex: number) => {
    if (!user || !habitId)
      throw new Error("User not authenticated or habit not selected");

    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const monthDates = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      return formatDate(year, monthIndex + 1, day);
    });

    // Check if all dates are already selected
    const existingDates = dates.map((d) => d.date);
    const allSelected = monthDates.every((date) =>
      existingDates.includes(date),
    );

    if (allSelected) {
      // Deselect all dates in this month
      const datesToRemove = dates.filter((d) => {
        const [y, m] = d.date.split("-").map(Number);
        return y === year && m === monthIndex + 1;
      });

      if (datesToRemove.length > 0) {
        const { error } = await supabase
          .from("habit_dates")
          .delete()
          .in(
            "id",
            datesToRemove.map((d) => d.id),
          );

        if (error) throw error;
      }
    } else {
      // Select all dates in this month that aren't already selected
      const datesToAdd = monthDates.filter(
        (date) => !existingDates.includes(date),
      );

      if (datesToAdd.length > 0) {
        const { error } = await supabase
          .from("habit_dates")
          .insert(datesToAdd.map((date) => ({ habit_id: habitId, date })));

        if (error) throw error;
      }
    }
  };

  return {
    dates,
    loading,
    error,
    toggleDate,
    isDateSelected,
    getSelectedDates,
    initializeMonth,
  };
}
