# Correção do Erro 500 - Recursão em RLS Policy

## Problema Identificado

O erro HTTP 500 nas chamadas REST para `user_tenants` e `tenants` foi causado por uma **política RLS recursiva** na tabela `user_tenants`.

### Política Problemática

```sql
CREATE POLICY "Tenant admins can view tenant associations" 
ON public.user_tenants FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM user_tenants ut  -- ❌ RECURSÃO!
    WHERE ut.user_id = auth.uid() 
      AND ut.tenant_id = user_tenants.tenant_id 
      AND ut.role = 'admin'
  )
);
```

Esta política causava **recursão infinita** porque:
1. Para verificar se o usuário pode ler `user_tenants`, ela consulta a própria tabela `user_tenants`
2. Essa consulta interna precisa aplicar novamente a política RLS
3. Loop infinito → Timeout → HTTP 500

## Solução Aplicada

**Removemos a política recursiva** via migração:

```sql
DROP POLICY IF EXISTS "Tenant admins can view tenant associations" 
ON public.user_tenants;
```

### Políticas Atuais (Seguras e Funcionais)

**user_tenants:**
- ✅ "Users can view their own tenant associations" - permite que usuários vejam apenas suas próprias associações (`auth.uid() = user_id`)

**tenants:**
- ✅ "Users can view tenants via user_tenants" - permite ver tenants aos quais o usuário está associado
- ✅ "Users can view their own tenant" - fallback para compatibilidade com `profiles.tenant_id`

## Migração Aplicada

- **Nome:** `fix_recursive_rls_policy`
- **Data:** 2026-01-19
- **Método:** Supabase MCP `apply_migration`

## Validação

### Antes (500 Error)
```
GET /rest/v1/user_tenants?select=tenant_id,role&user_id=eq.<uuid>
❌ 500 Internal Server Error
```

### Depois (200 OK)
```
GET /rest/v1/user_tenants?select=tenant_id,role&user_id=eq.<uuid>
✅ 200 OK
[{"tenant_id":"00000000-0000-0000-0000-000000000001","role":"admin"}]
```

## Arquivos Relacionados

- **Frontend:** `components/layout/AppShell.tsx` (já usa queries separadas, sem joins)
- **Database:** Tabelas `public.user_tenants` e `public.tenants`

## Lições Aprendidas

1. **Evite políticas RLS recursivas** - nunca faça SELECT na mesma tabela dentro da condição USING
2. **Prefira políticas simples** - `auth.uid() = user_id` é direto e eficiente
3. **Separe queries complexas** - joins aninhados com RLS podem causar 500; faça queries separadas no frontend
