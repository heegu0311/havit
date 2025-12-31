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
          <DialogTitle>Sign in or Sign up</DialogTitle>
          <DialogDescription>
            Securely save and sync your habit tracking data.
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
            providers={["google"]}
            queryParams={{ prompt: "consent" }}
            localization={{
              variables: {
                sign_in: {
                  email_label: "Email",
                  password_label: "Password",
                  email_input_placeholder: "Enter your email",
                  password_input_placeholder: "Enter your password",
                  button_label: "Sign in",
                  loading_button_label: "Signing in...",
                  social_provider_text: "Sign in with {{provider}}",
                  link_text: "Already have an account? Sign in",
                },
                sign_up: {
                  email_label: "Email",
                  password_label: "Password",
                  email_input_placeholder: "Enter your email",
                  password_input_placeholder: "Enter your password",
                  button_label: "Sign up",
                  loading_button_label: "Signing up...",
                  social_provider_text: "Sign up with {{provider}}",
                  link_text: "Don't have an account? Sign up",
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
