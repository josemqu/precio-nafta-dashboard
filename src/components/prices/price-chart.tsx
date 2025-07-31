'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';

export interface PriceDataPoint {
  date: string;
  [key: string]: number | string;
}

interface PriceChartProps {
  data: PriceDataPoint[];
  products: string[];
  isLoading?: boolean;
}

const COLORS = [
  '#3b82f6', // blue-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
];

export function PriceChart({ data, products, isLoading }: PriceChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Evolución de precios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <Skeleton className="h-full w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Evolución de precios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center text-muted-foreground">
            No hay datos disponibles para mostrar el gráfico
          </div>
        </CardContent>
      </Card>
    );
  }

  // Ordenar los datos por fecha
  const sortedData = [...data].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Formatear fechas para el eje X
  const formatXAxis = (date: string) => {
    return format(new Date(date), 'dd/MM', { locale: es });
  };

  // Formatear tooltip
  const formatTooltip = (value: number, name: string) => {
    return [`$${value.toFixed(2)}`, name];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolución de precios</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={sortedData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatXAxis}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tickFormatter={(value) => `$${value}`}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value: number, name: string) => formatTooltip(value, name)}
                labelFormatter={(label) => `Fecha: ${format(new Date(label), 'PPP', { locale: es })}`}
              />
              <Legend />
              {products.map((product, index) => (
                <Line
                  key={product}
                  type="monotone"
                  dataKey={product}
                  stroke={COLORS[index % COLORS.length]}
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                  name={product}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
