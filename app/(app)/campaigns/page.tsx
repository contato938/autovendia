'use client';

import { CampaignsTable } from '@/components/dashboard/CampaignsTable';
import { CampaignDetailsDrawer } from '@/components/dashboard/CampaignDetailsDrawer';
import { useQuery } from '@tanstack/react-query';
import { dashboardGoogleService } from '@/services/dashboardGoogle';
import { useState } from 'react';
import { useStore } from '@/store/useStore';
import type { DashboardFilters as FilterType, CampaignRow } from '@/types/googleAdsDashboard';
import { DashboardFilters } from '@/components/dashboard/DashboardFilters';
import { Skeleton } from '@/components/ui/skeleton';

export default function CampaignsPage() {
  const [filters, setFilters] = useState<FilterType>({ dateRange: { preset: '30d' } });
  const { selectedTenantId } = useStore();
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignRow | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data: summary, isLoading } = useQuery({
    queryKey: ['dashboardGoogle', filters, selectedTenantId],
    queryFn: () => dashboardGoogleService.getDashboardSummary(filters, selectedTenantId || undefined),
    enabled: !!selectedTenantId,
  });

  const handleCampaignClick = (campaign: CampaignRow) => {
    setSelectedCampaign(campaign);
    setIsDrawerOpen(true);
  };

  if (isLoading || !summary) return <div className="p-6"><Skeleton className="h-96 w-full" /></div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gerenciamento de Campanhas</h1>
        <DashboardFilters filters={filters} onFiltersChange={setFilters} onRefresh={() => {}} isLoading={isLoading} />
      </div>
      
      <CampaignsTable campaigns={summary.campaigns} onCampaignClick={handleCampaignClick} />

      <CampaignDetailsDrawer
        campaign={selectedCampaign}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
