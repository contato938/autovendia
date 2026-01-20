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

const isPlaceholderSupabaseUrl = (url?: string) =>
  Boolean(url && url.trim() === 'https://placeholder.supabase.co');

const isPlaceholderAnonKey = (anonKey?: string) =>
  Boolean(anonKey && anonKey.trim() === 'placeholder-anon-key');

const isProbablyValidUrl = (url?: string) => {
  if (!url) return false;
  try {
    // eslint-disable-next-line no-new
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

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

const createStubClient = (reason: string): SupabaseClient<Database> => {
  // Avoid crashing builds/prerender when env vars are not set.
  console.warn(
    `Supabase não configurado corretamente (${reason}). Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.`
  );
  return {
    rpc: async () => ({
      data: null,
      error: new Error(`Supabase não configurado corretamente (${reason}).`),
    }),
    auth: {
      getSession: async () => ({
        data: { session: null },
        error: new Error(`Supabase não configurado corretamente (${reason}).`),
      }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => undefined } },
        error: null,
      }),
      signInWithPassword: async () => ({
        data: { session: null, user: null },
        error: new Error(`Supabase não configurado corretamente (${reason}).`),
      }),
      signOut: async () => ({
        error: new Error(`Supabase não configurado corretamente (${reason}).`),
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
  const invalidBecausePlaceholder =
    isPlaceholderSupabaseUrl(url) || isPlaceholderAnonKey(anonKey);
  const invalidBecauseBadUrl = Boolean(url && !isProbablyValidUrl(url));

  if (!hasSupabaseEnv) {
    return createStubClient('variáveis ausentes');
  }

  if (invalidBecausePlaceholder) {
    return createStubClient('valores placeholder');
  }

  if (invalidBecauseBadUrl) {
    return createStubClient('NEXT_PUBLIC_SUPABASE_URL inválida');
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
