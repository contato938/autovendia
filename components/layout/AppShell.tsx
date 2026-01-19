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

        console.log('User tenants loaded:', userTenants);

        // Extract tenants from the join result
        const tenantsList = (userTenants || [])
          .filter(ut => ut.tenants)
          .map(ut => ({
            id: ut.tenants.id,
            nome: ut.tenants.nome,
            cnpj: ut.tenants.cnpj,
            logoUrl: ut.tenants.logo_url || undefined,
          }));

        console.log('Tenants list processed:', tenantsList);

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
        
        console.log('Setting tenants:', tenantsList);
        console.log('Selected tenant will be:', tenantsList.length > 0 ? tenantsList[0].id : 'none');
        
        // Set initial selected tenant - always ensure a tenant is selected
        if (tenantsList.length > 0) {
          // Select first tenant from user_tenants
          setSelectedTenantId(tenantsList[0].id);
          console.log('Selected tenant set to:', tenantsList[0].id);
        } else if (profile.tenant_id) {
          // Fallback: load tenant directly from profile for backward compatibility
          console.log('No user_tenants found, trying fallback to profile.tenant_id:', profile.tenant_id);
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
            console.log('Fallback tenant loaded:', tenant);
          } else {
            console.warn('Fallback tenant not found for ID:', profile.tenant_id);
          }
        } else {
          // No tenant at all - user needs admin assistance
          console.error('User has no tenants associated. Profile:', profile);
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

            console.log('Auth state change - user tenants:', userTenants);

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
            
            console.log('Auth state change - setting tenants:', tenantsList);
            
            // Always select a tenant when available
            if (tenantsList.length > 0) {
              setSelectedTenantId(tenantsList[0].id);
              console.log('Auth state change - selected tenant:', tenantsList[0].id);
            } else if (profile.tenant_id) {
              // Fallback to profile tenant_id
              console.log('Auth state change - fallback to profile tenant:', profile.tenant_id);
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
                console.log('Auth state change - fallback tenant loaded:', tenant);
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
