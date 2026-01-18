import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const hasSupabaseEnv = Boolean(supabaseUrl && supabaseAnonKey);

const createSupabaseClient = (): SupabaseClient<Database> => {
  if (!hasSupabaseEnv) {
    // Avoid crashing builds/prerender when env vars are not set.
    console.warn(
      'Supabase env vars ausentes. Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    );
    return {
      rpc: async () => ({
        data: null,
        error: new Error('Supabase env vars ausentes.'),
      }),
      auth: {
        getSession: async () => ({
          data: { session: null },
          error: new Error('Supabase env vars ausentes.'),
        }),
        onAuthStateChange: () => ({
          data: { subscription: { unsubscribe: () => undefined } },
          error: null,
        }),
        signInWithPassword: async () => ({
          data: { session: null, user: null },
          error: new Error('Supabase env vars ausentes.'),
        }),
        signOut: async () => ({
          error: new Error('Supabase env vars ausentes.'),
        }),
      },
    } as unknown as SupabaseClient<Database>;
  }

  return createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
  });
};

// Create a single supabase client for interacting with your database
export const supabase = createSupabaseClient();
