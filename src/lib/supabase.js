import { createClient } from '@supabase/supabase-js';

// ── Supabase Client ──────────────────────────────────────────
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const IS_SUPABASE_CONFIGURED =
  supabaseUrl.length > 10 &&
  !supabaseUrl.includes('YOUR_PROJECT') &&
  supabaseAnonKey.length > 10 &&
  !supabaseAnonKey.includes('your-anon');

let supabase = null;

if (IS_SUPABASE_CONFIGURED) {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      flowType: 'pkce',        // Force PKCE flow (returns ?code= instead of #access_token=)
    },
  });
}

export default supabase;
