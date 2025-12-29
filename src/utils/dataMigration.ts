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
        "데이터가 복사되었습니다!\nheegu0311@gmail.com 으로\n가입하신 이메일 주소도 함께 보내주세요!"
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
    if (!window.confirm("과거 버전 사용하시던 데이터를 동기화하시겠습니까?")) {
      return;
    }

    const localDataString = localStorage.getItem(localStorageKey);

    if (!localDataString) {
      alert("로컬스토리지에 저장된 데이터가 없습니다.");
      return;
    }

    const localData = JSON.parse(localDataString);

    if (!Array.isArray(localData) || localData.length === 0) {
      alert("로컬스토리지 데이터 형식이 올바르지 않습니다.");
      return;
    }

    const confirm = window.confirm(
      `로컬스토리지의 ${localData.length}개 습관을 서버에 저장하시겠습니까? 이 작업은 현재 서버의 데이터에 추가됩니다.`
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
        `로컬스토리지 데이터를 성공적으로 서버에 저장했습니다! (${successCount}개 습관)`
      );
      localStorage.removeItem("habit-tracker-2026-active");
      localStorage.removeItem(localStorageKey);
    } else {
      alert(
        `일부 데이터를 저장했습니다. 성공: ${successCount}개, 실패: ${errorCount}개`
      );
    }
  } catch (error) {
    console.error("Error migrating localStorage data:", error);
    alert(
      "로컬스토리지 데이터를 서버로 마이그레이션하는 중 오류가 발생했습니다."
    );
  }
}
