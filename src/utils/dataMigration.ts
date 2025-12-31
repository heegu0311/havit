import { Habit } from "@/hooks/useHabits";

/**
 * Copy habit data to clipboard
 */
export async function copyHabitData(
  habits: Habit[],
  activeHabitId: string | null,
  setCopiedData: (copied: boolean) => void
) {
  try {
    const exportData = {
      habits,
      activeHabitId,
      exportDate: new Date().toISOString(),
      version: "1.0",
    };
    const dataString = JSON.stringify(exportData, null, 2);

    // Fallback method using textarea
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
      prompt("Copy this data manually (Ctrl+C/Cmd+C):", dataString);
    } finally {
      document.body.removeChild(textarea);
      alert(
        "Data copied!\nPlease also send your sign-up email address to heegu0311@gmail.com!"
      );
    }
  } catch (error) {
    console.error("Error copying data:", error);
    alert("Failed to copy data to clipboard");
  }
}

/**
 * Migrate data from localStorage to server
 */
export async function migrateLocalStorageData(
  localStorageKey: string,
  createHabit: (title: string) => Promise<Habit>
) {
  try {
    if (!window.confirm("Would you like to sync your data from the previous version?")) {
      return;
    }

    const localDataString = localStorage.getItem(localStorageKey);

    if (!localDataString) {
      alert("No data found in localStorage.");
      return;
    }

    const localData = JSON.parse(localDataString);

    if (!Array.isArray(localData) || localData.length === 0) {
      alert("Invalid localStorage data format.");
      return;
    }

    const confirm = window.confirm(
      `Would you like to save ${localData.length} habits from localStorage to the server? This will be added to your current server data.`
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
        const newHabit = await createHabit(habit.title || "New Habit");

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
        `Successfully saved localStorage data to the server! (${successCount} habits)`
      );
      localStorage.removeItem("habit-tracker-2026-active");
      localStorage.removeItem(localStorageKey);
    } else {
      alert(
        `Saved partial data. Success: ${successCount}, Failed: ${errorCount}`
      );
    }
  } catch (error) {
    console.error("Error migrating localStorage data:", error);
    alert(
      "An error occurred while migrating localStorage data to the server."
    );
  }
}
