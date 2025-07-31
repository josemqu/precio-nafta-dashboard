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
    
    // En un entorno real, aquí iría la autenticación
    // const response = await apiClient<Station[]>(url, {
    //   headers: {
    //     'Authorization': `Bearer ${token}`
    //   }
    // });
    
    // Para propósitos de demostración, usaremos datos simulados
    // En una implementación real, reemplazar con la llamada a la API real
    console.log('Fetching stations with filters:', filters);
    
    // Simulación de carga
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Datos de ejemplo
    const mockStations: Station[] = [
      {
        stationId: 1,
        stationName: 'YPF Centro',
        address: 'Av. Siempre Viva 123',
        town: 'Buenos Aires',
        province: 'Buenos Aires',
        flag: 'YPF',
        flagId: 1,
        geometry: {
          type: 'Point',
          coordinates: [-58.3816, -34.6037]
        },
        products: [
          {
            productId: 2,
            productName: 'Nafta Super',
            prices: [
              {
                price: 1250.50,
                date: new Date().toISOString(),
                hourType: 'Diurno',
                hourTypeId: 2
              }
            ]
          },
          {
            productId: 3,
            productName: 'Nafta Premium',
            prices: [
              {
                price: 1450.75,
                date: new Date().toISOString(),
                hourType: 'Diurno',
                hourTypeId: 2
              }
            ]
          }
        ]
      },
      // Más estaciones de ejemplo...
    ];
    
    return mockStations;
  };

  return useQuery<Station[], Error>({
    queryKey,
    queryFn: fetchStations,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}
