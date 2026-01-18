# Guia Rápido: Primeiro Acesso

## 1. Criar Usuário no Supabase

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione o projeto `autovendia` (ref: `hzsuzblmuxyjiyfkqpci`)
3. Vá em **Authentication** → **Users**
4. Clique em **Add user** → **Create new user**
5. Preencha:
   - **Email**: `carlos@autovend.ia`
   - **Password**: `123456` (ou qualquer senha segura)
   - ✅ Marque **Auto Confirm User**
6. Clique em **Create user**

## 2. Verificar Profile Criado

O trigger `handle_new_user` criará automaticamente o profile. Para verificar:

```sql
-- No SQL Editor do Supabase
SELECT 
  p.*,
  t.nome as tenant_nome
FROM public.profiles p
JOIN public.tenants t ON p.tenant_id = t.id
WHERE p.id = (
  SELECT id FROM auth.users WHERE email = 'carlos@autovend.ia'
);
```

Você deve ver um registro com:
- `nome`: `carlos@autovend.ia` (ou nome do metadata)
- `role`: `vendedor` (ou role do metadata)
- `tenant_id`: `00000000-0000-0000-0000-000000000001`

## 3. Popular com Dados de Teste (Opcional)

Execute o script SQL de seed:

```bash
# Copie o conteúdo de supabase-seed.sql
# Cole no SQL Editor do Supabase
# Clique em "Run"
```

Ou via CLI:

```bash
# Se tiver Supabase CLI instalado
supabase db reset --linked
```

## 4. Configurar .env.local

Crie o arquivo `.env.local` na raiz do projeto:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://hzsuzblmuxyjiyfkqpci.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6c3V6YmxtdXh5aml5ZmtxcGNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3NzAwODcsImV4cCI6MjA4NDM0NjA4N30.8L0D2EyllQdzNBuBA7TVSHYtLLW3_Occ4_v8zue2qNk
```

## 5. Instalar e Executar

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

## 6. Fazer Login

1. Acesse http://localhost:3000
2. Você será redirecionado para `/login`
3. Entre com:
   - **Email**: `carlos@autovend.ia`
   - **Password**: a senha que você criou no passo 1

## 7. Verificar Funcionamento

Após o login, você deve:
- ✅ Ver o dashboard com dados (se executou o seed) ou fixtures
- ✅ Poder navegar entre páginas: Campanhas, Leads, Conversões, Integrações
- ✅ Busca global funcionar (⌘K)
- ✅ Logout funcionar

## 🐛 Troubleshooting

### Erro: "User profile not found"

Execute no SQL Editor:

```sql
-- Verificar se o profile existe
SELECT * FROM public.profiles WHERE id = (
  SELECT id FROM auth.users WHERE email = 'carlos@autovend.ia'
);

-- Se não existir, criar manualmente
INSERT INTO public.profiles (id, tenant_id, nome, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'carlos@autovend.ia'),
  '00000000-0000-0000-0000-000000000001',
  'Carlos Gerente',
  'admin'
);
```

### Erro: "Faltam variáveis de ambiente"

Verifique se o arquivo `.env.local` existe e tem as variáveis corretas.

### Dashboard vazio

Isso é normal se você não executou o seed. O dashboard usa fixtures como fallback.

Para popular o banco:
1. Execute `supabase-seed.sql` no SQL Editor
2. Recarregue a página

### RLS bloqueando queries

Se ver erro "new row violates row-level security policy", significa que:
1. O usuário não tem profile criado, OU
2. O profile não está vinculado ao tenant correto

Execute:

```sql
-- Verificar tenant_id do usuário logado
SELECT 
  u.email,
  p.tenant_id,
  t.nome as tenant_nome
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
LEFT JOIN public.tenants t ON p.tenant_id = t.id
WHERE u.email = 'carlos@autovend.ia';
```

## 📚 Recursos

- [INTEGRACAO_SUPABASE.md](INTEGRACAO_SUPABASE.md) - Documentação completa da integração
- [supabase-seed.sql](supabase-seed.sql) - Script de seed com dados de teste
- [SUPABASE_SETUP.md](SUPABASE_SETUP.md) - Informações técnicas das extensões
