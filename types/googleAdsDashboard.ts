// Types específicos para o Dashboard Google Ads

export type DateRangePreset = 'today' | '7d' | '14d' | '30d' | 'mtd' | 'custom';

export interface DateRangeFilter {
  preset?: DateRangePreset;
  from?: string; // ISO date
  to?: string; // ISO date
}

export interface DashboardFilters {
  dateRange: DateRangeFilter;
  customerId?: string; // Para multi-cliente
}

// KPIs principais do negócio
export interface Kpis {
  spend: number;
  clicks: number;
  cpc: number;
  whatsapp_started: number;
  qualified: number;
  purchases: number;
  revenue: number;
  roas: number;
}

// Delta vs período anterior
export interface KpiDelta {
  spend: number;
  clicks: number;
  cpc: number;
  whatsapp_started: number;
  qualified: number;
  purchases: number;
  revenue: number;
  roas: number;
  // Percentual de mudança para cada métrica
  deltaPercent: {
    spend: number;
    clicks: number;
    cpc: number;
    whatsapp_started: number;
    qualified: number;
    purchases: number;
    revenue: number;
    roas: number;
  };
}

// Série temporal para o gráfico
export interface TimeSeriesPoint {
  date: string; // ISO date
  spend: number;
  whatsapp_started: number;
  purchases: number;
  revenue: number;
}

// Row da tabela de campanhas
export interface CampaignRow {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'ended';
  spend: number;
  clicks: number;
  cpc: number;
  whatsapp_started: number;
  qualified: number;
  purchases: number;
  revenue: number;
  roas: number;
}

// Saúde da atribuição (coração do serviço)
export interface AttributionHealth {
  attributedRate: number; // % de leads com gclid/wbraid/gbraid
  unattributedCount: number; // Leads sem identificador
  avgClickToFirstMsgMinutes: number; // Tempo médio clique → primeira msg
  trackingAlerts: string[]; // Alertas de tracking (ex: "Taxa caiu 15% vs ontem")
}

// Métricas do funil
export interface FunnelMetrics {
  clicks: number;
  whatsapp_started: number;
  qualified: number;
  purchases: number;
}

// Saúde operacional do atendimento
export interface OpsMetrics {
  firstResponseAvgMinutes: number; // Tempo médio de 1ª resposta
  unansweredCount: number; // Conversas sem resposta
  staleCount: number; // Conversas paradas há X horas
}

// Sumário de conversões offline
export interface OfflineConversionSummary {
  queued: number; // Na fila
  failed: number; // Com falha
  sentToday: number; // Enviadas hoje
  lastSendAt?: string; // Timestamp do último envio (ISO)
}

// Resposta completa do dashboard
export interface DashboardSummary {
  kpis: Kpis;
  delta: KpiDelta;
  series: TimeSeriesPoint[];
  campaigns: CampaignRow[];
  attribution: AttributionHealth;
  funnel: FunnelMetrics;
  ops: OpsMetrics;
  offline: OfflineConversionSummary;
}
