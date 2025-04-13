import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import Link from "next/link";
import {Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarRail, SidebarSeparator} from "@/components/ui/sidebar";
import {Home, GraduationCap, FileText} from "lucide-react";
import {ThemeProvider} from "@/components/theme-provider";
import {ThemeToggle} from "@/components/theme-toggle";
import { LayoutProvider } from '@/components/layout-provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'StudyGenius',
  description: 'AI Powered Study Material Generator',
};

function MainLayout({ children }: { children: React.ReactNode }) {
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LayoutProvider 
            mainLayout={<MainLayout>{children}</MainLayout>}
          >
            {children}
          </LayoutProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
