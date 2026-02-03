-- Migration: Suporte a Equipes (Email em Profiles + Função de Lookup)

-- ========================================
-- 1. ADICIONAR EMAIL NA TABELA PROFILES
-- ========================================
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email text;

-- Índice para busca rápida (embora auth.users seja a fonte da verdade)
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

COMMENT ON COLUMN public.profiles.email IS 'Email do usuário (sincronizado de auth.users)';

-- ========================================
-- 2. FUNÇÃO PARA BUSCAR ID POR EMAIL
-- ========================================
-- Necessário para adicionar membros por email
-- Security Definer permite buscar na tabela auth.users

CREATE OR REPLACE FUNCTION public.get_user_id_by_email(email_input text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  found_user_id uuid;
BEGIN
  -- Normalizar email
  email_input := lower(trim(email_input));
  
  SELECT id INTO found_user_id
  FROM auth.users
  WHERE email = email_input;

  RETURN found_user_id;
END;
$$;

-- Permitir que usuários autenticados chamem esta função
GRANT EXECUTE ON FUNCTION public.get_user_id_by_email(text) TO authenticated;

-- ========================================
-- 3. POLÍTICAS DE ACESSO (Review)
-- ========================================
-- Garantir que user_tenants seja visível para admins e gestores
-- A política atual permite apenas 'admin'. 
-- VOU ATUALIZAR para permitir que membros vejam quem são seus colegas de equipe.

DROP POLICY IF EXISTS "Tenant admins can view tenant associations" ON public.user_tenants;

CREATE POLICY "Members can view team"
ON public.user_tenants FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_tenants ut
    WHERE ut.user_id = auth.uid()
      AND ut.tenant_id = user_tenants.tenant_id
  )
);

-- Apenas Admin pode INSERIR/ATUALIZAR/DELETAR
CREATE POLICY "Admins can manage team"
ON public.user_tenants FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_tenants ut
    WHERE ut.user_id = auth.uid()
      AND ut.tenant_id = user_tenants.tenant_id
      AND ut.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_tenants ut
    WHERE ut.user_id = auth.uid()
      AND ut.tenant_id = user_tenants.tenant_id
      AND ut.role = 'admin'
  )
);
