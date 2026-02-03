'use client';

import { SalesRevenueCard } from '@/components/dashboard/SalesRevenueCard';
import { CampaignsTable } from '@/components/dashboard/CampaignsTable';
import { useQuery } from '@tanstack/react-query';
import { dashboardGoogleService } from '@/services/dashboardGoogle';
import { useState } from 'react';
import { useStore } from '@/store/useStore';
import type { DashboardFilters as FilterType } from '@/types/googleAdsDashboard';
import { DashboardFilters } from '@/components/dashboard/DashboardFilters';
import { Skeleton } from '@/components/ui/skeleton';

export default function SalesPage() {
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
        <h1 className="text-3xl font-bold">Vendas & Receita</h1>
        <DashboardFilters filters={filters} onFiltersChange={setFilters} onRefresh={() => {}} isLoading={isLoading} />
      </div>
      
      <SalesRevenueCard sales={summary.sales} />
      
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Performance por Fonte de Receita</h2>
        <CampaignsTable campaigns={summary.campaigns} onCampaignClick={() => {}} />
      </div>
    </div>
  );
}
