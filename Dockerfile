# Base image com Node.js LTS
FROM node:20-alpine AS base

# Instalação de dependências apenas quando necessário
FROM base AS deps
# Adicionar libc6-compat para compatibilidade no Alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copiar arquivos de dependências
COPY package.json package-lock.json* ./
RUN npm ci

# Builder: reconstruir o código fonte apenas quando necessário
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js coleta dados de telemetria anônimos sobre uso geral.
# Saiba mais aqui: https://nextjs.org/telemetry
# Descomente a linha abaixo caso queira desabilitar a telemetria durante o build.
# ENV NEXT_TELEMETRY_DISABLED=1

# Variáveis públicas com placeholders - serão substituídas em runtime
ARG NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder-anon-key
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ARG NEXT_PUBLIC_API_BASE_URL=https://placeholder.api.base.url

ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

# Para o runtime otimizado (standalone), precisamos gerar /app/.next/standalone no build
ENV NEXT_STANDALONE=1
# Workaround: Turbopack pode falhar com ENOENT/arquivos temporários em alguns FS/CI.
# Forçamos Webpack para builds estáveis no deploy.
RUN npm run build -- --webpack

# Imagem de produção: copiar todos os arquivos e executar next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Descomente a linha abaixo para desabilitar a telemetria durante o runtime.
# ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar arquivos públicos
COPY --from=builder /app/public ./public

# Utilizar standalone output para otimizar a imagem
# https://nextjs.org/docs/advanced-features/output-file-tracing
RUN mkdir -p .next && chown nextjs:nodejs .next

# Copiar arquivos do build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copiar entrypoint script
COPY --chown=nextjs:nodejs entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

USER nextjs

# Usar entrypoint para substituir placeholders em runtime
ENTRYPOINT ["/app/entrypoint.sh"]
