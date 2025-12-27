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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF5F0] flex items-center justify-center">
        <Spinner className="w-16 h-16 text-[#FF6B4A]" />
      </div>
    );
  }

  if (!loading && !user) {
    return (
      <>
        <div className="min-h-screen bg-[#FFF5F0] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-[#FF6B4A] mb-4">
              로그인이 필요합니다
            </h2>
            <p className="text-gray-600 mb-6">
              습관 추적 데이터를 저장하고 동기화하려면 로그인해주세요.
            </p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6E] text-white rounded-lg hover:shadow-lg transition-all"
            >
              로그인 또는 회원가입
            </button>
          </div>
        </div>
        <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
      </>
    );
  }

  return <>{children}</>;
}
