'use client';

import { Settings, Trello, Users, BarChart3 } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter
} from "@/components/ui/sidebar"
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "Leads",
    url: "/leads",
    icon: Users,
  },
  {
    title: "Pipeline",
    url: "/pipeline",
    icon: Trello, // or Kanban icon if available
  },
  {
    title: "Configurações",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-16 flex items-center justify-center border-b border-sidebar-border/50">
        <div className="flex items-center gap-2 font-bold text-xl text-primary px-4 w-full">
           <span className="truncate">AUTOVEND IA</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname.startsWith(item.url)} tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-sidebar-border/50">
        <div className="text-xs text-muted-foreground truncate">
          v1.0.0 Alpha
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
