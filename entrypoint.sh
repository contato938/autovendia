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

RUNTIME_DIR="/tmp/autovendia-runtime"

echo "📦 Preparando runtime em $RUNTIME_DIR..."
rm -rf "$RUNTIME_DIR"
mkdir -p "$RUNTIME_DIR"

if [ ! -f "/app/server.js" ]; then
  echo "❌ ERRO: /app/server.js não encontrado. O build standalone pode ter falhado."
  exit 1
fi

if [ ! -d "/app/.next" ]; then
  echo "❌ ERRO: /app/.next não encontrado. O build do Next.js pode ter falhado."
  exit 1
fi

cp /app/server.js "$RUNTIME_DIR/server.js"
cp -R /app/.next "$RUNTIME_DIR/.next"

ln -s /app/node_modules "$RUNTIME_DIR/node_modules"
ln -s /app/public "$RUNTIME_DIR/public"

echo "🔄 Substituindo placeholders no bundle Next.js (runtime em /tmp)..."

replace_placeholders_in_file() {
  file="$1"
  tmpfile="${file}.tmp"

  if [ -n "$API_BASE_URL_FINAL" ]; then
    sed \
      -e "s|https://placeholder\.supabase\.co|$SUPABASE_URL_FINAL|g" \
      -e "s|placeholder-anon-key|$SUPABASE_ANON_KEY_FINAL|g" \
      -e "s|http://localhost:3000|$SITE_URL_FINAL|g" \
      -e "s|https://placeholder\.api\.base\.url|$API_BASE_URL_FINAL|g" \
      "$file" > "$tmpfile" && mv "$tmpfile" "$file"
  else
    sed \
      -e "s|https://placeholder\.supabase\.co|$SUPABASE_URL_FINAL|g" \
      -e "s|placeholder-anon-key|$SUPABASE_ANON_KEY_FINAL|g" \
      -e "s|http://localhost:3000|$SITE_URL_FINAL|g" \
      -e "s|https://placeholder\.api\.base\.url||g" \
      "$file" > "$tmpfile" && mv "$tmpfile" "$file"
  fi
}

replace_placeholders_in_file "$RUNTIME_DIR/server.js"

if [ -d "$RUNTIME_DIR/.next" ]; then
  find "$RUNTIME_DIR/.next" -type f \( -name "*.js" -o -name "*.json" \) | while read file; do
    replace_placeholders_in_file "$file"
  done
fi

echo "✅ Placeholders substituídos com sucesso!"
echo "🎯 Iniciando servidor Next.js..."

cd "$RUNTIME_DIR"
exec node server.js
