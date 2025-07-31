'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Fuel, Menu } from 'lucide-react';
import { UserNav } from './user-nav';
import { ThemeToggle } from '../theme/theme-toggle';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <Fuel className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl hidden sm:inline-block">Precio Nafta</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-1">
          <Button variant="ghost" asChild>
            <Link href="/">Inicio</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/estaciones">Estaciones</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/precios">Precios</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/mapa">Mapa</Link>
          </Button>
        </nav>
        
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <UserNav />
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menú</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
