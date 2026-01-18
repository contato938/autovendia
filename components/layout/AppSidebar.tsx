'use client';

import { Settings, BarChart3, Users, Repeat, Cable, Megaphone, Kanban, User } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarHeader,
  SidebarFooter
} from "@/components/ui/sidebar";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "Campanhas",
    url: "/campaigns",
    icon: Megaphone,
  },
  {
    title: "Leads",
    url: "/leads",
    icon: Users,
  },
  {
    title: "Pipeline",
    url: "/pipeline",
    icon: Kanban,
  },
  {
    title: "Conversões",
    url: "/conversions",
    icon: Repeat,
  },
  {
    title: "Conta",
    url: "/account",
    icon: User,
  },
  {
    title: "Configurações",
    url: "/settings",
    icon: Settings,
    items: [
      {
        title: "Integrações",
        url: "/integrations",
        icon: Cable,
      },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-16 flex items-center justify-center border-b border-sidebar-border/50">
        <div className="flex items-center gap-2 font-bold text-xl text-primary px-4 w-full">
          <span className="truncate">AutovendaIA</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive =
                  pathname.startsWith(item.url) ||
                  item.items?.some((subItem) => pathname.startsWith(subItem.url));

                return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.items && (
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname.startsWith(subItem.url)}
                          >
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-sidebar-border/50">
        <div className="text-xs text-muted-foreground truncate">
          v1.0.0 MVP
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
