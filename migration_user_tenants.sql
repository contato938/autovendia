-- Migration: Criar tabela user_tenants para associação usuário ↔ tenant
-- Permite que um usuário pertença a múltiplos tenants

-- ========================================
-- 1. CRIAR TABELA USER_TENANTS
-- ========================================
CREATE TABLE IF NOT EXISTS public.user_tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'vendedor' CHECK (role IN ('admin', 'gestor', 'vendedor')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Constraint: um usuário não pode estar associado ao mesmo tenant duas vezes
  UNIQUE(user_id, tenant_id)
);

-- Comentários para documentação
COMMENT ON TABLE public.user_tenants IS 'Associação entre usuários e tenants (N:N)';
COMMENT ON COLUMN public.user_tenants.user_id IS 'ID do usuário (auth.users)';
COMMENT ON COLUMN public.user_tenants.tenant_id IS 'ID do tenant (organização)';
COMMENT ON COLUMN public.user_tenants.role IS 'Papel do usuário neste tenant específico';

-- ========================================
-- 2. ÍNDICES PARA PERFORMANCE
-- ========================================
CREATE INDEX IF NOT EXISTS idx_user_tenants_user_id ON public.user_tenants(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tenants_tenant_id ON public.user_tenants(tenant_id);

-- ========================================
-- 3. POLÍTICAS RLS (Row Level Security)
-- ========================================
ALTER TABLE public.user_tenants ENABLE ROW LEVEL SECURITY;

-- Usuários podem ver suas próprias associações
CREATE POLICY "Users can view their own tenant associations"
ON public.user_tenants FOR SELECT
USING (auth.uid() = user_id);

-- Admins do tenant podem ver associações do tenant
CREATE POLICY "Tenant admins can view tenant associations"
ON public.user_tenants FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_tenants ut
    WHERE ut.user_id = auth.uid()
      AND ut.tenant_id = user_tenants.tenant_id
      AND ut.role = 'admin'
  )
);

-- ========================================
-- 4. MIGRAR DADOS EXISTENTES (profiles → user_tenants)
-- ========================================
-- Copiar associações existentes da tabela profiles para user_tenants
INSERT INTO public.user_tenants (user_id, tenant_id, role)
SELECT 
  p.id as user_id,
  p.tenant_id,
  p.role
FROM public.profiles p
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_tenants ut
  WHERE ut.user_id = p.id AND ut.tenant_id = p.tenant_id
)
ON CONFLICT (user_id, tenant_id) DO NOTHING;

-- ========================================
-- 5. SEED: INSERIR TENANT GARCIA AUTO PEÇAS
-- ========================================
INSERT INTO public.tenants (id, nome, cnpj, logo_url)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Garcia Auto Peças',
  '12.345.678/0001-90',
  NULL
)
ON CONFLICT (id) DO UPDATE
SET nome = EXCLUDED.nome,
    cnpj = EXCLUDED.cnpj,
    updated_at = now();

-- ========================================
-- 6. VERIFICAÇÃO
-- ========================================
-- Verificar estrutura da tabela
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'user_tenants'
ORDER BY ordinal_position;

-- Contar associações migradas
SELECT 
  COUNT(*) as total_associations,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(DISTINCT tenant_id) as unique_tenants
FROM public.user_tenants;
