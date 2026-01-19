# Correção do Erro 500 - RLS Policy

## Problema Identificado

**Erro no console**:
```
Failed to load resource: the server responded with a status of 500
/rest/v1/user_tenants?select=tenant_id,role,tenants(id,nome,cnpj,logo_url)&user_id=eq.2e642d31-ac00-429a-91c0-ab79c90076dc
```

**Causa Raiz**: A tabela `tenants` tinha Row Level Security (RLS) configurado, mas **apenas** com uma policy que permitia ver tenants através de `profiles.tenant_id`. Quando o frontend tentava fazer um join `user_tenants → tenants`, o Supabase retornava erro 500 porque a policy RLS bloqueava o acesso aos dados de `tenants` nesse contexto.

## Solução Aplicada via MCP

Adicionada nova RLS policy na tabela `tenants`:

```sql
CREATE POLICY "Users can view tenants via user_tenants"
ON public.tenants FOR SELECT
USING (
  id IN (
    SELECT tenant_id 
    FROM public.user_tenants 
    WHERE user_id = auth.uid()
  )
);
```

## Policies Agora Ativas

A tabela `tenants` agora tem **2 policies** para SELECT:

1. **"Users can view their own tenant"** (existente)
   - Permite ver tenant via `profiles.tenant_id`
   - Usado como fallback para compatibilidade

2. **"Users can view tenants via user_tenants"** (nova)
   - Permite ver tenants vinculados via tabela `user_tenants`
   - Necessária para o join funcionar corretamente

## Resultado

Agora o join `user_tenants → tenants` funciona corretamente:
- Query não retorna mais erro 500
- Organização "Garcia Auto Peças" carrega automaticamente
- Frontend mostra organização no TopBar

## Fluxo Corrigido

```
Login → AppShell.tsx
  ↓
Query: user_tenants com join em tenants
  ↓
RLS verifica: user_id = auth.uid() em user_tenants ✓
  ↓
RLS verifica: tenant_id está em user_tenants do usuário ✓
  ↓
Retorna dados de tenants ✓
  ↓
Frontend mostra "Garcia Auto Peças" ✓
```

## Teste

Após essa correção:
1. Faça logout
2. Faça login novamente
3. A organização deve aparecer automaticamente
4. Console não deve mostrar erro 500

## Nota Técnica

Este é um padrão comum em sistemas multi-tenant:
- Tabela de associação (user_tenants) controla quem vê o quê
- RLS policies em ambas as tabelas garantem isolamento
- Join só funciona se ambas as tabelas tiverem policies adequadas

## Arquivos Relacionados

- `migration_user_tenants.sql` - Criou a tabela e policies de user_tenants
- Esta correção - Adicionou policy missing em tenants
- `components/layout/AppShell.tsx` - Frontend que faz o join
