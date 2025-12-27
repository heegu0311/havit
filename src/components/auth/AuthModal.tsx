import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { supabase } from "../../lib/supabase";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>로그인 또는 회원가입</DialogTitle>
          <DialogDescription>
            습관 추적 데이터를 안전하게 저장하고 동기화하세요.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: "#FF6B4A",
                    brandAccent: "#FF8A6E",
                  },
                },
              },
              style: {
                button: {
                  borderRadius: "0.5rem",
                  padding: "0.5rem 1rem",
                },
                input: {
                  borderRadius: "0.5rem",
                },
              },
            }}
            providers={["google", "github"]}
            localization={{
              variables: {
                sign_in: {
                  email_label: "이메일",
                  password_label: "비밀번호",
                  email_input_placeholder: "이메일을 입력하세요",
                  password_input_placeholder: "비밀번호를 입력하세요",
                  button_label: "로그인",
                  loading_button_label: "로그인 중...",
                  social_provider_text: "{{provider}}로 로그인",
                  link_text: "이미 계정이 있으신가요? 로그인",
                },
                sign_up: {
                  email_label: "이메일",
                  password_label: "비밀번호",
                  email_input_placeholder: "이메일을 입력하세요",
                  password_input_placeholder: "비밀번호를 입력하세요",
                  button_label: "회원가입",
                  loading_button_label: "회원가입 중...",
                  social_provider_text: "{{provider}}로 회원가입",
                  link_text: "계정이 없으신가요? 회원가입",
                },
              },
            }}
            view="sign_in"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
