'use client';

import * as React from 'react';
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  LayoutDashboard,
  Megaphone,
  ShoppingBag,
  Users,
  BarChart,
  Phone,
  MessageCircle,
  Database
} from 'lucide-react';

import { NavMain } from '@/components/layout/nav-main';
import { NavProjects } from '@/components/layout/nav-projects';
import { NavUser } from '@/components/layout/nav-user';
import { TeamSwitcher } from '@/components/layout/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
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
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
