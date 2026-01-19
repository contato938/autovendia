# Migração para Sistema Multi-Tenant

Este documento descreve as mudanças realizadas para implementar o sistema de organizações/tenants reais na aplicação.

## Resumo das Mudanças

### 1. Banco de Dados

#### Nova tabela `user_tenants`
Criada tabela de associação N:N entre usuários e tenants, permitindo que um usuário pertença a múltiplas organizações.

**Executar no Supabase SQL Editor:**
```sql
-- Ver arquivo: migration_user_tenants.sql
```

Este script:
- Cria a tabela `user_tenants` com foreign keys para `auth.users` e `tenants`
- Migra dados existentes de `profiles.tenant_id` para `user_tenants`
- Configura RLS (Row Level Security) policies
- Insere o tenant "Garcia Auto Peças" como primeiro tenant

#### Seed atualizado
O arquivo `supabase-seed.sql` foi atualizado para usar o UUID do tenant "Garcia Auto Peças" (`11111111-1111-1111-1111-111111111111`) em vez do antigo mock.

### 2. Tipos TypeScript

**`types/database.ts`**: Adicionada definição da tabela `user_tenants`:
```typescript
user_tenants: {
  Row: {
    id: string
    user_id: string
    tenant_id: string
    role: string
    created_at: string | null
    updated_at: string | null
  }
  // ... Insert/Update types
}
```

### 3. Estado Global (Zustand)

**`store/useStore.ts`**: Estendido com:
- `tenants: Tenant[]` - Lista de organizações do usuário
- `selectedTenantId: string | null` - Tenant ativo
- `selectedTenant: Tenant | null` - Computed property com dados do tenant ativo
- Setters correspondentes

### 4. Carregamento de Sessão

**`components/layout/AppShell.tsx`**: 
- Carrega tenants do usuário via join `user_tenants → tenants`
- Inicializa `selectedTenantId` com o primeiro tenant disponível
- Fallback para `profiles.tenant_id` (backward compatibility)

### 5. UI - Seletor de Tenant

**`components/layout/TopBar.tsx`**:
- Substituído mock por dados reais (nome, logo)
- Dropdown funcional com lista de tenants
- Permite troca de organização em tempo real

### 6. Filtros por Tenant

Todos os serviços de dados foram atualizados para aceitar `tenantId` opcional e filtrar registros:

- **`services/leads.ts`**: `listLeads(tenantId?)`
- **`services/campaigns.ts`**: `listCampaigns(tenantId?)`
- **`services/conversions.ts`**: `listConversions(tenantId?)`
- **`services/integrations.ts`**: `getStatus(tenantId?)`
- **`services/dashboardGoogle.ts`**: `getDashboardSummary(filters, tenantId?)`

### 7. Componentes de Páginas

Todas as páginas que consultam dados foram atualizadas para passar `selectedTenantId` aos serviços e invalidar cache ao trocar de tenant:

- `app/(app)/leads/page.tsx`
- `app/(app)/campaigns/page.tsx`
- `app/(app)/conversions/page.tsx`
- `app/(app)/integrations/page.tsx`
- `components/dashboard/DashboardGoogleClient.tsx`
- `components/leads/LeadPipelineBoard.tsx`

Exemplo de padrão usado:
```typescript
const { selectedTenantId } = useStore();

const { data, isLoading } = useQuery({
  queryKey: ['resource', selectedTenantId],
  queryFn: () => service.list(selectedTenantId || undefined),
  enabled: !!selectedTenantId,
});
```

## Instruções de Deploy

### Passo 1: Executar Migration
No Supabase SQL Editor, execute o arquivo `migration_user_tenants.sql`.

### Passo 2: Popular Seed (Opcional)
Se desejar popular com dados de teste, execute `supabase-seed.sql`.

### Passo 3: Vincular Usuários ao Tenant
Para cada usuário existente, certifique-se de que há um registro em `user_tenants`:

```sql
-- Exemplo: vincular usuário ao tenant Garcia Auto Peças
INSERT INTO user_tenants (user_id, tenant_id, role)
VALUES (
  'uuid-do-usuario-aqui',
  '11111111-1111-1111-1111-111111111111',
  'admin'
)
ON CONFLICT (user_id, tenant_id) DO NOTHING;
```

### Passo 4: Deploy do Frontend
Faça deploy do código atualizado. Os usuários serão automaticamente redirecionados para seu primeiro tenant ao fazer login.

## Testando

1. **Login**: Verificar que o TopBar exibe "Garcia Auto Peças"
2. **Troca de Tenant**: Testar dropdown e confirmar que listas atualizam
3. **Filtros**: Confirmar que apenas dados do tenant selecionado aparecem
4. **Sem Tenants**: Testar comportamento quando usuário não tem tenants vinculados

## Próximos Passos (Futuro)

- Adicionar funcionalidade "Adicionar empresa" no dropdown
- Implementar convites para usuários entrarem em tenants
- Adicionar permissões granulares por tenant (roles por tenant)
- Manter último tenant selecionado em localStorage

## Compatibilidade com Código Antigo

O sistema mantém compatibilidade com:
- Campo `profiles.tenant_id` (usado como fallback)
- Serviços que não passam `tenantId` (filtram tudo, sem restrição)
