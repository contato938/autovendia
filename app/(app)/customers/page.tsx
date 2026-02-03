'use client';

import { CustomersLtvCard } from '@/components/dashboard/CustomersLtvCard';
import { useQuery } from '@tanstack/react-query';
import { dashboardGoogleService } from '@/services/dashboardGoogle';
import { useState } from 'react';
import { useStore } from '@/store/useStore';
import type { DashboardFilters as FilterType } from '@/types/googleAdsDashboard';
import { DashboardFilters } from '@/components/dashboard/DashboardFilters';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CustomersPage() {
  const [filters, setFilters] = useState<FilterType>({ dateRange: { preset: '30d' } });
  const { selectedTenantId } = useStore();

  const { data: summary, isLoading } = useQuery({
    queryKey: ['dashboardGoogle', filters, selectedTenantId],
    queryFn: () => dashboardGoogleService.getDashboardSummary(filters, selectedTenantId || undefined),
    enabled: !!selectedTenantId,
  });

  if (isLoading || !summary) return <div className="p-6"><Skeleton className="h-96 w-full" /></div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Base de Clientes</h1>
        <DashboardFilters filters={filters} onFiltersChange={setFilters} onRefresh={() => {}} isLoading={isLoading} />
      </div>
      
      <CustomersLtvCard customers={summary.customers} />

      <Card>
        <CardHeader><CardTitle>Top Clientes (LTV)</CardTitle></CardHeader>
        <CardContent>
           <div className="text-center text-muted-foreground py-8">
               Lista detalhada de clientes será ativada em breve.
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
