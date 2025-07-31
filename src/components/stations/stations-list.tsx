'use client';

import { Station } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Fuel, MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface StationsListProps {
  stations: Station[];
  isLoading?: boolean;
}

export function StationsList({ stations, isLoading }: StationsListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-muted rounded w-full mb-2"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (stations.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <Fuel className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">No se encontraron estaciones</h3>
        <p className="text-sm text-muted-foreground mt-1">
          No hay estaciones que coincidan con los filtros seleccionados.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stations.map((station) => (
        <Card key={station.stationId} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{station.stationName}</CardTitle>
              <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                {station.flag}
              </span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              {station.town}, {station.province}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {station.products.slice(0, 2).map((product) => (
                <div key={product.productId} className="flex justify-between items-center">
                  <span className="text-sm font-medium">{product.productName}</span>
                  {product.prices[0] ? (
                    <div className="text-right">
                      <div className="font-bold">${product.prices[0].price.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {format(new Date(product.prices[0].date), 'dd/MM/yyyy', { locale: es })}
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">Sin datos</span>
                  )}
                </div>
              ))}
              {station.products.length > 2 && (
                <div className="text-center text-sm text-muted-foreground pt-2">
                  +{station.products.length - 2} productos más
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
