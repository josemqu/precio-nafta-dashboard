// Configuración base para las peticiones a la API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Función para obtener el token de autenticación del almacenamiento local
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// Interfaz para errores de la API
interface ApiError extends Error {
  status?: number;
  data?: any;
}

/**
 * Cliente genérico para realizar peticiones a la API
 */
export const apiClient = async <T>(
  endpoint: string,
  options: RequestInit = {},
  requiresAuth: boolean = true
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Añadir token de autenticación si es requerido
  if (requiresAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  // Combinar headers personalizados si existen
  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Manejar respuestas no exitosas
    if (!response.ok) {
      let errorMessage = `Error en la petición: ${response.statusText}`;
      let errorData: any = {};
      
      try {
        errorData = await response.json().catch(() => ({}));
        errorMessage = errorData.detail || errorMessage;
      } catch (e) {
        // No se pudo parsear la respuesta como JSON
      }

      const error: ApiError = new Error(errorMessage);
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    // Si la respuesta no tiene contenido (como en DELETE), devolvemos true
    if (response.status === 204) {
      return true as unknown as T;
    }

    return response.json();
  } catch (error) {
    console.error(`Error en la petición a ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Funciones específicas para autenticación
 */

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  is_active: boolean;
  is_superuser: boolean;
}

export const authService = {
  async login(username: string, password: string): Promise<LoginResponse> {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    return apiClient<LoginResponse>('/token', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }, false);
  },

  async register(userData: {
    username: string;
    email: string;
    full_name: string;
    password: string;
  }): Promise<User> {
    return apiClient<User>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    }, false);
  },

  async getCurrentUser(): Promise<User> {
    return apiClient<User>('/users/me');
  },
};

/**
 * Tipos de datos devueltos por la API
 */

// Tipos de respuesta de la API
export interface ApiResponse<T> {
  data: T;
  message?: string;
  total?: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
}

// Tipos para las estaciones
export interface Price {
  price: number;
  date: string; // Formato ISO 8601 (ej: "2023-10-01T12:00:00Z")
  hourType: string; // "Mañana", "Tarde", "Noche"
  hourTypeId: number;
  userId?: number; // usuario que reportó el precio
  userName?: string; // nombre del usuario que reportó el precio
}

export interface Product {
  productId: number;
  productName: string;
  prices: Price[];
  lastPrice?: number; // último precio registrado
  lastUpdate?: string; // fecha de última actualización
  priceChange?: number; // variación respecto al precio anterior
}

export interface Station {
  stationId: number;
  stationName: string;
  address: string;
  town: string;
  province: string;
  flag: string;
  flagId: number;
  geometry: {
    type: string;
    coordinates: [number, number]; // [longitud, latitud]
  };
  products: Product[];
  distance?: number; // en metros, para búsquedas por ubicación
  rating?: number; // calificación promedio (0-5)
  ratingCount?: number; // número de calificaciones
  lastUpdated?: string; // fecha de última actualización
}
