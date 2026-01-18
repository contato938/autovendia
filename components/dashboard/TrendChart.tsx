'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { TimeSeriesPoint } from '@/types/googleAdsDashboard';

interface TrendChartProps {
  data: TimeSeriesPoint[];
}

export function TrendChart({ data }: TrendChartProps) {
  const formattedData = data.map(point => ({
    ...point,
    dateFormatted: format(parseISO(point.date), 'dd/MM', { locale: ptBR })
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tendência (30 dias)</CardTitle>
        <CardDescription>Evolução de investimento, conversas WhatsApp, vendas e receita</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="dateFormatted" 
              className="text-xs"
              tick={{ fontSize: 12 }}
            />
            <YAxis className="text-xs" tick={{ fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))', 
                border: '1px solid hsl(var(--border))' 
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="spend" 
              stroke="hsl(var(--chart-1))" 
              strokeWidth={2} 
              name="Investimento"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="whatsapp_started" 
              stroke="hsl(var(--chart-2))" 
              strokeWidth={2} 
              name="WhatsApp iniciados"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="purchases" 
              stroke="hsl(var(--chart-3))" 
              strokeWidth={2} 
              name="Vendas"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="hsl(var(--chart-4))" 
              strokeWidth={2} 
              name="Receita"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
