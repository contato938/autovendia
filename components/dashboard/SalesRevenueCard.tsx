import { KpiGrid, KpiItemConfig } from './KpiGrid';
import { DollarSign, ShoppingCart, TrendingUp, CreditCard } from 'lucide-react';
import type { SalesKpis } from '@/types/googleAdsDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SalesRevenueCardProps {
  sales: SalesKpis;
}

export function SalesRevenueCard({ sales }: SalesRevenueCardProps) {
  const items: KpiItemConfig[] = [
    { 
      title: 'Receita Total', 
      value: sales.revenue.value, 
      kpiValue: sales.revenue, 
      icon: DollarSign, 
      format: 'currency' 
    },
    { 
      title: 'Vendas Confirmadas', 
      value: sales.orders.value, 
      kpiValue: sales.orders, 
      icon: ShoppingCart, 
      format: 'number' 
    },
    { 
      title: 'Ticket Médio', 
      value: sales.ticket.value, 
      kpiValue: sales.ticket, 
      icon: CreditCard, 
      format: 'currency' 
    },
    { 
      title: 'CAC (Mídia)', 
      value: sales.cac.value, 
      kpiValue: sales.cac, 
      icon: TrendingUp, 
      format: 'currency',
      trendReversed: true 
    },
    { 
      title: 'ROAS', 
      value: `${sales.roas.value.toFixed(2)}x`, 
      kpiValue: sales.roas, 
      icon: TrendingUp, 
      format: 'decimal' 
    },
    { 
      title: 'Margem Bruta (Est)', 
      value: sales.margin || 0, 
      icon: DollarSign, 
      format: 'percent' 
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance de Vendas & Receita</CardTitle>
      </CardHeader>
      <CardContent>
        <KpiGrid items={items} columns={3} />
      </CardContent>
    </Card>
  );
}
