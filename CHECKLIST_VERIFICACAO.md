# ✅ Checklist de Verificação Pós-Integração

Use este checklist para garantir que a integração Supabase está 100% funcional.

## 🔧 Configuração Inicial

- [ ] **Variáveis de ambiente configuradas** (`.env.local` existe com `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- [ ] **Dependências instaladas** (`npm install` executado)
- [ ] **Usuário criado no Supabase Auth** (ex: `carlos@autovend.ia`)
- [ ] **Profile criado automaticamente** (verificar via SQL: `SELECT * FROM profiles`)
- [ ] **Tenant padrão existe** (`SELECT * FROM tenants WHERE id = '00000000-0000-0000-0000-000000000001'`)

## 🔐 Autenticação

- [ ] **Login funciona** (redireciona para `/dashboard` após sucesso)
- [ ] **Sessão persiste** (recarregar página mantém usuário logado)
- [ ] **Logout funciona** (limpa sessão e redireciona para `/login`)
- [ ] **Proteção de rotas funciona** (acessar `/dashboard` sem login redireciona para `/login`)
- [ ] **Redirect após login funciona** (se tentar acessar `/leads` sem login, após login vai para `/leads`)

## 📊 Dados e RLS

### Campanhas
- [ ] **Lista campanhas** (GET `/campaigns` via `supabase.from('campaigns').select()`)
- [ ] **Filtra por tenant** (não vê campanhas de outros tenants)
- [ ] **Cria campanha** (se implementado)
- [ ] **Atualiza campanha** (se implementado)

### Leads
- [ ] **Lista leads** (GET `/leads`)
- [ ] **Busca lead por ID** (GET `/leads/:id`)
- [ ] **Filtra leads** (busca por nome/telefone funciona)
- [ ] **Abre drawer de lead** (clique em lead abre detalhes)
- [ ] **Carrega interações** (histórico WhatsApp aparece no drawer)
- [ ] **Atualiza stage** (mover lead entre etapas funciona)
- [ ] **Marca como vendido** (adicionar valor de venda funciona)

### Conversões Offline
- [ ] **Lista conversões** (GET `/conversions`)
- [ ] **Filtra por status** (sent/failed/queued)
- [ ] **Retry funciona** (botão Retry muda status para queued)
- [ ] **Estatísticas corretas** (cards mostram totais corretos)

### Integrações
- [ ] **Lista integrações** (GET `/integrations`)
- [ ] **Status correto** (mostra connected/disconnected)
- [ ] **Última sincronização** (timestamp formatado corretamente)

### Dashboard
- [ ] **Carrega dados** (se tiver dados no banco) ou fixtures (se banco vazio)
- [ ] **KPIs calculados corretamente**
- [ ] **Tabela de campanhas ordenada por gasto**
- [ ] **Gráficos renderizam** (trend chart, funil, etc)
- [ ] **Filtros funcionam** (date range picker)

## 🔍 Busca Global (⌘K)

- [ ] **Abre com ⌘K** (ou Ctrl+K no Windows)
- [ ] **Busca leads por nome**
- [ ] **Busca leads por telefone**
- [ ] **Busca campanhas por nome**
- [ ] **Clique em lead abre drawer**
- [ ] **Clique em campanha navega para página**

## 🎨 UI/UX

- [ ] **Sidebar colapsa/expande**
- [ ] **Dark mode funciona** (se implementado)
- [ ] **Loading skeletons aparecem**
- [ ] **Toasts aparecem em ações** (sucesso/erro)
- [ ] **Responsivo** (funciona em mobile/tablet)
- [ ] **Badges coloridos** (status de campanha/lead)

## 🐛 Tratamento de Erros

- [ ] **Login com credenciais inválidas** (mostra erro)
- [ ] **Sessão expirada** (redireciona para login)
- [ ] **Erro de rede** (mostra mensagem amigável)
- [ ] **RLS bloqueio** (se tentar acessar dados de outro tenant, retorna vazio sem erro no console)
- [ ] **Query inválida** (tratada graciosamente)

## 🔒 Segurança

- [ ] **RLS habilitado em todas as tabelas** (verificar via SQL)
- [ ] **Políticas criadas** (SELECT, INSERT, UPDATE, DELETE)
- [ ] **Não consegue ver dados de outros tenants** (testar com 2 usuários)
- [ ] **JWT valida automaticamente** (não precisa validar manualmente)
- [ ] **HTTPS obrigatório em produção** (Supabase só aceita HTTPS)

## ⚡ Performance

- [ ] **Queries rápidas** (<200ms para queries simples)
- [ ] **Dashboard RPC otimizado** (<500ms mesmo com muitos dados)
- [ ] **Índices criados** (tenant_id, stage, status, etc)
- [ ] **Sem N+1 queries** (usar `.select('*, foreign_key(*)')` quando necessário)
- [ ] **TanStack Query cacheia** (recarregar página não faz fetch desnecessário)

## 📱 Testes Cross-browser

- [ ] **Chrome/Edge** (Chromium)
- [ ] **Firefox**
- [ ] **Safari** (macOS/iOS)
- [ ] **Mobile Safari** (iPhone)
- [ ] **Chrome Mobile** (Android)

## 🚀 Deploy (Quando pronto)

- [ ] **Build funciona** (`npm run build` sem erros)
- [ ] **Variáveis de ambiente em produção** (Vercel/Netlify/etc)
- [ ] **URL do Supabase correto** (produção vs staging)
- [ ] **CORS configurado** (se necessário)
- [ ] **Domínio customizado** (se configurado no Supabase)

## 🔍 Debug Tools

Se algo não funcionar:

### 1. Verificar Sessão
```typescript
const { data: { session } } = await supabase.auth.getSession();
console.log('Session:', session);
```

### 2. Verificar Profile
```sql
SELECT 
  u.email,
  p.*, 
  t.nome as tenant_nome
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
LEFT JOIN public.tenants t ON p.tenant_id = t.id
WHERE u.email = 'carlos@autovend.ia';
```

### 3. Testar RLS Manualmente
```sql
-- Executar como service_role (desabilitado RLS)
SELECT * FROM leads;

-- Executar como usuário autenticado (com RLS)
-- Deve retornar apenas dados do tenant do usuário
```

### 4. Ver Logs de Erro
```bash
# No browser console
# Filtrar por "Supabase" ou "RLS"

# No Supabase Dashboard
# Logs & Analytics → Query Performance
```

### 5. Verificar Network Tab
```
# Verificar se requests para Supabase incluem:
Authorization: Bearer <jwt_token>
apikey: <anon_key>
```

## ✅ Tudo OK?

Se todos os itens acima estão marcados, a integração está 100% funcional! 🎉

## 📞 Suporte

- Issues no GitHub: [criar issue]
- Supabase Discord: https://discord.supabase.com
- Documentação: [INTEGRACAO_SUPABASE.md](INTEGRACAO_SUPABASE.md)
