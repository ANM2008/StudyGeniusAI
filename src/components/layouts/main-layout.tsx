'use client';

import Link from "next/link";
import {Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarRail, SidebarSeparator} from "@/components/ui/sidebar";
import {Home, GraduationCap, FileText} from "lucide-react";
import {ThemeToggle} from "@/components/theme-toggle";
import dynamic from 'next/dynamic';

// Dynamically import SidebarFooter with ssr: false
const SidebarFooter = dynamic(() => import('@/components/ui/sidebar').then(mod => mod.SidebarFooter), { ssr: false });

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <GraduationCap className="h-6 w-6" />
            <span>StudyGenius</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard" className="flex w-full items-center gap-2">
                    <Home className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/generate" className="flex w-full items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Generate Materials</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        {/* Use the dynamically imported SidebarFooter */}
        <SidebarFooter>
          <SidebarSeparator />
        </SidebarFooter>
      </Sidebar>
      <SidebarRail />
      <div className="flex-1 p-4">
        <ThemeToggle/>
        {children}
      </div>
    </SidebarProvider>
  )
} 