"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { apiClient } from "@/lib/api-client";

interface User {
  username: string;
  email: string;
  full_name?: string;
  avatar?: string;
  role?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterData extends LoginCredentials {
  email?: string;
  full_name?: string;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(() => {
    // Solo intentar acceder a localStorage en el cliente
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      
      return {
        isAuthenticated: !!token,
        user: userData ? JSON.parse(userData) : null,
        token,
        isLoading: false,
        error: null,
      };
    }
    
    return {
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: true,
      error: null,
    };
  });

  const router = useRouter();
  const pathname = usePathname();

  // Verificar autenticación al cargar
  const verifyAuth = useCallback(async () => {
    // Solo verificar en el cliente
    if (typeof window === 'undefined') return;
    
    const token = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("userData");
    
    // Si no hay token, asegurarse de que el estado esté limpio
    if (!token) {
      if (authState.isAuthenticated || authState.user || authState.token) {
        setAuthState({
          isAuthenticated: false,
          user: null,
          token: null,
          isLoading: false,
          error: null,
        });
      }
      return;
    }

    // Si ya hay un usuario en el estado y el token coincide, no es necesario verificar
    if (authState.isAuthenticated && authState.token === token) {
      return;
    }

    try {
      // Verificar el token con el backend
      const userData = await apiClient<User>(
        "/users/me",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        false // No requerir autenticación para esta llamada
      );

      // Asegurarse de que los datos del usuario tengan los campos necesarios
      const userWithDefaults = {
        ...userData,
        full_name: userData.full_name || userData.username,
        role: userData.role || 'user',
        avatar: userData.avatar || ''
      };

      // Solo actualizar si los datos son diferentes
      const userChanged = JSON.stringify(userWithDefaults) !== JSON.stringify(authState.user);
      
      if (userChanged || !authState.isAuthenticated) {
        setAuthState({
          isAuthenticated: true,
          user: userWithDefaults,
          token,
          isLoading: false,
          error: null,
        });

        // Actualizar los datos del usuario en localStorage
        localStorage.setItem("userData", JSON.stringify(userWithDefaults));
      }
    } catch (error) {
      console.error("Error al verificar autenticación:", error);
      // Si hay un error, limpiar el estado de autenticación
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      setAuthState({
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false,
        error: "La sesión ha expirado. Por favor, inicia sesión nuevamente.",
      });
    }
  }, []);

  // Verificar autenticación al cargar el hook
  useEffect(() => {
    // Verificar autenticación solo en el cliente
    if (typeof window !== 'undefined') {
      verifyAuth();
    }
  }, [authState.isAuthenticated]); // Solo volver a verificar si cambia el estado de autenticación

  const login = useCallback(async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    // Actualizar el estado de carga
    setAuthState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      // Usar el servicio de autenticación de la API
      const formData = new URLSearchParams();
      formData.append("username", credentials.username);
      formData.append("password", credentials.password);

      console.log(credentials.username);
      console.log(credentials.password);

      // Usar el cliente de API para autenticación
      const response = await apiClient<{
        access_token: string;
        token_type: string;
      }>(
        "/token",
        {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
        false // No requiere autenticación
      );

      // Obtener información del usuario
      const userData = await apiClient<User>(
        "/users/me",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${response.access_token}`,
          },
        },
        true
      );

      // Asegurarse de que los datos del usuario tengan los campos necesarios
      const userWithDefaults = {
        ...userData,
        full_name: userData.full_name || userData.username,
        role: userData.role || 'user',
        avatar: userData.avatar || ''
      };

      // Almacenar token y datos del usuario
      localStorage.setItem("authToken", response.access_token);
      localStorage.setItem("userData", JSON.stringify(userWithDefaults));

      // Usar el callback de actualización de estado para asegurar que usamos el estado más reciente
      setAuthState(prev => ({
        ...prev,
        isAuthenticated: true,
        user: userWithDefaults,
        token: response.access_token,
        isLoading: false,
        error: null,
      }));

      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al iniciar sesión";
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const register = useCallback(
    async (data: RegisterData) => {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        // En una implementación real, usarías la API real
        // const response = await apiClient('/users', {
        //   method: 'POST',
        //   body: JSON.stringify(data),
        // });

        // Simulación de registro exitoso
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Iniciar sesión automáticamente después del registro
        return await login({
          username: data.username,
          password: data.password,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Error al registrar el usuario";
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
        return { success: false, error: errorMessage };
      }
    },
    [login]
  );

  const logout = useCallback(async () => {
    try {
      // No hay un endpoint de logout en la API, solo limpiamos el token local
      // Si en el futuro se agrega un endpoint de logout, se puede implementar aquí
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      // Limpiar el estado local
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      setAuthState({
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false,
        error: null,
      });

      // Redirigir a la página de inicio de sesión
      router.push("/auth/signin");

      // Forzar un refresco completo para limpiar cualquier estado de la aplicación
      window.location.href = "/auth/signin";
    }
  }, [router]);

  return {
    ...authState,
    login,
    register,
    logout,
  };
}
