# AutovendaIA - SaaS Frontend

## 🎯 Visão Geral

**AutovendaIA** é um SaaS completo focado em **performance de campanhas** (Google Ads e Meta Ads), **atribuição clique → WhatsApp → venda**, e **envio de conversões offline**. Desenvolvido com Next.js 16, TypeScript, TailwindCSS, shadcn/ui e **Supabase**.

## ✨ Nova Integração Supabase

✅ **Autenticação real** com Supabase Auth
✅ **Banco de dados PostgreSQL** com RLS multi-tenant
✅ **7 tabelas** completas (tenants, profiles, campaigns, leads, interactions, conversions, integrations)
✅ **Tipos TypeScript** gerados automaticamente do schema
✅ **RPC otimizada** para dashboard com fallback para fixtures

**👉 Veja o guia completo em [INTEGRACAO_SUPABASE.md](INTEGRACAO_SUPABASE.md)**

## ✅ Funcionalidades Implementadas

### 1. **Login** (`/login`)

- Formulário com validação de email e senha
- Estados de loading e erro
- Autenticação via token fake no localStorage
- Redirecionamento automático para `/dashboard` após login
- Credenciais de teste: `carlos@autovend.ia`, `ana@autovend.ia`

### 2. **Dashboard** (`/dashboard`)

- **10 KPIs principais:**
  - Investimento
  - Impressões
  - Cliques
  - CTR
  - CPC
  - Leads
  - CPL (Custo por Lead)
  - Vendas
  - Receita
  - ROAS (Return on Ad Spend)
- **Gráfico de Tendência (30 dias):** Evolução de investimento, leads, vendas e receita
- **Gráfico de Funil:** Clique → WhatsApp → Venda
- **Tabela Top Campanhas:** Ordenável por gasto, leads ou ROAS

### 3. **Campanhas** (`/campaigns`)

- Lista completa de campanhas Google Ads e Meta Ads
- **Filtros:**
  - Busca por nome
  - Plataforma (Google/Meta)
  - Status (Ativa/Pausada/Encerrada)
- **Colunas:**
  - Nome da campanha
  - Plataforma
  - Status
  - Gasto
  - Leads
  - Vendas
  - Receita
  - ROAS

### 4. **Leads** (`/leads`)

- Lista completa de leads com **atribuição completa**
- **Filtros:**
  - Busca por nome ou telefone
  - Etapa (Novo, Em conversa WhatsApp, Qualificado, Vendido, Perdido)
  - Plataforma
- **Drawer de detalhes do Lead:**
  - **Atribuição:** Campanha, Adset, Creative, GCLID/FBCLID, UTMs
  - **Timeline WhatsApp:** Histórico de conversas
  - **Venda:** Marcar como vendido com valor
  - **Mover etapa:** Alterar estágio do lead
- Clique em qualquer linha abre o drawer

### 5. **Conversões Offline** (`/conversions`)

- **Cards de métricas:**
  - Conversões hoje
  - Taxa de falha
  - Fila pendente
- **Tabela de histórico:**
  - Lead ID
  - Plataforma
  - Evento (purchase, lead)
  - Valor
  - Data do evento
  - Data de envio
  - Status (Enviado, Falhou, Na fila)
  - Botão "Retry" para conversões falhadas

### 6. **Integrações** (`/integrations`)

- **Cards de status:**
  - Google Ads
  - Meta Ads
  - WhatsApp Business
- Informações de conexão e última sincronização
- Botões para conectar/revalidar/desconectar (stubs)

### 7. **Configurações** (`/settings`)

- Seções placeholder:
  - Empresa
  - Usuários
  - Webhooks
  - Notificações

### 8. **App Shell (Layout Global)**

- **Sidebar colapsável:**
  - Logo AutovendaIA
  - Menu: Dashboard, Campanhas, Leads, Conversões, Integrações, Configurações
  - Indicador visual de página ativa
  - Versão no rodapé
