'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps as NextThemesProviderProps } from 'next-themes';

type Theme = 'light' | 'dark' | 'system';

type ThemeProviderProps = Omit<NextThemesProviderProps, 'children'> & {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

export function ThemeProvider({ 
  children, 
  defaultTheme = 'system',
  storageKey = 'precio-nafta-theme',
  ...props 
}: ThemeProviderProps) {
  return (
    <NextThemesProvider 
      attribute="class"
      defaultTheme={defaultTheme}
      enableSystem
      disableTransitionOnChange
      storageKey={storageKey}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
