import { memo } from "react";
import { Spinner } from "@/components/ui/spinner";

function LoadingStateComponent() {
  return (
    <div className="flex justify-center items-center max-w-[1600px] min-h-[875px] mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-center py-12">
        <Spinner className="w-16 h-16 text-[var(--habit-color)]" />
      </div>
    </div>
  );
}

export const LoadingState = memo(LoadingStateComponent);
