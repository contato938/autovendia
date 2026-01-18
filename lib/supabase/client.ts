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

const createStubClient = (): SupabaseClient<Database> => {
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
};

let supabaseClient: SupabaseClient<Database> | null = null;

const getSupabaseClient = (): SupabaseClient<Database> => {
  if (supabaseClient) {
    return supabaseClient;
  }

  const { url, anonKey } = readSupabaseEnv();
  const hasSupabaseEnv = Boolean(url && anonKey);

  if (!hasSupabaseEnv) {
    return createStubClient();
  }

  supabaseClient = createClient<Database>(url!, anonKey!, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
  });

  return supabaseClient;
};

export const supabase = new Proxy({} as SupabaseClient<Database>, {
  get(_target, prop) {
    const client = getSupabaseClient();
    const value = client[prop as keyof SupabaseClient<Database>];
    return typeof value === 'function' ? value.bind(client) : value;
  },
});
