'use client';

import { useState, useMemo, useCallback } from 'react';
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
import type { DashboardFilters as DashboardFiltersType, CampaignRow } from '@/types/googleAdsDashboard';
import { useStore } from '@/store/useStore';
import { MousePointerClick, TrendingUp, DollarSign, Eye, MessageSquare, Phone, UserCheck, Target, CreditCard, BarChart3, AlertCircle } from 'lucide-react';
import { MetricPulse } from './MetricPulse';

export function DashboardGoogleClient() {
  const [filters, setFilters] = useState<DashboardFiltersType>({
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

  const handleCampaignClick = useCallback((campaign: CampaignRow) => {
    setSelectedCampaign(campaign);
    setIsDrawerOpen(true);
  }, []);

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

  // Preparar Items para KpiGrid (Marketing) - Memoizado para evitar recriação
  const marketingItems: KpiItemConfig[] = useMemo(() => [
    { title: 'Investimento (Ads)', value: summary.marketing.spend.value, kpiValue: summary.marketing.spend, icon: DollarSign, format: 'currency' },
    { title: 'Impressões', value: summary.marketing.impressions.value, kpiValue: summary.marketing.impressions, icon: Eye, format: 'number' },
    { title: 'Cliques', value: summary.marketing.clicks.value, kpiValue: summary.marketing.clicks, icon: MousePointerClick, format: 'number' },
    { title: 'CTR', value: summary.marketing.ctr.value, kpiValue: summary.marketing.ctr, icon: MousePointerClick, format: 'percent' },
    { title: 'CPC Médio', value: summary.marketing.cpc.value, kpiValue: summary.marketing.cpc, icon: MousePointerClick, format: 'currency', trendReversed: true },
    { title: 'CPM', value: summary.marketing.cpm.value, kpiValue: summary.marketing.cpm, icon: DollarSign, format: 'currency', trendReversed: true },
  ], [summary.marketing]);

  // Preparar Items para KpiGrid (Canais / Conversão) - Memoizado para evitar recriação
  const channelItems: KpiItemConfig[] = useMemo(() => [
    { title: 'WhatsApp Iniciados', value: summary.conversion.whatsapp_started.value, kpiValue: summary.conversion.whatsapp_started, icon: MessageSquare, format: 'number' },
    { title: 'Ligações', value: summary.conversion.calls.value, kpiValue: summary.conversion.calls, icon: Phone, format: 'number' },
    { title: 'Custo/Conversa', value: summary.conversion.cost_per_conversation, icon: DollarSign, format: 'currency', trendReversed: true },
    { title: 'Taxa Clique→WhatsApp', value: summary.conversion.click_to_whatsapp_rate, icon: TrendingUp, format: 'percent' },
  ], [summary.conversion]);

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      
      {/* Header & Filtros */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Visão Geral</h1>
          <p className="text-sm text-muted-foreground mt-1">
             Performance unificada Google Ads & Operação
          </p>
        </div>
        <DashboardFilters
          filters={filters}
          onFiltersChange={setFilters}
          onRefresh={() => refetch()}
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 py-2">
        <MetricPulse 
          label="Investimento"
          value={`R$ ${summary.marketing.spend.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          delta={summary.marketing.spend.deltaPercent}
          trendReversed={true}
          icon={DollarSign}
        />
        <MetricPulse 
          label="Receita Gerada"
          value={`R$ ${summary.sales.revenue.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          delta={summary.sales.revenue.deltaPercent}
          icon={TrendingUp}
          className="border-l-0 md:border-l border-gray-200 md:pl-12"
        />
        <MetricPulse 
          label="ROAS"
          value={`${summary.sales.roas.value.toFixed(2)}x`}
          delta={summary.sales.roas.deltaPercent}
          icon={Target}
          className="border-l-0 md:border-l border-gray-200 md:pl-12"
        />
      </div>

      {/* Alertas (Inteligentes) - only if critical */}
      {summary.alerts && summary.alerts.length > 0 && (
        <div className="animate-in fade-in slide-in-from-top-2">
           <AlertsCard alerts={summary.alerts} />
        </div>
      )}

      {/* ZONE 2: THE FLOW (Deep Dive) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Column: Acquisition Flow (8 cols) */}
        <div className="xl:col-span-8 space-y-8">
          
          {/* Chart Section */}
          <div className="bg-white rounded-none">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-gray-400" />
                Tendência de Performance
              </h2>
            </div>
            <TrendChart data={summary.series} />
          </div>

          {/* Secondary Metrics Grid (Visual Break) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-100">
             <div>
                <h3 className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">Eficiência de Mídia</h3>
                <KpiGrid 
                  items={[
                    { title: 'CPC Médio', value: summary.marketing.cpc.value, kpiValue: summary.marketing.cpc, icon: MousePointerClick, format: 'currency', trendReversed: true },
                    { title: 'CTR', value: summary.marketing.ctr.value, kpiValue: summary.marketing.ctr, icon: MousePointerClick, format: 'percent' },
                    { title: 'Custo/Conversa', value: summary.conversion.cost_per_conversation, icon: MessageSquare, format: 'currency', trendReversed: true },
                    { title: 'Taxa Clique→Whats', value: summary.conversion.click_to_whatsapp_rate, icon: UserCheck, format: 'percent' },
                  ]} 
                  columns={2}
                  variant="minimal"
                />
             </div>
             <div>
                <h3 className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">Volume</h3>
                <KpiGrid 
                  items={[
                    { title: 'Impressões', value: summary.marketing.impressions.value, kpiValue: summary.marketing.impressions, icon: Eye, format: 'number' },
                    { title: 'Conversas Iniciadas', value: summary.conversion.whatsapp_started.value, kpiValue: summary.conversion.whatsapp_started, icon: MessageSquare, format: 'number' },
                    { title: 'Leads Qualificados', value: summary.funnel.qualified, icon: UserCheck, format: 'number' },
                    { title: 'Vendas Totais', value: summary.sales.orders.value, kpiValue: summary.sales.orders, icon: CreditCard, format: 'number' },
                  ]} 
                  columns={2}
                  variant="minimal"
                />
             </div>
          </div>
        </div>

        {/* Right Column: Health & Operations (4 cols) */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-slate-50/50 p-6 rounded-sm border border-slate-100 h-full">
            <h3 className="text-sm font-semibold text-slate-900 mb-6 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-slate-500" />
              Saúde da Operação
            </h3>
            
            <div className="space-y-6">
              <AttributionHealthCard attribution={summary.attribution} />
              <OpsHealthCard ops={summary.ops} />
              <OfflineConversionsCard offline={summary.offline} />
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-200">
               <FunnelCard funnel={summary.funnel} />
            </div>
          </div>
        </div>
      </div>

      {/* ZONE 3: THE DETAIL (Campaigns) */}
      <div className="pt-8 border-t border-gray-100">
        <div className="flex items-center justify-between mb-4">
           <h2 className="text-lg font-medium text-gray-900">Detalhamento por Campanha</h2>
        </div>
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
