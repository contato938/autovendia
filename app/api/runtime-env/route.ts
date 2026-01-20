import { NextResponse } from 'next/server';

// Força runtime dinâmico (sem cache, sem static optimization)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  // Prioriza SUPABASE_URL/SUPABASE_ANON_KEY (runtime server), fallback para NEXT_PUBLIC_*
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  // Validar se não é placeholder
  const isPlaceholder = 
    url.includes('placeholder.supabase.co') || 
    anonKey.includes('placeholder-anon-key');

  const env = isPlaceholder ? { url: '', anonKey: '' } : { url, anonKey };

  // Retornar JavaScript que injeta window.__SUPABASE_ENV__
  const script = `window.__SUPABASE_ENV__ = ${JSON.stringify(env)};`;

  return new NextResponse(script, {
    status: 200,
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}
