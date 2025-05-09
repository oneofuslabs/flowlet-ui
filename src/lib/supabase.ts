import { createClient, SupabaseClient } from "@supabase/supabase-js";

declare global {
  interface Window {
    supabase: SupabaseClient;
  }
}

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

// window.supabase = supabase;
