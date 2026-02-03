'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardGoogleService } from '@/services/dashboardGoogle';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardFilters } from './DashboardFilters';
import { KpiGrid, KpiItemConfig } from './KpiGrid';
import { AttributionHealthCard } from './AttributionHealthCard';
import { TrendChart } from './TrendChart';
import { CampaignsTable } from './CampaignsTable';
import { CampaignDetailsDrawer } from './CampaignDetailsDrawer';
import { FunnelCard } from './FunnelCard';
import { OpsHealthCard } from './OpsHealthCard';
import { OfflineConversionsCard } from './OfflineConversionsCard';
import { AlertsCard } from './AlertsCard';
import { SalesRevenueCard } from './SalesRevenueCard';
import { CustomersLtvCard } from './CustomersLtvCard';
import type { DashboardFilters as FilterType, CampaignRow } from '@/types/googleAdsDashboard';
import { useStore } from '@/store/useStore';
import { MousePointerClick, TrendingUp, DollarSign, Eye, MessageSquare, Phone, UserCheck } from 'lucide-react';

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
          <p className="text-muted-foreground">Monitoramento completo de performance e rentabilidade</p>
        </div>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <CardTitle>Falha ao carregar dados</CardTitle>
            <Button onClick={() => refetch()} variant="outline">Tentar novamente</Button>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Erro na conexão com o banco de dados.
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading || !summary) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  // Preparar Items para KpiGrid (Marketing)
  const marketingItems: KpiItemConfig[] = [
    { title: 'Investimento (Ads)', value: summary.marketing.spend.value, kpiValue: summary.marketing.spend, icon: DollarSign, format: 'currency' },
    { title: 'Impressões', value: summary.marketing.impressions.value, kpiValue: summary.marketing.impressions, icon: Eye, format: 'number' },
    { title: 'Cliques', value: summary.marketing.clicks.value, kpiValue: summary.marketing.clicks, icon: MousePointerClick, format: 'number' },
    { title: 'CTR', value: summary.marketing.ctr.value, kpiValue: summary.marketing.ctr, icon: MousePointerClick, format: 'percent' },
    { title: 'CPC Médio', value: summary.marketing.cpc.value, kpiValue: summary.marketing.cpc, icon: MousePointerClick, format: 'currency', trendReversed: true },
    { title: 'CPM', value: summary.marketing.cpm.value, kpiValue: summary.marketing.cpm, icon: DollarSign, format: 'currency', trendReversed: true },
  ];

  // Preparar Items para KpiGrid (Canais / Conversão)
  const channelItems: KpiItemConfig[] = [
    { title: 'WhatsApp Iniciados', value: summary.conversion.whatsapp_started.value, kpiValue: summary.conversion.whatsapp_started, icon: MessageSquare, format: 'number' },
    { title: 'Ligações', value: summary.conversion.calls.value, kpiValue: summary.conversion.calls, icon: Phone, format: 'number' },
    { title: 'Custo/Conversa', value: summary.conversion.cost_per_conversation, icon: DollarSign, format: 'currency', trendReversed: true },
    { title: 'Taxa Clique→WhatsApp', value: summary.conversion.click_to_whatsapp_rate, icon: TrendingUp, format: 'percent' },
  ];

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      
      {/* Header & Filtros */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard de Gestão</h1>
          <p className="text-muted-foreground mt-1">
             Visão unificada: Marketing, Vendas e Operação.
          </p>
        </div>
        <DashboardFilters
          filters={filters}
          onFiltersChange={setFilters}
          onRefresh={() => refetch()}
          isLoading={isLoading}
        />
      </div>

      {/* Seção 1: Alertas (Inteligentes) */}
      {summary.alerts && summary.alerts.length > 0 && (
        <AlertsCard alerts={summary.alerts} />
      )}

      {/* Seção 2: Marketing & Topo de Funil */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-800 border-l-4 border-blue-500 pl-3">Marketing & Aquisição</h2>
        <KpiGrid items={marketingItems} columns={6} />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TrendChart data={summary.series} />
          </div>
          <div className="lg:col-span-1">
             <AttributionHealthCard attribution={summary.attribution} />
          </div>
        </div>
      </div>

      {/* Seção 3: Conversão & Operação */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-800 border-l-4 border-green-500 pl-3">Conversão & Operação</h2>
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
          <div className="xl:col-span-2">
             <KpiGrid title="Canais" items={channelItems} columns={2} />
          </div>
          <CustimizedOpsCard summary={summary} /> 
          {/* Note: Funnel takes distinct space */}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <FunnelCard funnel={summary.funnel} />
          <div className="space-y-6">
             <OpsHealthCard ops={summary.ops} />
             <OfflineConversionsCard offline={summary.offline} />
          </div>
        </div>
      </div>

      {/* Seção 4: Negócio & Vendas */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-800 border-l-4 border-purple-500 pl-3">Receita & Clientes</h2>
        <div className="grid gap-6 lg:grid-cols-2">
           <SalesRevenueCard sales={summary.sales} />
           <CustomersLtvCard customers={summary.customers} />
        </div>
      </div>

      {/* Seção 5: Campanhas */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-800 border-l-4 border-gray-500 pl-3">Detalhe por Campanha</h2>
        <CampaignsTable 
          campaigns={summary.campaigns} 
          onCampaignClick={handleCampaignClick}
        />
      </div>

      <CampaignDetailsDrawer
        campaign={selectedCampaign}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}

// Helper local wrapper if needed
function CustimizedOpsCard({ summary }: { summary: any }) { return null; } // not used directly, just cleaner layout above
