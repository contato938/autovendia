import { KPICard } from './KPICard';
import { DollarSign, MousePointerClick, MessageSquare, UserCheck, ShoppingCart, TrendingUp } from 'lucide-react';
import type { Kpis, KpiDelta } from '@/types/googleAdsDashboard';

interface KpiGridProps {
  kpis: Kpis;
  delta: KpiDelta;
}

export function KpiGrid({ kpis, delta }: KpiGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <KPICard
        title="Investimento"
        value={`R$ ${kpis.spend.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
        icon={DollarSign}
        delta={delta.deltaPercent.spend}
      />
      <KPICard
        title="Cliques"
        value={kpis.clicks.toLocaleString('pt-BR')}
        icon={MousePointerClick}
        delta={delta.deltaPercent.clicks}
      />
      <KPICard
        title="Conversas WhatsApp"
        value={kpis.whatsapp_started.toLocaleString('pt-BR')}
        icon={MessageSquare}
        delta={delta.deltaPercent.whatsapp_started}
      />
      <KPICard
        title="Leads Qualificados"
        value={kpis.qualified.toLocaleString('pt-BR')}
        icon={UserCheck}
        delta={delta.deltaPercent.qualified}
      />
      <KPICard
        title="Vendas"
        value={kpis.purchases.toLocaleString('pt-BR')}
        icon={ShoppingCart}
        delta={delta.deltaPercent.purchases}
      />
      <KPICard
        title="Receita"
        value={`R$ ${kpis.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
        icon={DollarSign}
        delta={delta.deltaPercent.revenue}
      />
      <KPICard
        title="CPC"
        value={`R$ ${kpis.cpc.toFixed(2)}`}
        icon={MousePointerClick}
        delta={delta.deltaPercent.cpc}
      />
      <KPICard
        title="ROAS"
        value={`${kpis.roas.toFixed(2)}x`}
        icon={TrendingUp}
        delta={delta.deltaPercent.roas}
      />
    </div>
  );
}