- **TopBar:**
  - Toggle da sidebar
  - Seletor de empresa (tenant)
  - **Busca global (⌘K):** Busca leads por nome/telefone e campanhas por nome
  - Notificações (badge)
  - Avatar do usuário com dropdown (nome, email, logout)

## 🎨 Design System

### Paleta de Cores

```css
--brand-primary: #032858    /* Azul escuro */
--brand-secondary: #2D78AD  /* Azul médio */
--brand-accent: #68B34D     /* Verde */
--brand-background: #F5F9FC /* Azul claro */
--brand-surface: #FFFFFF    /* Branco */
--brand-text: #0F172A       /* Texto escuro */
--brand-muted: #64748B      /* Texto cinza */
```

### Componentes UI (shadcn/ui)

Todos os componentes seguem padrão shadcn/ui:

- Button, Card, Input, Label
- Sheet (Drawer), Table, Badge, Avatar
- Dialog, Popover, Dropdown Menu, Select
- Skeleton (loading states)
- Sonner (toasts)
- Chart (Recharts integration)

## 📁 Estrutura do Projeto

```
autovendia/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx           # Tela de login
│   ├── (app)/
│   │   ├── layout.tsx             # Layout protegido (route group)
│   │   ├── dashboard/
│   │   │   └── page.tsx           # Dashboard com KPIs e gráficos
│   │   ├── campaigns/
│   │   │   └── page.tsx           # Lista de campanhas
│   │   ├── leads/
│   │   │   └── page.tsx           # Lista de leads com filtros
│   │   ├── conversions/
│   │   │   └── page.tsx           # Conversões offline
│   │   ├── integrations/
│   │   │   └── page.tsx           # Status de integrações
│   │   └── settings/
│   │       └── page.tsx           # Configurações
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Redireciona para /login
│   └── globals.css                # Estilos globais + tema
├── components/
│   ├── ui/                        # shadcn/ui components
│   ├── layout/
│   │   ├── AppShell.tsx           # Shell protegido com auth
│   │   ├── AppSidebar.tsx         # Sidebar navegação
│   │   └── TopBar.tsx             # Top bar com busca/notificações
│   ├── dashboard/
│   │   ├── KPICard.tsx            # Card de KPI reutilizável
│   │   ├── TrendChart.tsx         # Gráfico de tendência (Recharts)
│   │   └── FunnelChart.tsx        # Gráfico de funil (Recharts)
│   ├── leads/
│   │   └── LeadDrawer.tsx         # Drawer de detalhes do lead
│   └── query-provider.tsx         # TanStack Query provider
├── types/
│   └── index.ts                   # TypeScript interfaces (novo domínio)
├── fixtures/
│   ├── store.ts                   # Fixture store mutável
│   ├── dashboard.ts               # KPIs e funil mockados
│   ├── timeSeries.ts              # Dados de tendência
│   ├── campaigns.ts               # Campanhas mockadas
│   ├── leads.ts                   # Leads e interações
│   ├── conversions.ts             # Conversões offline
│   └── integrations.ts            # Status de integrações
├── services/
│   ├── http.ts                    # HTTP client com fallback
│   ├── auth.ts                    # Serviço de autenticação
│   ├── dashboard.ts               # Serviço de dashboard
│   ├── campaigns.ts               # Serviço de campanhas
│   ├── leads.ts                   # Serviço de leads
│   ├── conversions.ts             # Serviço de conversões
│   └── integrations.ts            # Serviço de integrações
├── store/
│   └── useStore.ts                # Zustand store global
└── lib/
    └── utils.ts                   # Utility functions
```

## 🧪 Estado dos Dados

### Services + Fixtures (Plugável)

Todos os services tentam bater na API real (se `NEXT_PUBLIC_API_BASE_URL` existir) e, caso contrário, usam fixtures locais:

- `authService` - Autenticação
- `dashboardService` - KPIs, time series, funil
- `campaignsService` - Lista e detalhes de campanhas
- `leadsService` - Lista, detalhes, update de leads
- `conversionsService` - Lista, retry de conversões
- `integrationsService` - Status de integrações

### Zustand Store

Gerencia estado global:

