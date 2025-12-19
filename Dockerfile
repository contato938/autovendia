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

RUN npm run build

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
RUN mkdir .next

# Copiar arquivos do build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Comando para iniciar a aplicação
CMD ["node", "server.js"]
