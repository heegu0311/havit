import { useAuth } from "../contexts/AuthContext";
import { AuthModal } from "./auth/AuthModal";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner.tsx";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (!loading && !user) {
    return (
      <>
        <div className="min-h-screen bg-[#FFF5F0] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-[#FF6B4A] mb-4">
              Havit - simple habit tracking
            </h2>
            <p className="text-gray-600 mb-6">
              Please sign in to use{" "}
              <span className="text-[#FF6B4A]">Havit Habit Calendar</span>!
            </p>
            <p className="text-gray-600 mb-6">
              Data recorded in 2025 can be synced after signing in by pressing
              the restore button. If you have sync issues, please press the
              'Copy existing data' button and email me following the guide.
            </p>
            <p className="text-gray-600 mb-6">
              After January 10, 2026, data-related buttons will disappear and
              you can use the app seamlessly!
            </p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6E] text-white rounded-lg hover:shadow-lg transition-all"
            >
              Sign in or Sign up
            </button>
          </div>
        </div>
        <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
      </>
    );
  }

  return <>{children}</>;
}
