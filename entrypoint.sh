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
SUPABASE_URL_FINAL="${NEXT_PUBLIC_SUPABASE_URL:-${SUPABASE_URL}}"
SUPABASE_ANON_KEY_FINAL="${NEXT_PUBLIC_SUPABASE_ANON_KEY:-${SUPABASE_ANON_KEY}}"
SITE_URL_FINAL="${NEXT_PUBLIC_SITE_URL:-${SITE_URL:-http://localhost:3000}}"
API_BASE_URL_FINAL="${NEXT_PUBLIC_API_BASE_URL:-${API_BASE_URL}}"

# Debug (com mascaramento)
echo "📊 Configuração detectada:"
echo "  - SUPABASE_URL: $(mask_key "$SUPABASE_URL_FINAL")"
echo "  - SUPABASE_ANON_KEY: $(mask_key "$SUPABASE_ANON_KEY_FINAL")"
echo "  - SITE_URL: $SITE_URL_FINAL"
echo "  - API_BASE_URL: ${API_BASE_URL_FINAL:-(não configurado)}"

# Validação obrigatória
if [ -z "$SUPABASE_URL_FINAL" ] || [ "$SUPABASE_URL_FINAL" = "https://placeholder.supabase.co" ]; then
  echo "❌ ERRO: NEXT_PUBLIC_SUPABASE_URL não configurada ou ainda está com placeholder!"
  echo "Configure a variável de ambiente no Dokploy e refaça o deploy."
  exit 1
fi

if [ -z "$SUPABASE_ANON_KEY_FINAL" ] || [ "$SUPABASE_ANON_KEY_FINAL" = "placeholder-anon-key" ]; then
  echo "❌ ERRO: NEXT_PUBLIC_SUPABASE_ANON_KEY não configurada ou ainda está com placeholder!"
  echo "Configure a variável de ambiente no Dokploy e refaça o deploy."
  exit 1
fi

echo "🔄 Substituindo placeholders no bundle Next.js..."

replace_placeholders_in_dir() {
  TARGET_DIR="$1"
  if [ ! -d "$TARGET_DIR" ]; then
    return 0
  fi

  find "$TARGET_DIR" -type f \( -name "*.js" -o -name "*.json" \) \
    ! -path "/app/node_modules/*" \
    -exec sed -i \
      -e "s|https://placeholder\.supabase\.co|$SUPABASE_URL_FINAL|g" \
      -e "s|placeholder-anon-key|$SUPABASE_ANON_KEY_FINAL|g" \
      -e "s|http://localhost:3000|$SITE_URL_FINAL|g" \
      {} +
}

# IMPORTANTE:
# No output standalone do Next.js, o servidor (ex.: /app/server.js) fica FORA de /app/.next.
# Então substituímos placeholders em /app inteiro (exclui node_modules) e também em /app/.next.
replace_placeholders_in_dir /app
replace_placeholders_in_dir /app/.next

# Substituir API_BASE_URL apenas se não estiver vazio
if [ -n "$API_BASE_URL_FINAL" ]; then
  find /app -type f \( -name "*.js" -o -name "*.json" \) \
    ! -path "/app/node_modules/*" \
    -exec sed -i \
      -e "s|https://placeholder\.api\.base\.url|$API_BASE_URL_FINAL|g" \
      {} +
else
  # Se vazio, substitui por string vazia
  find /app -type f \( -name "*.js" -o -name "*.json" \) \
    ! -path "/app/node_modules/*" \
    -exec sed -i \
      -e "s|https://placeholder\.api\.base\.url||g" \
      {} +
fi

echo "✅ Placeholders substituídos com sucesso!"
echo "🎯 Iniciando servidor Next.js..."

# Executar node server.js
exec node server.js
