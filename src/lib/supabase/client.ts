import { createBrowserClient } from '@supabase/ssr'
import { SupabaseClient } from '@supabase/supabase-js'

// Store the client instance
let supabaseInstance: SupabaseClient | null = null;

// Function to get or create the Supabase client instance
export function getSupabaseBrowserClient() {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  supabaseInstance = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        detectSessionInUrl: false
      }
    }
  );

  return supabaseInstance;
}