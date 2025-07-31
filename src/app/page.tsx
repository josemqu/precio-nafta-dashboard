import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Fuel, MapPin, TrendingUp, Clock } from "lucide-react";

export default function Home() {
  // Datos de ejemplo - en una aplicación real estos vendrían de la API
  const stats = [
    { 
      title: "Estaciones monitoreadas", 
      value: "1,250", 
      icon: <MapPin className="h-6 w-6 text-muted-foreground" />,
      change: "+5% desde el mes pasado"
    },
    { 
      title: "Precio promedio Nafta", 
      value: "$1,250", 
      icon: <Fuel className="h-6 w-6 text-muted-foreground" />,
      change: "+3.5% desde la semana pasada"
    },
    { 
      title: "Actualización más reciente", 
      value: "Hace 2 horas", 
      icon: <Clock className="h-6 w-6 text-muted-foreground" />,
      change: "Actualización en tiempo real"
    },
  ];

  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Panel de Control</h1>
          <div className="flex items-center space-x-2">
            <Button variant="outline" asChild>
              <Link href="/estaciones">Ver todas las estaciones</Link>
            </Button>
            <Button asChild>
              <Link href="/mapa">Ver en mapa</Link>
            </Button>
          </div>
        </div>

        {/* Estadísticas principales */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sección de precios recientes */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Evolución de precios</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                  <p>Gráfico de evolución de precios</p>
                  <p className="text-sm">Se mostrará la evolución de los precios en el tiempo</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Estaciones recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Estación {i}</p>
                      <p className="text-sm text-muted-foreground">Ciudad, Provincia</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">$1,2{i}50</p>
                      <p className="text-xs text-muted-foreground">Nafta</p>
                    </div>
                  </div>
                ))}
                <Button variant="ghost" className="w-full mt-4" asChild>
                  <Link href="/estaciones">Ver todas las estaciones</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
