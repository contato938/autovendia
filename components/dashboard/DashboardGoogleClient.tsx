'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardGoogleService } from '@/services/dashboardGoogle';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardFilters } from './DashboardFilters';
import { KpiGrid } from './KpiGrid';
import { AttributionHealthCard } from './AttributionHealthCard';
import { TrendChart } from './TrendChart';
import { CampaignsTable } from './CampaignsTable';
import { CampaignDetailsDrawer } from './CampaignDetailsDrawer';
import { FunnelCard } from './FunnelCard';
import { OpsHealthCard } from './OpsHealthCard';
import { OfflineConversionsCard } from './OfflineConversionsCard';
import type { DashboardFilters as FilterType, CampaignRow } from '@/types/googleAdsDashboard';
import { useStore } from '@/store/useStore';

export function DashboardGoogleClient() {
  const [filters, setFilters] = useState<FilterType>({
    dateRange: { preset: '30d' },
  });
  const { selectedTenantId } = useStore();

  const [selectedCampaign, setSelectedCampaign] = useState<CampaignRow | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data: summary, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboardGoogle', filters, selectedTenantId],
    queryFn: () => dashboardGoogleService.getDashboardSummary(filters, selectedTenantId || undefined),
    staleTime: 60 * 1000, // 60s
    enabled: !!selectedTenantId,
  });

  const handleCampaignClick = (campaign: CampaignRow) => {
    setSelectedCampaign(campaign);
    setIsDrawerOpen(true);
  };

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Google Ads</h1>
          <p className="text-muted-foreground">
            Atribuição, conversão offline e performance de vendas
          </p>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <CardTitle>Falha ao carregar dados do dashboard</CardTitle>
            <Button onClick={() => refetch()} variant="outline">
              Tentar novamente
            </Button>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Ocorreu um erro ao buscar o resumo via Supabase. Verifique a integração e tente novamente.
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading || !summary) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Google Ads</h1>
        <p className="text-muted-foreground">
          Atribuição, conversão offline e performance de vendas
        </p>
      </div>

      {/* Filtros */}
      <DashboardFilters
        filters={filters}
        onFiltersChange={setFilters}
        onRefresh={() => refetch()}
        isLoading={isLoading}
      />

      {/* Linha 1: KPIs */}
      <KpiGrid kpis={summary.kpis} delta={summary.delta} />

      {/* Linha 2: Atribuição e Tracking */}
      <div className="grid gap-4 lg:grid-cols-1">
        <AttributionHealthCard attribution={summary.attribution} />
      </div>

      {/* Linha 3: Gráfico de Tendência */}
      <TrendChart data={summary.series} />

      {/* Linha 4: Tabela de Campanhas */}
      <CampaignsTable 
        campaigns={summary.campaigns} 
        onCampaignClick={handleCampaignClick}
      />

      {/* Linha 5: Funil */}
      <FunnelCard funnel={summary.funnel} kpis={summary.kpis} />

      {/* Linha 6: Saúde Operacional */}
      <div className="grid gap-4 lg:grid-cols-2">
        <OpsHealthCard ops={summary.ops} />
        <OfflineConversionsCard offline={summary.offline} />
      </div>

      {/* Drawer de Detalhes */}
      <CampaignDetailsDrawer
        campaign={selectedCampaign}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
