'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { TopBar } from './TopBar';
import { supabase } from '@/lib/supabase/client';
import type { User } from '@/types';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, setUser, setTenants, setSelectedTenantId } = useStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check auth session and load profile
    const loadUserSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
          router.push('/login');
          return;
        }

        // Load profile from database
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError || !profile) {
          console.error('Error loading profile:', profileError);
          router.push('/login');
          return;
        }

        // Load user tenants with tenant details
        const { data: userTenants, error: tenantsError } = await supabase
          .from('user_tenants')
          .select(`
            tenant_id,
            role,
            tenants (
              id,
              nome,
              cnpj,
              logo_url
            )
          `)
          .eq('user_id', session.user.id);

        if (tenantsError) {
          console.error('Error loading tenants:', tenantsError);
        }

        // Extract tenants from the join result
        const tenantsList = (userTenants || [])
          .filter(ut => ut.tenants)
          .map(ut => ({
            id: ut.tenants.id,
            nome: ut.tenants.nome,
            cnpj: ut.tenants.cnpj,
            logoUrl: ut.tenants.logo_url || undefined,
          }));

        // Map to User type
        const userObj: User = {
          id: profile.id,
          nome: profile.nome,
          email: session.user.email || '',
          role: profile.role as 'admin' | 'gestor' | 'vendedor',
          tenantId: tenantsList.length > 0 ? tenantsList[0].id : profile.tenant_id,
          avatarUrl: profile.avatar_url || undefined,
        };

        setUser(userObj);
        setTenants(tenantsList);
        
        // Set initial selected tenant - always ensure a tenant is selected
        if (tenantsList.length > 0) {
          // Select first tenant from user_tenants
          setSelectedTenantId(tenantsList[0].id);
        } else if (profile.tenant_id) {
          // Fallback: load tenant directly from profile for backward compatibility
          const { data: fallbackTenant } = await supabase
            .from('tenants')
            .select('*')
            .eq('id', profile.tenant_id)
            .single();
          
          if (fallbackTenant) {
            const tenant = {
              id: fallbackTenant.id,
              nome: fallbackTenant.nome,
              cnpj: fallbackTenant.cnpj,
              logoUrl: fallbackTenant.logo_url || undefined,
            };
            setTenants([tenant]);
            setSelectedTenantId(tenant.id);
          } else {
            // No tenant found - user needs to create one
            console.warn('User has no tenants associated');
          }
        } else {
          // No tenant at all - user needs to create one
          console.warn('User has no tenants associated');
        }
      } catch (err) {
        console.error('Auth error:', err);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    loadUserSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          setUser(null);
          setTenants([]);
          setSelectedTenantId('');
          router.push('/login');
        } else if (event === 'SIGNED_IN' && session) {
          // Reload profile and tenants on sign in
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            // Load user tenants
            const { data: userTenants } = await supabase
              .from('user_tenants')
              .select(`
                tenant_id,
                role,
                tenants (
                  id,
                  nome,
                  cnpj,
                  logo_url
                )
              `)
              .eq('user_id', session.user.id);

            const tenantsList = (userTenants || [])
              .filter(ut => ut.tenants)
              .map(ut => ({
                id: ut.tenants.id,
                nome: ut.tenants.nome,
                cnpj: ut.tenants.cnpj,
                logoUrl: ut.tenants.logo_url || undefined,
              }));

            const userObj: User = {
              id: profile.id,
              nome: profile.nome,
              email: session.user.email || '',
              role: profile.role as 'admin' | 'gestor' | 'vendedor',
              tenantId: tenantsList.length > 0 ? tenantsList[0].id : profile.tenant_id,
              avatarUrl: profile.avatar_url || undefined,
            };
            
            setUser(userObj);
            setTenants(tenantsList);
            
            // Always select a tenant when available
            if (tenantsList.length > 0) {
              setSelectedTenantId(tenantsList[0].id);
            } else if (profile.tenant_id) {
              // Fallback to profile tenant_id
              const { data: fallbackTenant } = await supabase
                .from('tenants')
                .select('*')
                .eq('id', profile.tenant_id)
                .single();
              
              if (fallbackTenant) {
                const tenant = {
                  id: fallbackTenant.id,
                  nome: fallbackTenant.nome,
                  cnpj: fallbackTenant.cnpj,
                  logoUrl: fallbackTenant.logo_url || undefined,
                };
                setTenants([tenant]);
                setSelectedTenantId(tenant.id);
              }
            }
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router, setUser]);

  if (loading || !user) {
    return null; // ou um loading spinner
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-auto bg-background">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
