'use client';

import { Bell, Search, ChevronsUpDown } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty, CommandGroup } from '@/components/ui/command';
import { useStore } from '@/store/useStore';
import { useState, useMemo } from 'react';
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
import { useQuery } from '@tanstack/react-query';
import { leadsService } from '@/services/leads';
import { campaignsService } from '@/services/campaigns';
import { supabase } from '@/lib/supabase/client';

export function TopBar() {
  const { user, openLeadDrawer, setUser } = useStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  // Busca leads e campanhas via services
  const { data: leads = [] } = useQuery({
    queryKey: ['leads'],
    queryFn: leadsService.listLeads,
    staleTime: 60000
  });

  const { data: campaigns = [] } = useQuery({
    queryKey: ['campaigns'],
    queryFn: campaignsService.listCampaigns,
    staleTime: 60000
  });

  // Filtro client-side
  const filteredLeads = useMemo(() => {
    if (!searchQuery) return leads.slice(0, 5);
    const q = searchQuery.toLowerCase();
    return leads.filter(l => 
      l.name.toLowerCase().includes(q) || 
      l.phone.includes(q)
    ).slice(0, 5);
  }, [leads, searchQuery]);

  const filteredCampaigns = useMemo(() => {
    if (!searchQuery) return [];
    const q = searchQuery.toLowerCase();
    return campaigns.filter(c => 
      c.name.toLowerCase().includes(q)
    ).slice(0, 3);
  }, [campaigns, searchQuery]);

  const handleLeadSelect = (id: string) => {
    openLeadDrawer(id);
    setSearchOpen(false);
    setSearchQuery('');
  };
  
  const handleCampaignSelect = (id: string) => {
    router.push(`/campaigns?id=${id}`);
    setSearchOpen(false);
    setSearchQuery('');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/login');
  };

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-background px-6 shadow-sm">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-6" />
      
      {/* Tenant Selector Mock */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-[200px] justify-between hidden md:flex">
             <div className="flex items-center gap-2">
               <Avatar className="h-5 w-5 rounded-md">
                 <AvatarFallback>A</AvatarFallback>
               </Avatar>
               <span className="truncate">AutovendaIA</span>
             </div>
             <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px]">
          <DropdownMenuItem>
             <span className="font-medium text-sm">AutovendaIA</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>Adicionar empresa...</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex-1" />

      {/* Global Search */}
      <div className="relative w-full max-w-sm hidden md:block">
        <Popover open={searchOpen} onOpenChange={setSearchOpen}>
          <PopoverTrigger asChild>
             <Button variant="outline" className="w-full justify-between text-muted-foreground font-normal" onClick={() => setSearchOpen(true)}>
               <span className="flex items-center gap-2"><Search className="h-4 w-4" /> Buscar leads ou campanhas...</span>
               <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-xs">⌘</span>K
                </kbd>
             </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-[400px]" align="end">
            <Command shouldFilter={false}>
              <CommandInput 
                placeholder="Digite nome, telefone ou campanha..." 
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
              <CommandList>
                <CommandEmpty>Nenhum resultado.</CommandEmpty>
                
                {filteredLeads.length > 0 && (
                  <CommandGroup heading="Leads">
                    {filteredLeads.map(lead => (
                      <CommandItem key={lead.id} onSelect={() => handleLeadSelect(lead.id)}>
                        <span>{lead.name} - {lead.phone}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {filteredCampaigns.length > 0 && (
                  <CommandGroup heading="Campanhas">
                    {filteredCampaigns.map(campaign => (
                      <CommandItem key={campaign.id} onSelect={() => handleCampaignSelect(campaign.id)}>
                        <span>{campaign.name}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Notifications */}
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5" />
        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-600 ring-2 ring-background" />
      </Button>

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
          <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
