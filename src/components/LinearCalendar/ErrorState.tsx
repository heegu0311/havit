import { memo } from "react";

interface ErrorStateProps {
  error: Error;
}

function ErrorStateComponent({ error }: ErrorStateProps) {
  return (
    <div className="max-w-[1600px] min-h-[875px] mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-center py-12">
        <div className="text-red-500 text-lg">
          오류가 발생했습니다: {error.message}
        </div>
      </div>
    </div>
  );
}

export const ErrorState = memo(ErrorStateComponent);
