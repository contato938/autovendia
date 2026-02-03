'use client';

import * as React from 'react';
import {
  BookOpen,
  Settings2,
  LayoutDashboard,
  Megaphone,
  Users,
  BarChart,
  Phone,
} from 'lucide-react';

import { NavMain } from '@/components/layout/nav-main';
import { NavProjects } from '@/components/layout/nav-projects';
import { NavUser } from '@/components/layout/nav-user';

import { useStore } from '@/store/useStore';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from '@/components/ui/sidebar';

// This is sample data.
const data = {

  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboard,
      isActive: true,
      items: [
        { title: 'Visão Geral', url: '/dashboard' },
        { title: 'Vendas & Receita', url: '/sales' },
        { title: 'Atendimento', url: '/support' },
        { title: 'Clientes (LTV)', url: '/customers' },
      ],
    },
    {
      title: 'Campanhas',
      url: '/campaigns',
      icon: Megaphone,
    },
    {
      title: 'Leads & CRM',
      url: '/leads',
      icon: Users,
      items: [
        { title: 'Todos os Leads', url: '/leads' },
        { title: 'Pipeline', url: '/pipeline' },
      ],
    },
    {
      title: 'Conversão',
      url: '/conversions',
      icon: BarChart,
      items: [
        { title: 'Offline Conversions', url: '/conversions' },
        { title: 'Pixel & Tracking', url: '/tracking' },
      ],
    },
    {
      title: 'Configurações',
      url: '/settings',
      icon: Settings2,
      items: [
        { title: 'Geral', url: '/settings' },
        { title: 'Integrações', url: '/settings/integrations' },
        { title: 'Equipe', url: '/settings/team' },
      ],
    },
  ],
  projects: [
    {
      name: 'Documentação',
      url: '#',
      icon: BookOpen,
    },
    {
      name: 'Suporte',
      url: '#',
      icon: Phone,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useStore();

  return (
    <Sidebar collapsible="icon" {...props}>

      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user ? {
          name: user.nome,
          email: user.email,
          avatar: user.avatarUrl || ''
        } : undefined} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
