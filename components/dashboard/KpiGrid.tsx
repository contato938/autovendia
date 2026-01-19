import { KPICard } from './KPICard';
import { DollarSign, MousePointerClick, MessageSquare, UserCheck, ShoppingCart, TrendingUp } from 'lucide-react';
import type { Kpis, KpiDelta } from '@/types/googleAdsDashboard';

interface KpiGridProps {
  kpis: Kpis;
  delta: KpiDelta;
}

export function KpiGrid({ kpis, delta }: KpiGridProps) {
  const formatTrend = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <KPICard
        title="Investimento"
        value={`R$ ${kpis.spend.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
        icon={DollarSign}
        trend={formatTrend(delta.deltaPercent.spend)}
        trendUp={delta.deltaPercent.spend >= 0}
      />
      <KPICard
        title="Cliques"
        value={kpis.clicks.toLocaleString('pt-BR')}
        icon={MousePointerClick}
        trend={formatTrend(delta.deltaPercent.clicks)}
        trendUp={delta.deltaPercent.clicks >= 0}
      />
      <KPICard
        title="Conversas WhatsApp"
        value={kpis.whatsapp_started.toLocaleString('pt-BR')}
        icon={MessageSquare}
        trend={formatTrend(delta.deltaPercent.whatsapp_started)}
        trendUp={delta.deltaPercent.whatsapp_started >= 0}
      />
      <KPICard
        title="Leads Qualificados"
        value={kpis.qualified.toLocaleString('pt-BR')}
        icon={UserCheck}
        trend={formatTrend(delta.deltaPercent.qualified)}
        trendUp={delta.deltaPercent.qualified >= 0}
      />
      <KPICard
        title="Vendas"
        value={kpis.purchases.toLocaleString('pt-BR')}
        icon={ShoppingCart}
        trend={formatTrend(delta.deltaPercent.purchases)}
        trendUp={delta.deltaPercent.purchases >= 0}
      />
      <KPICard
        title="Receita"
        value={`R$ ${kpis.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
        icon={DollarSign}
        trend={formatTrend(delta.deltaPercent.revenue)}
        trendUp={delta.deltaPercent.revenue >= 0}
      />
      <KPICard
        title="CPC"
        value={`R$ ${kpis.cpc.toFixed(2)}`}
        icon={MousePointerClick}
        trend={formatTrend(delta.deltaPercent.cpc)}
        trendUp={delta.deltaPercent.cpc >= 0}
      />
      <KPICard
        title="ROAS"
        value={`${kpis.roas.toFixed(2)}x`}
        icon={TrendingUp}
        trend={formatTrend(delta.deltaPercent.roas)}
        trendUp={delta.deltaPercent.roas >= 0}
      />
    </div>
  );
}
