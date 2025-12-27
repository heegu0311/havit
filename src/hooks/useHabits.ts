import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

export interface Habit {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export function useHabits() {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch habits
  useEffect(() => {
    if (!user) {
      setHabits([]);
      setLoading(false);
      return;
    }

    const fetchHabits = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("habits")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true });

        if (error) throw error;
        setHabits(data || []);
      } catch (err) {
        setError(err as Error);
        console.error("Error fetching habits:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHabits();

    // Subscribe to real-time changes
    const channel = supabase
      .channel("habits-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "habits",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setHabits((prev) => [...prev, payload.new as Habit]);
          } else if (payload.eventType === "UPDATE") {
            setHabits((prev) =>
              prev.map((h) =>
                h.id === payload.new.id ? (payload.new as Habit) : h,
              ),
            );
          } else if (payload.eventType === "DELETE") {
            setHabits((prev) => prev.filter((h) => h.id !== payload.old.id));
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Create habit
  const createHabit = async (title: string) => {
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("habits")
      .insert([{ user_id: user.id, title }])
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  // Update habit
  const updateHabit = async (id: string, title: string) => {
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("habits")
      .update({ title, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  // Delete habit
  const deleteHabit = async (id: string) => {
    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase
      .from("habits")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;
  };

  return {
    habits,
    loading,
    error,
    createHabit,
    updateHabit,
    deleteHabit,
  };
}

