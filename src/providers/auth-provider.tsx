'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authService, User } from '@/lib/api-client';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { username: string; email: string; full_name: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Verificar autenticación al cargar
  useEffect(() => {
    checkAuth().finally(() => setIsLoading(false));
  }, []);

  // Redirigir si no está autenticado en rutas protegidas
  useEffect(() => {
    const protectedRoutes = ['/dashboard', '/perfil', '/configuracion'];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    
    if (!isLoading && isProtectedRoute && !user) {
      router.push(`/auth?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, user, pathname, router]);

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authService.login(username, password);
      
      // Guardar token en localStorage
      localStorage.setItem('authToken', response.access_token);
      localStorage.setItem('userData', JSON.stringify(response.user));
      
      setUser(response.user);
      return { success: true };
    } catch (error: any) {
      console.error('Error en login:', error);
      return { 
        success: false, 
        error: error.message || 'Error al iniciar sesión. Verifica tus credenciales.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: { username: string; email: string; full_name: string; password: string }) => {
    try {
      setIsLoading(true);
      await authService.register(data);
      
      // Iniciar sesión automáticamente después del registro
      return await login(data.username, data.password);
    } catch (error: any) {
      console.error('Error en registro:', error);
      return { 
        success: false, 
        error: error.data?.detail || 'Error al registrar el usuario. Intenta nuevamente.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    router.push('/');
  };

  const checkAuth = async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setUser(null);
        return false;
      }
      
      // Verificar si el token es válido
      const userData = await authService.getCurrentUser();
      
      // Actualizar datos del usuario en localStorage
      localStorage.setItem('userData', JSON.stringify(userData));
      setUser(userData);
      
      return true;
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      // Limpiar datos de autenticación inválidos
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      setUser(null);
      return false;
    }
  };

  return (
    <AuthContext.Provider 
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
