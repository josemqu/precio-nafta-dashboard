'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StationsList } from '@/components/stations/stations-list';
import { useStations } from '@/hooks/use-stations';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';

// Datos de ejemplo para los filtros
const PROVINCES = [
  'Buenos Aires',
  'CABA',
  'Córdoba',
  'Santa Fe',
  'Mendoza',
  'Tucumán',
  'Salta',
  'Entre Ríos',
  'Misiones',
  'Corrientes',
  'Chaco',
  'Formosa',
  'Santiago del Estero',
  'San Juan',
  'San Luis',
  'La Rioja',
  'Catamarca',
  'La Pampa',
  'Santa Cruz',
  'Tierra del Fuego',
  'Neuquén',
  'Río Negro',
  'Chubut',
];

const FLAGS = [
  'YPF',
  'Axion',
  'Shell',
  'Puma',
  'Dapsa',
  'Oil',
  'Petrobras',
  'Puma',
  'Otros',
];

export default function StationsPage() {
  const [filters, setFilters] = useState({
    province: '',
    town: '',
    flag: '',
    page: 1,
  });
  const [showFilters, setShowFilters] = useState(false);
  
  const { data: stationsData, isLoading, error } = useStations({
    province: filters.province === 'all' ? undefined : filters.province,
    town: filters.town || undefined,
    flag: filters.flag === 'all' ? undefined : filters.flag,
    page: filters.page,
  });

  const stations = stationsData?.data || [];

  const handleFilterChange = (key: string, value: string) => {
    // Reset to first page when filters change
    const updates: any = { [key]: value };
    if (key !== 'page') {
      updates.page = 1; // Reset to first page when filters change
    }
    
    setFilters(prev => ({
      ...prev,
      ...updates
    }));
  };

  const resetFilters = () => {
    setFilters({
      province: '',
      town: '',
      flag: '',
      page: 1,
    });
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Estaciones de Servicio</h1>
            <p className="text-muted-foreground">
              Encuentra las estaciones de servicio y sus precios actualizados
            </p>
          </div>
          <Button onClick={() => setShowFilters(!showFilters)} variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
          </Button>
        </div>

        {showFilters && (
          <div className="bg-muted/50 p-4 rounded-lg space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="province">
                  Provincia
                </label>
                <Select
                  value={filters.province}
                  onValueChange={(value) => handleFilterChange('province', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las provincias" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las provincias</SelectItem>
                    {PROVINCES.map((province) => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="town">
                  Localidad
                </label>
                <Input
                  id="town"
                  placeholder="Buscar localidad..."
                  value={filters.town}
                  onChange={(e) => handleFilterChange('town', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="flag">
                  Marca
                </label>
                <Select
                  value={filters.flag}
                  onValueChange={(value) => handleFilterChange('flag', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las marcas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las marcas</SelectItem>
                    {FLAGS.map((flag) => (
                      <SelectItem key={flag} value={flag}>
                        {flag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end space-x-2">
                <Button 
                  variant="outline" 
                  className="w-full mt-6"
                  onClick={resetFilters}
                >
                  Limpiar filtros
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4">
          {error ? (
            <div className="text-center py-12">
              <div className="text-destructive">
                Error al cargar las estaciones. Por favor, inténtalo de nuevo más tarde.
              </div>
              <pre className="mt-2 text-sm text-muted-foreground">
                {error.message}
              </pre>
            </div>
          ) : (
            <StationsList 
              stations={stations}
              isLoading={isLoading}
              currentPage={filters.page}
              totalPages={stationsData?.totalPages || 1}
              onPageChange={(page) => handleFilterChange('page', page.toString())}
            />
          )}
        </div>
      </div>
    </div>
  );
}
