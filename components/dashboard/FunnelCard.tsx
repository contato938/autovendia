import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import type { FunnelMetrics, Kpis } from '@/types/googleAdsDashboard';

interface FunnelCardProps {
  funnel: FunnelMetrics;
  kpis: Kpis;
}

export function FunnelCard({ funnel, kpis }: FunnelCardProps) {
  const whatsappRate = funnel.clicks > 0 ? (funnel.whatsapp_started / funnel.clicks) * 100 : 0;
  const qualifiedRate = funnel.whatsapp_started > 0 ? (funnel.qualified / funnel.whatsapp_started) * 100 : 0;
  const purchaseRate = funnel.whatsapp_started > 0 ? (funnel.purchases / funnel.whatsapp_started) * 100 : 0;

  const costPerWhatsapp = funnel.whatsapp_started > 0 ? kpis.spend / funnel.whatsapp_started : 0;
  const costPerPurchase = funnel.purchases > 0 ? kpis.spend / funnel.purchases : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Funil AutovendaIA</CardTitle>
        <CardDescription>Da propaganda até a venda confirmada</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Etapa 1: Cliques */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Cliques (Google)</span>
                <span className="text-lg font-bold">{funnel.clicks.toLocaleString('pt-BR')}</span>
              </div>
              <div className="h-3 bg-blue-100 dark:bg-blue-950 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: '100%' }} />
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                CPC médio: R$ {kpis.cpc.toFixed(2)}
              </div>
            </div>
          </div>

          <ArrowRight className="h-4 w-4 text-muted-foreground mx-auto" />

          {/* Etapa 2: WhatsApp */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">WhatsApp Iniciado</span>
                <span className="text-lg font-bold">{funnel.whatsapp_started.toLocaleString('pt-BR')}</span>
              </div>
              <div className="h-3 bg-green-100 dark:bg-green-950 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: `${whatsappRate}%` }} />
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {whatsappRate.toFixed(1)}% dos cliques • R$ {costPerWhatsapp.toFixed(2)} por conversa
              </div>
            </div>
          </div>

          <ArrowRight className="h-4 w-4 text-muted-foreground mx-auto" />

          {/* Etapa 3: Qualificado */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Qualificado</span>
                <span className="text-lg font-bold">{funnel.qualified.toLocaleString('pt-BR')}</span>
              </div>
              <div className="h-3 bg-amber-100 dark:bg-amber-950 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500" style={{ width: `${qualifiedRate}%` }} />
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {qualifiedRate.toFixed(1)}% das conversas
              </div>
            </div>
          </div>

          <ArrowRight className="h-4 w-4 text-muted-foreground mx-auto" />

          {/* Etapa 4: Venda */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Vendas</span>
                <span className="text-lg font-bold">{funnel.purchases.toLocaleString('pt-BR')}</span>
              </div>
              <div className="h-3 bg-purple-100 dark:bg-purple-950 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500" style={{ width: `${purchaseRate}%` }} />
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {purchaseRate.toFixed(1)}% das conversas • R$ {costPerPurchase.toFixed(2)} CAC
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
