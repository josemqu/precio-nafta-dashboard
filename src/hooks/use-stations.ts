'use client';

import { useQuery } from '@tanstack/react-query';
import { Station } from '@/lib/api-client';
import { apiClient } from '@/lib/api-client';

interface StationsFilters {
  province?: string;
  town?: string;
  flag?: string;
  flag_id?: number;
  product?: string;
  product_id?: number;
  hour_type_id?: number;
  limit?: number;
}

export function useStations(filters: StationsFilters = {}) {
  const queryKey = ['stations', filters];
  
  const fetchStations = async (): Promise<Station[]> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });
    
    const queryString = params.toString();
    const url = `/stations${queryString ? `?${queryString}` : ''}`;
    
    try {
      const response = await apiClient<Station[]>(url, {
        method: 'GET',
      }, true); // true indica que requiere autenticación
      
      return response;
    } catch (error) {
      console.error('Error fetching stations:', error);
      throw error;
    }
  };

  return useQuery<Station[], Error>({
    queryKey,
    queryFn: fetchStations,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}
