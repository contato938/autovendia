# Correções de Segurança e Vinculação de Usuários

## Mudanças Implementadas

### 1. Verificação dos Vínculos Existentes (via MCP)

**Status**: Confirmado que todos os usuários já estão vinculados

Query executada para verificar:
```sql
SELECT 
  p.id as user_id,
  p.nome,
  p.role as profile_role,
  ut.id as user_tenant_id,
  ut.role as user_tenant_role
FROM public.profiles p
LEFT JOIN public.user_tenants ut ON ut.user_id = p.id AND ut.tenant_id = '00000000-0000-0000-0000-000000000001'
```

**Resultado**:
- `contato@dynamicslabs.com.br` - Vinculado como admin
- `expmarketing.arthur@gmail.com` - Vinculado como admin

Ambos os usuários já possuem vínculos corretos com a organização "Garcia Auto Peças".

### 2. Removida Opção Insegura de Criar Organização

**Arquivo**: `components/layout/TopBar.tsx`

**Mudanças**:
- Removida completamente a opção "Adicionar empresa..." do dropdown
- Deletada a página `/app/(app)/organizations/new/page.tsx` que permitia criar organizações
- Quando não há organizações, agora mostra: "Nenhuma organização disponível. Contate o administrador."
- Botão não tem mais ação de criar organização

**Antes**:
```tsx
<DropdownMenuItem onClick={() => router.push('/organizations/new')}>
  Adicionar empresa...
</DropdownMenuItem>
```

**Depois**: Completamente removido.

### 3. Melhoradas Mensagens e Logs de Debug

**Arquivo**: `components/layout/AppShell.tsx`

**Melhorias**:
- Adicionados logs detalhados para debug do carregamento de tenants
- Logs mostram quando dados são carregados de `user_tenants`
- Logs mostram quando fallback para `profiles.tenant_id` é usado
- Logs de erro claros quando usuário não tem organizações
- Melhorado texto no botão de "Adicione uma organização" para "Carregando..."

**Logs adicionados**:
```javascript
console.log('User tenants loaded:', userTenants);
console.log('Tenants list processed:', tenantsList);
console.log('Setting tenants:', tenantsList);
console.log('Selected tenant will be:', tenantsList.length > 0 ? tenantsList[0].id : 'none');
console.log('Selected tenant set to:', tenantsList[0].id);
console.log('No user_tenants found, trying fallback to profile.tenant_id:', profile.tenant_id);
console.log('Fallback tenant loaded:', tenant);
console.warn('Fallback tenant not found for ID:', profile.tenant_id);
console.error('User has no tenants associated. Profile:', profile);
```

### 4. Garantido Fallback Robusto

**Fluxo de carregamento melhorado**:

1. **Primeira tentativa**: Carrega de `user_tenants` (join com `tenants`)
2. **Fallback 1**: Se não há `user_tenants`, tenta carregar de `profiles.tenant_id`
3. **Fallback 2**: Se tenant não existe, mostra erro no console
4. **Mensagem ao usuário**: Se não há organizações, mostra mensagem para contatar admin

### 5. Mesmo Comportamento no onAuthStateChange

Ambos os pontos de carregamento (inicial e onAuthStateChange) agora têm:
- Mesma lógica de fallback
- Mesmos logs de debug
- Mesmo tratamento de erros

## Segurança

### Problemas Corrigidos

1. **Criação não autorizada de organizações**: Removida a página e opção do dropdown
2. **Isolamento de dados**: Cada usuário só vê organizações vinculadas via `user_tenants`
3. **Validação de acesso**: RLS policies do Supabase garantem que apenas vínculos autorizados são visíveis

### Fluxo Atual

```
Login → AppShell carrega profile
     → Busca user_tenants com join em tenants
     → Se encontrou: lista organizações e seleciona primeira
     → Se não encontrou: fallback para profiles.tenant_id
     → Se não tem nenhum: mostra mensagem para contatar admin
```

## Debugging

Para investigar problemas de carregamento, verificar logs no console:
- "User tenants loaded" - mostra dados brutos do Supabase
- "Tenants list processed" - mostra lista processada
- "Setting tenants" - confirma que lista foi salva no store
- "Selected tenant set to" - confirma ID selecionado

## Arquivos Modificados

1. `components/layout/TopBar.tsx` - Removida opção insegura, melhoradas mensagens
2. `components/layout/AppShell.tsx` - Adicionados logs detalhados, melhorado fallback
3. `app/(app)/organizations/new/page.tsx` - Deletado (página insegura)

## Testes Necessários

- [x] Verificar que usuários estão vinculados via MCP
- [x] Confirmar que opção de criar organização foi removida
- [ ] Testar login e verificar logs no console do navegador
- [ ] Confirmar que "Garcia Auto Peças" aparece automaticamente
- [ ] Testar em múltiplos navegadores/sessões

## Próximos Passos (se problema persistir)

Se após fazer login a organização ainda não aparecer:

1. Abrir DevTools do navegador (F12)
2. Verificar aba Console
3. Procurar pelos logs iniciados com:
   - "User tenants loaded"
   - "Tenants list processed"
   - "Selected tenant set to"
4. Compartilhar output dos logs para diagnóstico adicional

## Nota Importante

A criação de organizações agora deve ser feita:
- Via painel administrativo (a ser implementado)
- Via SQL direto no Supabase por super admins
- Via API backend com autenticação adequada

Usuários regulares não podem criar organizações pela interface.
