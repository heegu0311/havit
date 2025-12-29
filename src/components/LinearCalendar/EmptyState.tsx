import { memo } from "react";

interface EmptyStateProps {
  onAddHabit: () => void;
}

function EmptyStateComponent({ onAddHabit }: EmptyStateProps) {
  return (
    <div className="flex justify-center items-center max-w-[1600px] min-h-[875px] mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-[var(--habit-color)] text-lg mb-4">
          아직 습관이 없습니다.
        </div>
        <button
          onClick={onAddHabit}
          className="px-6 py-3 bg-[var(--habit-color)] text-white rounded-lg hover:shadow-lg hover:opacity-90 transition-all"
        >
          첫 번째 습관 추가하기
        </button>
      </div>
    </div>
  );
}

export const EmptyState = memo(EmptyStateComponent);
