# AUTOVEND IA - SaaS Frontend MVP

## 🎯 Visão Geral

O **AUTOVEND IA** é um SaaS completo de automação de vendas para autopeças, desenvolvido com Next.js, TypeScript, TailwindCSS e shadcn/ui. Todo o sistema funciona 100% com dados mockados locais, sem necessidade de backend.

## ✅ Funcionalidades Implementadas

### 1. **Login** (`/login`)

- Formulário com validação de email e senha
- Estados de loading e erro
- Mock de autenticação com Zustand
- Redirecionamento automático para `/dashboard` após login
- Credenciais de teste: `carlos@autovend.ia`, `ana@autovend.ia`, `pedro@autovend.ia`

### 2. **Dashboard** (`/dashboard`)

- **6 KPIs principais:**
  - Leads Gerados
  - Orçamentos Enviados
  - Vendas
  - Taxa de Conversão
  - CAC Estimado
  - ROI Estimado
- **Gráfico de Funil:** Visualização da jornada dos leads (Leads → Orçamentos → Vendas)
- **Gráfico de ROI:** Linha do tempo mostrando evolução do ROI
- **Tabela de Últimos Leads:** Acesso rápido aos 5 leads mais recentes
- Clique em qualquer lead abre o Drawer de detalhes

### 3. **Leads** (`/leads`)

- **Lista completa** de todos os leads (35+ mockados)
- **Filtros:**
  - Busca por nome ou telefone
  - Filtro por etapa do funil
- **Tabela com colunas:**
  - Lead (nome + telefone)
  - Veículo / Peça
  - Origem (Google Ads, Indicação, Orgânico)
  - Canal (WhatsApp ou Telefone)
  - Etapa atual
  - Score (0-100)
  - Último contato
  - Botão de ações
- Clique em qualquer linha abre o Drawer de detalhes

### 4. **Pipeline** (`/pipeline`)

- **Kanban Board com Drag & Drop** (usando `@hello-pangea/dnd`)
- **7 colunas de etapas:**
  1. Novo
  2. Em atendimento
  3. Orçamento gerado
  4. Orçamento enviado
  5. Negociação
  6. Fechado
  7. Perdido
- **Cards de lead mostram:**
  - Nome do lead
  - Veículo e peça
  - Origem/campanha
  - Score
  - Tempo desde último contato
- Arrastar e soltar atualiza a etapa automaticamente
- Toast de confirmação após atualização
- Scroll independente por coluna

### 5. **Drawer de Detalhes do Lead**

- **Informações principais:**
  - Nome e telefone
  - Score e canal
  - Origem e campanha
  - Veículo completo (marca, modelo, ano)
  - Peça requisitada (nome, SKU, compatibilidade)
- **Timeline de Interações:**
  - WhatsApp (em formato de chat bubble)
  - Ligações (com transcrição mockada)
  - Data e hora de cada interação
- **Resumo da IA (mock):**
  - Análise automática do lead
  - Próximos passos recomendados
- **Botões de ação:**
  - Gerar Orçamento
  - Mover Etapa

### 6. **Configurações** (`/settings`)

- Página placeholder com cards para:
  - Configurações Gerais
  - Notificações
  - Usuários e Permissões
  - Integrações

### 7. **App Shell (Layout Global)**

- **Sidebar colapsável:**
  - Logo AUTOVEND IA
  - Menu com: Dashboard, Leads, Pipeline, Configurações
  - Versão do app no rodapé
  - Indicador visual de página ativa
- **TopBar:**
  - Botão de toggle da sidebar
  - Seletor de tenant (empresa) com dropdown
  - **Busca global:** Command palette com atalho ⌘K
  - Sino de notificações (com contador badge)
  - Avatar do usuário com dropdown (nome, email, logout)

## 🎨 Design System

### Paleta de Cores

