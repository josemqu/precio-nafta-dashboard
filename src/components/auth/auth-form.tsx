'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2, Mail, User, Lock, UserPlus } from 'lucide-react';

type AuthTab = 'login' | 'register';

export function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  
  const [activeTab, setActiveTab] = useState<AuthTab>('login');
  const [loginData, setLoginData] = useState({ username: 'user', password: 'secret' });
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    full_name: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  
  const { login, register, isLoading, error: authError } = useAuth();
  
  // Mostrar errores de autenticación
  if (authError && !formError) {
    setFormError(authError);
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const newErrors: Record<string, string> = {};
    
    if (!loginData.username.trim()) newErrors.username = 'El nombre de usuario es requerido';
    if (!loginData.password) newErrors.password = 'La contraseña es requerida';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    
    try {
      await login(loginData);
      // Redirigir después de un inicio de sesión exitoso
      router.push(redirectTo);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setFormError('Error al iniciar sesión. Verifica tus credenciales.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const newErrors: Record<string, string> = {};
    
    if (!registerData.username.trim()) newErrors.username = 'El nombre de usuario es requerido';
    if (!registerData.email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }
    if (!registerData.full_name) newErrors.full_name = 'El nombre completo es requerido';
    if (!registerData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (registerData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    const { confirmPassword, ...registrationData } = registerData;
    await register(registrationData);
  };

  return (
    <Tabs 
      value={activeTab}
      defaultValue="login" 
      className="w-full max-w-md mx-auto bg-card p-6 rounded-lg shadow-lg border border-border"
      onValueChange={(value) => {
        setActiveTab(value as AuthTab);
        setFormError(null);
        setErrors({});
      }}
    >
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="login" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Iniciar Sesión
        </TabsTrigger>
        <TabsTrigger value="register" className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Registrarse
        </TabsTrigger>
      </TabsList>
        
        <TabsContent value="login" className="mt-6">
          <form onSubmit={handleLogin} className="space-y-4">
            {formError && activeTab === 'login' && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="login-username">Nombre de usuario</Label>
              <Input
                id="login-username"
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                disabled={isLoading}
              />
              {errors.username && (
                <p className="text-sm text-destructive">{errors.username}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="login-password">Contraseña</Label>
                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                  onClick={() => {/* Implementar recuperación de contraseña */}}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <Input
                id="login-password"
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && activeTab === 'login' && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Iniciar Sesión
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="register" className="mt-6">
          <form onSubmit={handleRegister} className="space-y-4">
            {formError && activeTab === 'register' && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="register-username">Nombre de usuario</Label>
              <Input
                id="register-username"
                value={registerData.username}
                onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                disabled={isLoading}
              />
              {errors.username && (
                <p className="text-sm text-destructive">{errors.username}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="register-email">Correo electrónico</Label>
              <Input
                id="register-email"
                type="email"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="register-fullname">Nombre completo</Label>
              <Input
                id="register-fullname"
                value={registerData.full_name}
                onChange={(e) => setRegisterData({ ...registerData, full_name: e.target.value })}
                disabled={isLoading}
              />
              {errors.full_name && (
                <p className="text-sm text-destructive">{errors.full_name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="register-password">Contraseña</Label>
              <Input
                id="register-password"
                type="password"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="register-confirm-password">Confirmar Contraseña</Label>
              <Input
                id="register-confirm-password"
                type="password"
                value={registerData.confirmPassword}
                onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword}</p>
              )}
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && activeTab === 'register' && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Registrarse
            </Button>
          </form>
        </TabsContent>
      </Tabs>
  );
}
