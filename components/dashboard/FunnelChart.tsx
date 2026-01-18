'use client';

import { DashboardFunnel } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface FunnelChartProps {
  data?: DashboardFunnel;
}

export function FunnelChart({ data }: FunnelChartProps) {
  if (!data) return null;

  const funnelData = [
    { stage: 'Cliques', value: data.clicks, color: 'hsl(var(--chart-1))' },
    { stage: 'WhatsApp', value: data.whatsappMessages, color: 'hsl(var(--chart-2))' },
    { stage: 'Vendas', value: data.sales, color: 'hsl(var(--chart-3))' },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={funnelData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis type="number" className="text-xs" />
        <YAxis dataKey="stage" type="category" className="text-xs" width={80} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'hsl(var(--background))', 
            border: '1px solid hsl(var(--border))' 
          }}
        />
        <Bar dataKey="value" radius={[0, 8, 8, 0]}>
          {funnelData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
