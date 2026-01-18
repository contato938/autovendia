-- Migration: Adicionar campos phone e company_name na tabela profiles
-- e configurar bucket avatars com políticas RLS

-- ========================================
-- 1. ADICIONAR CAMPOS NA TABELA PROFILES
-- ========================================
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS company_name text;

-- Comentários para documentação
COMMENT ON COLUMN public.profiles.phone IS 'Telefone do usuário';
COMMENT ON COLUMN public.profiles.company_name IS 'Nome da empresa (opcional)';

-- ========================================
-- 2. CRIAR BUCKET AVATARS (se não existir)
-- ========================================
-- Nota: Buckets são criados via Supabase Dashboard ou API
-- Este SQL assume que o bucket será criado manualmente ou via MCP
-- Se o bucket já existir, este comando será ignorado

-- ========================================
-- 3. POLÍTICAS DE STORAGE PARA AVATARS
-- ========================================
-- Permitir SELECT: usuários podem ver seus próprios avatares
CREATE POLICY IF NOT EXISTS "Users can view own avatars"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Permitir INSERT: usuários podem fazer upload de seus próprios avatares
CREATE POLICY IF NOT EXISTS "Users can upload own avatars"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Permitir UPDATE: usuários podem atualizar seus próprios avatares
CREATE POLICY IF NOT EXISTS "Users can update own avatars"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Permitir DELETE: usuários podem deletar seus próprios avatares
CREATE POLICY IF NOT EXISTS "Users can delete own avatars"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ========================================
-- 4. VERIFICAÇÃO
-- ========================================
-- Verificar se os campos foram adicionados
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'profiles'
  AND column_name IN ('phone', 'company_name');
