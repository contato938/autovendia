import { KpiGrid, KpiItemConfig } from './KpiGrid';
import { Users, UserPlus, Repeat, Clock, TrendingUp } from 'lucide-react';
import type { CustomerKpis } from '@/types/googleAdsDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CustomersLtvCardProps {
  customers: CustomerKpis;
}

export function CustomersLtvCard({ customers }: CustomersLtvCardProps) {
  const items: KpiItemConfig[] = [
    { 
      title: 'Clientes Únicos', 
      value: customers.uniqueCustomers, 
      icon: Users, 
      format: 'number' 
    },
    { 
      title: 'Novos Clientes', 
      value: customers.newCustomersPct, 
      icon: UserPlus, 
      format: 'percent' 
    },
    { 
      title: 'Recompra', 
      value: customers.returningCustomersPct, 
      icon: Repeat, 
      format: 'percent' 
    },
    { 
      title: 'LTV Estimado', 
      value: customers.ltv, 
      icon: TrendingUp, 
      format: 'currency' 
    },
    { 
      title: 'LTV / CAC', 
      value: customers.ltvCacRatio, 
      icon: TrendingUp, 
      format: 'decimal' 
    },
    { 
      title: 'Ciclo de Compra', 
      value: `${customers.avgDaysBetweenPurchases || '-'} dias`, 
      icon: Clock, 
      format: 'number' 
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saúde da Base de Clientes (LTV)</CardTitle>
      </CardHeader>
      <CardContent>
        <KpiGrid items={items} columns={3} />
      </CardContent>
    </Card>
  );
}
