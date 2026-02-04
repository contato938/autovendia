import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown } from 'lucide-react';
import type { FunnelMetrics } from '@/types/googleAdsDashboard';

interface FunnelCardProps {
  funnel: FunnelMetrics;
  kpis?: any; // legacy compat
}

export function FunnelCard({ funnel }: FunnelCardProps) {
  // Safe access to funnel properties
  const impressions = funnel?.impressions ?? 0;
  const clicks = funnel?.clicks ?? 0;
  const whatsapp_started = funnel?.whatsapp_started ?? 0;
  const qualified = funnel?.qualified ?? 0;
  const purchases = funnel?.purchases ?? 0;

  // Taxas de conversão etapa por etapa
  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
  const clickToWhatsapp = clicks > 0 ? (whatsapp_started / clicks) * 100 : 0;
  const whatsappToQualified = whatsapp_started > 0 ? (qualified / whatsapp_started) * 100 : 0;
  const qualifiedToPurchase = qualified > 0 ? (purchases / qualified) * 100 : 0;
  
  // Taxa global
  const conversionRate = clicks > 0 ? (purchases / clicks) * 100 : 0;

  const FunnelStep = ({ label, value, subValue, highlight = false }: any) => (
    <div className={`p-3 rounded-lg border ${highlight ? 'bg-blue-50 border-blue-100' : 'bg-white border-gray-100'}`}>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        <span className="text-lg font-bold text-gray-900">{(value ?? 0).toLocaleString('pt-BR')}</span>
      </div>
      {subValue && <p className="text-xs text-right text-muted-foreground mt-1">{subValue}</p>}
    </div>
  );

  const ConversionArrow = ({ rate, label }: { rate: number, label?: string }) => (
    <div className="flex flex-col items-center justify-center py-1 relative z-10">
      <ArrowDown className="text-gray-300 h-5 w-5" />
      <span className="text-xs font-semibold bg-gray-100 px-2 py-0.5 rounded-full text-gray-600 border border-gray-200 mt-[-8px]">
        {rate.toFixed(1)}% {label}
      </span>
    </div>
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Funil de Vendas</CardTitle>
        <CardDescription>Jornada do cliente: Impressão até Venda</CardDescription>
      </CardHeader>
      <CardContent className="space-y-1">
        
        {/* Etapa 1: Impressões */}
        <FunnelStep label="Impressões" value={impressions} />
        
        <ConversionArrow rate={ctr} label="CTR" />
        
        {/* Etapa 2: Cliques */}
        <FunnelStep label="Cliques (Tráfego)" value={clicks} />
        
        <ConversionArrow rate={clickToWhatsapp} label="Conv." />
        
        {/* Etapa 3: Conversas */}
        <FunnelStep label="Conversas Iniciadas" value={whatsapp_started} highlight />
        
        <ConversionArrow rate={whatsappToQualified} label="Qualif." />
        
        {/* Etapa 4: Qualificados */}
        <FunnelStep label="Leads Qualificados" value={qualified} />
        
        <ConversionArrow rate={qualifiedToPurchase} label="Fech." />
        
        {/* Etapa 5: Vendas */}
        <FunnelStep label="Vendas Confirmadas" value={purchases} highlight />

        <div className="pt-4 mt-2 text-center text-sm text-gray-500 border-t">
          Taxa de Conversão Global (Clique → Venda): <span className="font-bold text-gray-900">{conversionRate.toFixed(2)}%</span>
        </div>
      </CardContent>
    </Card>
  );
}
