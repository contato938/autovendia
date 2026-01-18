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
  const { user, setUser } = useStore();
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
          .select('*, tenants(*)')
          .eq('id', session.user.id)
          .single();

        if (profileError || !profile) {
          console.error('Error loading profile:', profileError);
          router.push('/login');
          return;
        }

        // Map to User type
        const userObj: User = {
          id: profile.id,
          nome: profile.nome,
          email: session.user.email || '',
          role: profile.role as 'admin' | 'gestor' | 'vendedor',
          tenantId: profile.tenant_id,
          avatarUrl: profile.avatar_url || undefined,
        };

        setUser(userObj);
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
          router.push('/login');
        } else if (event === 'SIGNED_IN' && session) {
          // Reload profile on sign in
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            const userObj: User = {
              id: profile.id,
              nome: profile.nome,
              email: session.user.email || '',
              role: profile.role as 'admin' | 'gestor' | 'vendedor',
              tenantId: profile.tenant_id,
              avatarUrl: profile.avatar_url || undefined,
            };
            setUser(userObj);
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