- `user` - Usuário logado
- `selectedLeadId` - Lead selecionado no drawer
- `isLeadDrawerOpen` - Estado do drawer
- `openLeadDrawer()` / `closeLeadDrawer()` - Helpers

### TanStack Query

Cache e sincronização de dados:

- Query keys: `['leads']`, `['campaigns']`, `['conversions']`, `['dashboard', 'kpis']`, etc.
- Invalidação automática após mutations
- Loading e error states

## 🚀 Como Executar

### Opção 1: Desenvolvimento Local com Supabase (Recomendado)

```bash
cd /Users/macbook/Documents/GitHub/new_clinica-ia-conecta/autovendia

# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
# Crie .env.local com as credenciais do Supabase
# (veja INTEGRACAO_SUPABASE.md para detalhes)

# 3. Criar usuário no Supabase Dashboard
# Email: carlos@autovend.ia
# Password: 123456

# 4. Popular banco com dados de teste (opcional)
# Execute o SQL de seed em INTEGRACAO_SUPABASE.md

# 5. Iniciar servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

**Credenciais:**
- `carlos@autovend.ia` / senha definida no Supabase

### Opção 2: Desenvolvimento Local (Fixtures - Legacy)

```bash
cd /Users/macbook/Documents/GitHub/new_clinica-ia-conecta/autovendia
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

### Opção 2: Docker (Produção)

**Início Rápido com Docker Compose:**

```bash
# Construir e iniciar
docker-compose up --build

# Ou em background
docker-compose up -d
```

**Usando o script auxiliar:**

```bash
# Tornar o script executável (apenas primeira vez)
chmod +x docker.sh

# Construir
./docker.sh build

# Iniciar
./docker.sh start

# Ver outros comandos
./docker.sh help
```

**📖 Para instruções detalhadas sobre Docker, veja [README_DOCKER.md](README_DOCKER.md)**

**Credenciais de teste (modo fixture):**

- `carlos@autovend.ia` (Admin)
- `ana@autovend.ia` (Vendedor)
- Qualquer senha funciona no mock (apenas sem Supabase configurado)

## ✨ Diferenciais

1. **Integração Supabase Completa** - Auth, RLS, tipos gerados, multi-tenant
2. **Backend Real + Fallback Fixtures** - Funciona com ou sem dados
3. **UI Premium** - Design limpo, moderno, responsivo
4. **Route Groups** - Organização limpa de rotas (auth vs app)
5. **Estados de Loading** - Skeletons e feedback visual em toda aplicação
6. **Toasts** - Feedback para todas as ações do usuário
7. **Busca Global** - Command palette estilo VS Code (⌘K)
8. **Responsivo** - Funciona em desktop, tablet e mobile
9. **Acessibilidade** - Foco visível, navegação por teclado
10. **TypeScript 100%** - Type safety completo + tipos gerados do banco
11. **Clean Code** - Componentes reutilizáveis e bem organizados
12. **RLS Multi-tenant** - Isolamento completo entre tenants no banco

## 📊 Dados

### Dados Reais (Supabase)
- Multi-tenant com RLS
- Schema completo com 7 tabelas
- Autenticação real com Supabase Auth
- RPC para dashboard otimizado

### Dados Mockados (Fallback)
- **35+ Leads** com atribuição completa (GCLID, FBCLID, UTMs)
- **5 Campanhas** (Google Ads + Meta Ads)
- **Conversões offline** com status de envio
- **Time series** de 30 dias
- **Interações WhatsApp** mockadas
- **KPIs** realistas de performance

## 🎯 Pronto para Produção

O front-end está 100% funcional e integrado com Supabase:

1. ✅ **Autenticação real** - Supabase Auth com sessões persistentes
2. ✅ **Banco de dados** - PostgreSQL com RLS multi-tenant
3. ✅ **Tipos TypeScript** - Gerados automaticamente do schema
4. 🚧 **Próximos passos** - Sincronização com Google Ads API, webhooks WhatsApp

---

**Desenvolvido com ❤️ usando Next.js 16 + TypeScript + TailwindCSS + shadcn/ui**
