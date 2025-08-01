"use client";

import { Station } from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Fuel, MapPin, Clock } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface StationsListProps {
  stations: Station[];
  isLoading?: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function StationsList({
  stations,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
}: StationsListProps) {
  console.log(
    "StationsList - totalPages:",
    totalPages,
    "currentPage:",
    currentPage
  );
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

  const canGoBack = currentPage > 1;
  const canGoForward = currentPage < totalPages;
  const pageNumbers = [];

  // Show up to 3 page numbers around the current page
  for (
    let i = Math.max(1, currentPage - 1);
    i <= Math.min(totalPages, currentPage + 1);
    i++
  ) {
    pageNumbers.push(i);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stations.map((station) => (
          <Card
            key={station.stationId}
            className="hover:shadow-md transition-shadow"
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{station.stationName}</CardTitle>
                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                  {station.flag.split(" ")[0]}
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
                  <div
                    key={product.productId}
                    className="flex justify-between items-center"
                  >
                    <span className="text-sm font-medium">
                      {product.productName}
                    </span>
                    {product.prices[0] ? (
                      <div className="text-right">
                        <div className="font-bold">
                          ${product.prices[0].price.toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {format(
                            new Date(product.prices[0].date),
                            "dd/MM/yyyy",
                            { locale: es }
                          )}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Sin datos
                      </span>
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

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 mt-6">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => onPageChange(1)}
              disabled={!canGoBack}
            >
              <span className="sr-only">Ir a la primera página</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={!canGoBack}
            >
              <span className="sr-only">Página anterior</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            {pageNumbers.map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                className="h-8 w-8 p-0"
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            ))}
            {currentPage + 1 < totalPages && totalPages > 3 && (
              <span className="px-2">...</span>
            )}
            {!pageNumbers.includes(totalPages) && totalPages > 0 && (
              <Button
                variant={currentPage === totalPages ? "default" : "outline"}
                className="h-8 w-8 p-0"
                onClick={() => onPageChange(totalPages)}
              >
                {totalPages}
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={!canGoForward}
            >
              <span className="sr-only">Página siguiente</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => onPageChange(totalPages)}
              disabled={!canGoForward}
            >
              <span className="sr-only">Ir a la última página</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
