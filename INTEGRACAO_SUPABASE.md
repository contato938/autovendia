# Integração Supabase - Resumo Final

## ✅ Implementação Completa

Todas as etapas do plano foram executadas com sucesso:

1. ✅ Validado estado do projeto Supabase e configuradas variáveis de ambiente
2. ✅ Criadas migrations com schema multi-tenant + RLS
3. ✅ Gerados tipos TypeScript do banco
4. ✅ Implementado client Supabase no frontend
5. ✅ Migrada autenticação para Supabase Auth
6. ✅ Reimplementados todos os services para Supabase
7. ✅ Criada função RPC para dashboard com fallback para fixtures

## 🗄️ Schema do Banco

### Tabelas Criadas

- **tenants**: Empresas/organizações
- **profiles**: Perfis de usuários (1:1 com auth.users)
- **campaigns**: Campanhas publicitárias (Google/Meta)
- **leads**: Leads com atribuição completa
- **lead_interactions**: Histórico de interações (WhatsApp, calls)
- **offline_conversions**: Conversões offline para envio às plataformas
- **integrations**: Status de integrações (Google Ads, WhatsApp, etc)

### Segurança (RLS)

- ✅ RLS habilitado em todas as tabelas
- ✅ Políticas baseadas em `tenant_id` via `profiles`
- ✅ Isolamento completo entre tenants
- ✅ Trigger automático para criar profile ao registrar usuário

## 🔧 Configuração

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie `.env.local` na raiz do projeto:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://hzsuzblmuxyjiyfkqpci.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6c3V6YmxtdXh5aml5ZmtxcGNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3NzAwODcsImV4cCI6MjA4NDM0NjA4N30.8L0D2EyllQdzNBuBA7TVSHYtLLW3_Occ4_v8zue2qNk
```

### 3. Criar Usuário de Teste

Acesse o Supabase Dashboard → Authentication → Users e crie um usuário:

- Email: `carlos@autovend.ia`
- Password: `123456` (ou qualquer senha)

O trigger `handle_new_user` criará automaticamente o profile associado ao tenant padrão.

## 📊 Popular com Dados de Teste (Opcional)

Execute via SQL Editor no Supabase:

```sql
-- Inserir campanhas de exemplo
INSERT INTO public.campaigns (tenant_id, platform, name, status, spend, leads, purchases, revenue, roas)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'google', 'Google Search - Peças Automotivas SP', 'active', 5234.50, 87, 12, 24680.00, 4.71),
  ('00000000-0000-0000-0000-000000000001', 'google', 'Google Search - Freios e Suspensão', 'active', 3890.20, 65, 9, 18450.00, 4.74),
  ('00000000-0000-0000-0000-000000000001', 'google', 'Google Display - Manutenção Veículos', 'active', 2145.80, 42, 5, 9820.00, 4.58),
  ('00000000-0000-0000-0000-000000000001', 'google', 'Google Shopping - Kit Embreagem', 'paused', 1567.30, 28, 3, 6240.00, 3.98);

-- Inserir leads de exemplo
INSERT INTO public.leads (
  tenant_id, campaign_id, name, phone, stage, platform, 
  campaign_name, gclid, utm_source, utm_campaign, utm_medium,
  first_message_at, last_message_at
)
SELECT 
  '00000000-0000-0000-0000-000000000001',
  c.id,
  'Lead Teste ' || i,
  '+5511' || LPAD((90000000 + i)::text, 8, '0'),
  CASE 
    WHEN i % 5 = 0 THEN 'Vendido'
    WHEN i % 5 = 1 THEN 'Qualificado'
    WHEN i % 5 = 2 THEN 'Em conversa (WhatsApp)'
    ELSE 'Novo'
  END,
  'google',
  c.name,
  'gclid_test_' || i,
  'google',
  'campaign_' || i,
  'cpc',
  NOW() - (i || ' hours')::interval,
  NOW() - ((i / 2) || ' hours')::interval
FROM public.campaigns c
CROSS JOIN generate_series(1, 10) i
WHERE c.tenant_id = '00000000-0000-0000-0000-000000000001'
LIMIT 40;

-- Marcar alguns leads como vendidos com valor
UPDATE public.leads
SET 
  sale_value = 1500 + (random() * 1000)::numeric(10,2),
  sale_currency = 'BRL',
  sale_happened_at = NOW() - (random() * 30 || ' days')::interval,
  sale_status = 'won'
WHERE stage = 'Vendido';

-- Inserir algumas interações
INSERT INTO public.lead_interactions (lead_id, type, direction, content, created_at)
SELECT 
  l.id,
  'whatsapp',
  CASE WHEN i % 2 = 0 THEN 'in' ELSE 'out' END,
  CASE 
    WHEN i % 2 = 0 THEN 'Oi, tenho interesse no produto!'
    ELSE 'Olá! Tudo bem? Como posso ajudar?'
  END,
  l.first_message_at + (i || ' minutes')::interval
FROM public.leads l
CROSS JOIN generate_series(1, 3) i
WHERE l.tenant_id = '00000000-0000-0000-0000-000000000001'
LIMIT 50;
```

## 🚀 Como Executar

```bash
npm run dev
```

Acesse http://localhost:3000 e faça login com:
- Email: `carlos@autovend.ia`
- Senha: a senha que você definiu ao criar o usuário no Supabase

## 🔄 Fluxo de Autenticação

1. **Login** (`/login`): `supabase.auth.signInWithPassword()`
2. **Session persistida**: localStorage automático via Supabase
3. **AppShell**: Carrega session + profile do banco
4. **RLS**: Todas as queries filtradas automaticamente por `tenant_id`
5. **Logout**: `supabase.auth.signOut()` + limpeza do estado

## 📁 Arquitetura de Dados

```
User → Supabase Auth (auth.users)
  ↓
Profile (public.profiles) → Tenant (public.tenants)
  ↓
Campaigns, Leads, Conversions, Integrations (filtradas por tenant_id)
```

## 🎯 Próximos Passos

- [ ] Popular banco com dados reais de produção
- [ ] Implementar job para sincronizar campanhas do Google Ads
- [ ] Criar webhook para receber mensagens do WhatsApp
- [ ] Implementar envio real de conversões offline (Google Ads API)
- [ ] Adicionar série temporal real para o dashboard
- [ ] Criar telas de gestão de usuários e permissões

## 📝 Notas Importantes

- **Dashboard**: Usa RPC `dashboard_google_summary()` com fallback para fixtures quando não há dados
- **Services**: Todos migrados para Supabase, mantendo mesma interface da API
- **Types**: Gerados automaticamente do schema via MCP
- **RLS**: Garante isolamento total entre tenants
- **Auth**: Supabase Auth gerencia sessões e refresh tokens automaticamente
