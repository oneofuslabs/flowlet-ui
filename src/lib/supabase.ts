import { createClient } from "@supabase/supabase-js";

export const getBrowserClient = () => {
  return createClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_ANON_KEY!
  );
};
