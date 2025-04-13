'use client';

import { usePathname } from 'next/navigation';

interface LayoutProviderProps {
  children: React.ReactNode;
  mainLayout: React.ReactNode;
}

export function LayoutProvider({ children, mainLayout }: LayoutProviderProps) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  return isAuthPage ? children : mainLayout;
}