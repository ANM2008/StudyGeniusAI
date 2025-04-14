import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import Link from "next/link";
import {Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarRail, SidebarSeparator} from "@/components/ui/sidebar";
import {Home, GraduationCap, FileText} from "lucide-react";
import {ThemeProvider} from "@/components/theme-provider";
import {ThemeToggle} from "@/components/theme-toggle";
import { LayoutProvider } from '@/components/layout-provider';
import dynamic from 'next/dynamic';
import { MainLayout } from '@/components/layouts/main-layout';

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
