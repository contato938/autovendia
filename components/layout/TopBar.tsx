'use client';

import { useState } from 'react';
import { ChevronsUpDown } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

export function TopBar() {
  const { user, tenants, selectedTenantId, setSelectedTenantId } = useStore();
  const selectedTenant = tenants.find(t => t.id === selectedTenantId) ?? null;
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Erro ao fazer logoff:', error);
        toast.error('Não foi possível sair. Tente novamente.');
        return;
      }

      router.replace('/login');
    } catch (err) {
      console.error('Erro inesperado no logoff:', err);
      toast.error('Não foi possível sair. Tente novamente.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-background px-6 shadow-sm">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-6" />
      
      {/* Tenant Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className={`max-w-[200px] min-w-[200px] justify-between hidden md:flex ${
              !selectedTenant ? 'border-amber-500 text-amber-600' : ''
            }`}
          >
             <div className="flex items-center gap-2 min-w-0 flex-1">
               <Avatar className="h-5 w-5 rounded-md shrink-0">
                 {selectedTenant?.logoUrl ? (
                   <AvatarImage src={selectedTenant.logoUrl} alt={selectedTenant.nome} />
                 ) : null}
                 <AvatarFallback>{selectedTenant?.nome?.charAt(0) || '!'}</AvatarFallback>
               </Avatar>
               <span className="truncate flex-1">
                 {selectedTenant?.nome || (tenants.length > 0 ? 'Selecione...' : 'Carregando...')}
               </span>
             </div>
             <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px]">
          {tenants.length > 0 ? (
            tenants.map((tenant) => (
              <DropdownMenuItem 
                key={tenant.id}
                onClick={() => setSelectedTenantId(tenant.id)}
                className={selectedTenant?.id === tenant.id ? 'bg-accent' : ''}
              >
                <span className="truncate block w-full font-medium text-sm">{tenant.nome}</span>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="px-2 py-3 text-sm text-muted-foreground text-center">
              Nenhuma organização disponível.<br />
              Contate o administrador.
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex-1" />

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user?.avatarUrl} alt={user?.nome} />
              <AvatarFallback>{user?.nome?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.nome}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push('/account')}>
            Minha Conta
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="text-red-600 focus:text-red-600"
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'Saindo...' : 'Sair'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
