-- Migration: Fix RLS Recursion Issues
-- This migration fixes infinite recursion in RLS policies that were causing 500 errors

-- ========================================
-- 1. CREATE HELPER FUNCTIONS
-- ========================================

-- Function to check if user is admin of a tenant (avoids recursion)
CREATE OR REPLACE FUNCTION public.is_tenant_admin(tenant_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_tenants
    WHERE user_id = auth.uid()
      AND tenant_id = tenant_uuid
      AND role = 'admin'
  );
$$;

-- Function to get user's tenant IDs (avoids recursion in tenants table)
CREATE OR REPLACE FUNCTION public.get_user_tenant_ids()
RETURNS SETOF uuid
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT tenant_id FROM public.user_tenants WHERE user_id = auth.uid();
$$;

-- ========================================
-- 2. FIX USER_TENANTS POLICIES
-- ========================================

-- Drop problematic recursive policies
DROP POLICY IF EXISTS "Members can view team" ON public.user_tenants;
DROP POLICY IF EXISTS "Admins can manage team" ON public.user_tenants;
DROP POLICY IF EXISTS "Admins can update team" ON public.user_tenants;
DROP POLICY IF EXISTS "Admins can delete team" ON public.user_tenants;

-- Keep the simple SELECT policy (no recursion)
-- "Users can view their own tenant associations" already exists and is safe

-- Create new policies using helper function
CREATE POLICY "Admins can insert team members"
ON public.user_tenants FOR INSERT
WITH CHECK (public.is_tenant_admin(tenant_id));

CREATE POLICY "Admins can update team members"
ON public.user_tenants FOR UPDATE
USING (public.is_tenant_admin(tenant_id))
WITH CHECK (public.is_tenant_admin(tenant_id));

CREATE POLICY "Admins can delete team members"
ON public.user_tenants FOR DELETE
USING (public.is_tenant_admin(tenant_id));

-- ========================================
-- 3. FIX TENANTS POLICIES
-- ========================================

-- Drop problematic recursive policy
DROP POLICY IF EXISTS "Users can view tenants via user_tenants" ON public.tenants;

-- Create new policy using helper function
CREATE POLICY "Users can view their tenants"
ON public.tenants FOR SELECT
USING (id IN (SELECT public.get_user_tenant_ids()));

-- ========================================
-- 4. VERIFICATION
-- ========================================

-- List all policies
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename IN ('user_tenants', 'tenants')
ORDER BY tablename, cmd;
