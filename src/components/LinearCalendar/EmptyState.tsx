import { memo } from "react";

interface EmptyStateProps {
  onAddHabit: () => void;
}

function EmptyStateComponent({ onAddHabit }: EmptyStateProps) {
  return (
    <div className="flex justify-center items-center max-w-[1600px] min-h-[875px] mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-[#FF6B4A] text-lg mb-4">
          아직 습관이 없습니다.
        </div>
        <button
          onClick={onAddHabit}
          className="px-6 py-3 bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6E] text-white rounded-lg hover:shadow-lg transition-all"
        >
          첫 번째 습관 추가하기
        </button>
      </div>
    </div>
  );
}

export const EmptyState = memo(EmptyStateComponent);