```css
--brand-primary: #032858    /* Azul escuro */
--brand-secondary: #2D78AD  /* Azul médio */
--brand-accent: #68B34D     /* Verde */
--brand-background: #F5F9FC /* Azul claro */
--brand-surface: #FFFFFF    /* Branco */
--brand-text: #0F172A        /* Texto escuro */
--brand-muted: #64748B       /* Texto cinza */
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
│   ├── login/
│   │   └── page.tsx           # Tela de login
│   ├── dashboard/
│   │   ├── layout.tsx         # Layout protegido
│   │   └── page.tsx           # Dashboard com KPIs e gráficos
│   ├── leads/
│   │   ├── layout.tsx         # Layout protegido
│   │   └── page.tsx           # Lista de leads com filtros
│   ├── pipeline/
│   │   ├── layout.tsx         # Layout protegido
│   │   └── page.tsx           # Kanban drag-and-drop
│   ├── settings/
│   │   ├── layout.tsx         # Layout protegido
│   │   └── page.tsx           # Configurações (placeholder)
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Redireciona para /login
│   └── globals.css            # Estilos globais + tema
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── layout/
│   │   ├── AppSidebar.tsx     # Sidebar navegação
│   │   ├── TopBar.tsx         # Top bar com busca/notificações
│   │   └── ProtectedLayout.tsx # Layout wrapper autenticado
│   ├── dashboard/
│   │   └── KPICard.tsx        # Card de KPI reutilizável
│   ├── leads/
│   │   └── LeadDrawer.tsx     # Drawer de detalhes do lead
│   └── query-provider.tsx     # TanStack Query provider
├── types/
│   └── index.ts               # TypeScript interfaces
├── mocks/
│   └── data.ts                # Dados mockados (35+ leads)
├── services/
│   └── api.ts                 # Mock API com delays simulados
├── store/
│   └── useStore.ts            # Zustand store global
└── lib/
    └── utils.ts               # Utility functions
```

## 🧪 Estado dos Dados

### Mock API (`services/api.ts`)

Todas as requisições simulam delay de 300-800ms para parecer real:

- `api.auth.login()` - Mock de autenticação
- `api.leads.list()` - Lista todos os leads
- `api.leads.getById()` - Busca lead por ID
- `api.leads.update()` - Atualiza lead (etapa, responsável, etc.)
- `api.leads.getInteractions()` - Histórico de interações
- `api.dashboard.getStats()` - KPIs do dashboard

### Zustand Store

Gerencia estado global:

- `user` - Usuário logado
- `selectedLeadId` - Lead selecionado no drawer
- `isLeadDrawerOpen` - Estado do drawer
- `openLeadDrawer()` / `closeLeadDrawer()` - Helpers

### TanStack Query

Cache e sincronização de dados:

- Query keys: `['leads']`, `['lead', id]`, `['interactions', leadId]`, `['dashboardStats']`
- Invalidação automática após mutations
- Loading e error states

## 🚀 Como Executar

```bash
cd /Users/macbook/Documents/GitHub/new_clinica-ia-conecta/autovendia
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

**Credenciais de teste:**

- `carlos@autovend.ia` (Admin)
- `ana@autovend.ia` (Vendedor)
- `pedro@autovend.ia` (Vendedor)
- Qualquer senha funciona no mock

## ✨ Diferenciais

1. **100% Funcional Offline** - Nenhuma dependência de backend
2. **UI Premium** - Design limpo, moderno, responsivo
3. **Drag & Drop Real** - Pipeline kanban totalmente funcional
4. **Estados de Loading** - Skeletons e feedback visual em toda aplicação
5. **Toasts** - Feedback para todas as ações do usuário
6. **Busca Global** - Command palette estilo VS Code (⌘K)
7. **Responsivo** - Funciona em desktop, tablet e mobile
8. **Acessibilidade** - Foco visível, navegação por teclado
9. **TypeScript 100%** - Type safety completo
10. **Clean Code** - Componentes reutilizáveis e bem organizados

## 📊 Dados Mockados

- **35+ Leads** com informações completas
- **3 Usuários** (Carlos, Ana, Pedro)
- **1 Tenant** (AutoPeças Silva)
- **Interações** de WhatsApp e ligações
- **KPIs** realistas do dashboard
- **Veículos** das principais marcas (Fiat, VW, Chevrolet, Ford, Toyota)
- **Peças** variadas (Amortecedor, Pastilha de Freio, Kit Embreagem, etc.)

## 🎯 Pronto para Produção

O front-end está 100% funcional e pronto para:

1. **Conectar API real** - Apenas substituir `services/api.ts`
2. **Adicionar autenticação real** - JWT, OAuth, etc.
3. **Implementar formulários** - Criar/editar leads, orçamentos
4. **Expandir funcionalidades** - Relatórios, automações, IA real

---

**Desenvolvido com ❤️ usando Next.js 16 + TypeScript + TailwindCSS + shadcn/ui**
