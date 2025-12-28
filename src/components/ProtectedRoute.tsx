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
              <span className="text-[#FF6B4A]">해빗 습관 캘린더</span>를
              사용하려면 로그인해주세요!
            </p>
            <p className="text-gray-600 mb-6">
              2025년에 이미 기록하신 내용은 로그인 후 복원 버튼을 눌러서 동기화
              하실수 있어요. 만약 동기화에 문제가 있으시다면 '이전 데이터
              복사하기' 버튼을 눌러서 가이드에 따라 제게 메일을 보내주세요.
            </p>
            <p className="text-gray-600 mb-6">
              2026년 1월 10일 이후 데이터 관련 버튼은 사라지고, 깔끔하게
              이용하실수 있습니다!
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
