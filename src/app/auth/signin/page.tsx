'use client';

import { AuthForm } from '@/components/auth/auth-form';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SignInPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectTo = searchParams.get('redirect') || '/';

  // Redirigir si el usuario ya está autenticado
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, redirectTo, router]);

  if (isLoading || isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container flex flex-col items-center justify-center flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 text-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Bienvenido a Precio Nafta</h1>
            <p className="mt-2 text-muted-foreground">
              Inicia sesión para acceder a todas las funcionalidades
            </p>
          </div>
          
          <AuthForm />
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                O continúa como invitado
              </span>
            </div>
          </div>
          
          <Button variant="outline" className="w-full" asChild>
            <Link href="/">
              Explorar sin iniciar sesión
            </Link>
          </Button>
        </div>
      </div>
      
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Precio Nafta. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
