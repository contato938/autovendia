# Migração Completa - AutovendaIA

## ✅ Todas as tarefas completadas

### 1. Route Groups + Layout Protegido
- ✅ Criado `app/(auth)/login/page.tsx`
- ✅ Criado `app/(app)/layout.tsx` com layout protegido
- ✅ Criado `components/layout/AppShell.tsx` com auth via localStorage
- ✅ Atualizado `app/page.tsx` para redirect
- ✅ Removidos layouts duplicados (dashboard, leads, settings, pipeline)

### 2. Sidebar e TopBar
- ✅ Reescrito `AppSidebar.tsx` com novo menu (Dashboard, Campanhas, Leads, Conversões, Integrações, Configurações)
- ✅ Reescrito `TopBar.tsx` com busca global de leads + campanhas via services
- ✅ Removidas dependências diretas de `mocks/data.ts`

### 3. Types + Services + Fixtures
- ✅ Substituído `types/index.ts` com novo domínio (AdsPlatform, Campaign, Lead, OfflineConversion, etc)
- ✅ Criado `services/http.ts` com fallback para fixtures
- ✅ Criados services: auth, dashboard, campaigns, leads, conversions, integrations
- ✅ Criados fixtures: dashboard, timeSeries, campaigns, leads, conversions, integrations
- ✅ Criado `fixtures/store.ts` para mutations no modo sem backend
- ✅ Removido `services/api.ts` antigo

### 4. Dashboard
- ✅ Reescrito com 10 KPIs (Investimento, Impressões, Cliques, CTR, CPC, Leads, CPL, Vendas, Receita, ROAS)
- ✅ Criado `TrendChart.tsx` (client component) com Recharts
- ✅ Criado `FunnelChart.tsx` (client component) com Recharts
- ✅ Tabela Top Campanhas ordenável
- ✅ Dados via `dashboardService` com fallback em fixtures

### 5. Páginas Restantes
- ✅ **Campanhas** (`app/(app)/campaigns/page.tsx`): Lista com filtros (plataforma, status)
- ✅ **Leads** (`app/(app)/leads/page.tsx`): Lista com filtros (stage, plataforma)
- ✅ **LeadDrawer** reescrito com:
  - Atribuição completa (campanha, adset, creative, GCLID/FBCLID, UTMs)
  - Timeline WhatsApp
  - Marcar venda (cria conversão offline)
  - Mover stage
- ✅ **Conversões** (`app/(app)/conversions/page.tsx`): Lista + retry de conversões falhadas
- ✅ **Integrações** (`app/(app)/integrations/page.tsx`): Cards de status Google Ads, Meta Ads, WhatsApp
- ✅ **Settings** (`app/(app)/settings/page.tsx`): Placeholders

### 6. Limpeza
- ✅ Removido `app/kanban-demo/`
- ✅ Removido `app/pipeline/`
- ✅ Removido `components/ui/kanban-board.tsx`
- ✅ Removido `components/layout/ProtectedLayout.tsx` (substituído por AppShell)
- ✅ Removido `mocks/data.ts` (substituído por fixtures)
- ✅ Removidas rotas antigas: `app/dashboard`, `app/leads`, `app/settings`, `app/login`
- ✅ Atualizado `README.md` completo

### 7. Build e Lint
- ✅ `npm run build` funcionando (11 rotas estáticas geradas)
- ✅ TypeScript compilando sem erros
- ✅ Corrigido erro de escopo em `fixtures/leads.ts`

## 🎯 Estrutura Final

```
app/
├── (auth)/
│   └── login/page.tsx
├── (app)/
│   ├── layout.tsx (protegido)
│   ├── dashboard/page.tsx
│   ├── campaigns/page.tsx
│   ├── leads/page.tsx
│   ├── conversions/page.tsx
│   ├── integrations/page.tsx
│   └── settings/page.tsx
├── layout.tsx (root)
└── page.tsx (redirect)

components/
├── layout/
│   ├── AppShell.tsx (auth + proteção)
│   ├── AppSidebar.tsx (novo menu)
│   └── TopBar.tsx (busca global)
├── dashboard/
│   ├── KPICard.tsx
│   ├── TrendChart.tsx (client)
│   └── FunnelChart.tsx (client)
└── leads/
    └── LeadDrawer.tsx (refeito)

services/
├── http.ts (fallback fixtures)
├── auth.ts
├── dashboard.ts
├── campaigns.ts
├── leads.ts
├── conversions.ts
└── integrations.ts

fixtures/
├── store.ts (mutável)
├── dashboard.ts
├── timeSeries.ts
├── campaigns.ts
├── leads.ts
├── conversions.ts
└── integrations.ts

types/index.ts (novo domínio)
```

## 🚀 Como usar

### Desenvolvimento
```bash
npm run dev
```

Acesse http://localhost:3000 e faça login com `carlos@autovend.ia` (qualquer senha).

### Produção
```bash
npm run build
npm start
```

### Conectar com backend real
Configure a variável de ambiente:
```bash
NEXT_PUBLIC_API_BASE_URL=https://api.autovendia.com.br
```

## ✨ Funcionalidades

1. **Auth simples** via token no localStorage
2. **Dashboard** com 10 KPIs + gráficos de tendência e funil
3. **Campanhas** Google Ads e Meta Ads
4. **Leads** com atribuição completa (GCLID, FBCLID, UTMs)
5. **Conversões offline** com retry
6. **Integrações** Google Ads, Meta Ads, WhatsApp
7. **Busca global** de leads e campanhas (⌘K)
8. **Backend plugável** - funciona offline com fixtures, pronto para conectar API real

## 📊 Dados

- 35+ leads com atribuição completa
- 5 campanhas (Google + Meta)
- Time series de 30 dias
- Conversões offline com status
- Interações WhatsApp mockadas
