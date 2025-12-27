import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please check your .env file.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

const ob = [
  {
    id: "1",
    title: "",
    selectedDates: [
      "2026-1-23",
      "2026-1-24",
      "2026-1-25",
      "2026-1-26",
      "2026-1-27",
      "2026-2-16",
      "2026-2-17",
      "2026-4-8",
      "2026-5-14",
      "2026-5-15",
      "2026-2-18",
    ],
  },
];
