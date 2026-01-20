#!/bin/sh
set -e

echo "🚀 AutovendaIA - Iniciando aplicação..."

# Função para mascarar chaves sensíveis nos logs
mask_key() {
  if [ -n "$1" ] && [ ${#1} -gt 8 ]; then
    echo "${1:0:8}...${1: -4}"
  elif [ -n "$1" ]; then
    echo "****"
  else
    echo "(vazio)"
  fi
}

# Resolver variáveis finais com fallback
# Se SUPABASE_URL não existir, tenta NEXT_PUBLIC_SUPABASE_URL
export SUPABASE_URL="${SUPABASE_URL:-${NEXT_PUBLIC_SUPABASE_URL}}"
export SUPABASE_ANON_KEY="${SUPABASE_ANON_KEY:-${NEXT_PUBLIC_SUPABASE_ANON_KEY}}"
export SITE_URL="${SITE_URL:-${NEXT_PUBLIC_SITE_URL:-http://localhost:3000}}"
export API_BASE_URL="${API_BASE_URL:-${NEXT_PUBLIC_API_BASE_URL}}"

# Debug (com mascaramento)
echo "📊 Configuração detectada:"
echo "  - SUPABASE_URL: $(mask_key "$SUPABASE_URL")"
echo "  - SUPABASE_ANON_KEY: $(mask_key "$SUPABASE_ANON_KEY")"
echo "  - SITE_URL: $SITE_URL"
echo "  - API_BASE_URL: ${API_BASE_URL:-(não configurado)}"

# Validação obrigatória
if [ -z "$SUPABASE_URL" ] || [ "$SUPABASE_URL" = "https://placeholder.supabase.co" ]; then
  echo "❌ ERRO: SUPABASE_URL não configurada ou ainda está com placeholder!"
  echo "Configure SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_URL no Dokploy e refaça o deploy."
  exit 1
fi

if [ -z "$SUPABASE_ANON_KEY" ] || [ "$SUPABASE_ANON_KEY" = "placeholder-anon-key" ]; then
  echo "❌ ERRO: SUPABASE_ANON_KEY não configurada ou ainda está com placeholder!"
  echo "Configure SUPABASE_ANON_KEY ou NEXT_PUBLIC_SUPABASE_ANON_KEY no Dokploy e refaça o deploy."
  exit 1
fi

echo "✅ Env vars validadas!"
echo "🎯 Iniciando servidor Next.js..."

# Executar node server.js como usuário nextjs (segurança)
exec su-exec nextjs node /app/server.js
