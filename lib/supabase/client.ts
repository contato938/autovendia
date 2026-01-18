import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

type SupabaseEnv = {
  url?: string;
  anonKey?: string;
};

declare global {
  interface Window {
    __SUPABASE_ENV__?: SupabaseEnv;
  }
}

const readSupabaseEnv = (): SupabaseEnv => {
  if (typeof window !== 'undefined') {
    const runtimeEnv = window.__SUPABASE_ENV__;
    if (runtimeEnv?.url && runtimeEnv?.anonKey) {
      return runtimeEnv;
    }
  }

  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };
};

const createSupabaseClient = (): SupabaseClient<Database> => {
  const { url, anonKey } = readSupabaseEnv();
  const hasSupabaseEnv = Boolean(url && anonKey);

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

  return createClient<Database>(url!, anonKey!, {
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
