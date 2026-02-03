// Types específicos para o Dashboard Google Ads

export type DateRangePreset = 'today' | '7d' | '14d' | '30d' | 'mtd' | 'custom';

export interface DateRangeFilter {
  preset?: DateRangePreset;
  from?: string; // ISO date
  to?: string; // ISO date
}

export interface DashboardFilters {
  dateRange: DateRangeFilter;
  tenant_id?: string;
  customerId?: string; // Para multi-cliente
}

// KPI simples (valor e delta)
export interface KpiValue {
  value: number;
  previousValue?: number;
  deltaPercent?: number; // Calculado no front ou back: (value - prev) / prev
}

// Marketing (Topo do Funil)
export interface MarketingKpis {
  spend: KpiValue;
  impressions: KpiValue;
  clicks: KpiValue;
  ctr: KpiValue;
  cpc: KpiValue;
  cpm: KpiValue;
  // Qualidade do Leilão
  impressionShare: number; // %
  topImpressionShare: number; // %
  lostBudgetShare: number; // %
  lostRankShare: number; // %
}

// Conversão e Operação (Meio do Funil)
export interface ChannelKpis {
  whatsapp_started: KpiValue;
  calls: KpiValue;
  call_answered_rate: number;
  click_to_whatsapp_rate: number; // %
  cost_per_conversation: number; // R$
}

export interface OpsMetrics {
  firstResponseAvgMinutes: number;
  unansweredCount: number;
  staleCount: number; // >24h
  responseRate: number; // %
  followUpRate: number; // %
  topSellers?: { name: string; conversionRate: number }[]; // mini ranking opcional
}

// Vendas e Negócio (Fundo do Funil)
export interface SalesKpis {
  orders: KpiValue; // Vendas confirmadas
  revenue: KpiValue;
  ticket: KpiValue; // Ticket médio
  cac: KpiValue; // Mídia / Vendas
  roas: KpiValue; 
  margin?: number; // Margem bruta estimada
}

// Clientes e LTV
export interface CustomerKpis {
  uniqueCustomers: number;
  newCustomersPct: number; // %
  returningCustomersPct: number; // %
  ltv: number; // Lifetime Value estimado
  ltvCacRatio: number; // LTV / CAC
  avgDaysBetweenPurchases?: number;
}

// Alert System
export type AlertSeverity = 'critical' | 'warning' | 'info' | 'success';

export interface AlertItem {
  id: string;
  severity: AlertSeverity;
  title: string;
  detail?: string;
  metric?: string; // ex: 'ctr', 'roas'
}

// Série temporal para gráficos
export interface TimeSeriesPoint {
  date: string;
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
  ctr: number; // %
  whatsapp_started: number;
  qualified: number;
  purchases: number;
  revenue: number;
  roas: number;
  // Campos novos
  revenueSharePct: number; // % contribuição na receita total
  cac: number;
  ltv: number;
  label?: 'escalar' | 'manter' | 'ajustar' | 'pausar';
}

// Atribuição (Health)
export interface AttributionHealth {
  attributedRate: number;
  unattributedCount: number;
  avgClickToFirstMsgMinutes: number;
  trackingAlerts: string[];
}

export interface FunnelMetrics {
  impressions: number;
  clicks: number;
  whatsapp_started: number;
  qualified: number;
  proposals?: number; // Opcional
  purchases: number;
}

export interface OfflineConversionSummary {
  queued: number;
  failed: number;
  sentToday: number;
  lastSendAt?: string;
}

// NOVO FORMATO COMPLETO DO DASHBOARD
export interface DashboardSummary {
  // Blocos principais
  marketing: MarketingKpis;
  conversion: ChannelKpis;
  sales: SalesKpis;
  customers: CustomerKpis;
  ops: OpsMetrics;
  
  // Detalhes existentes
  funnel: FunnelMetrics;
  attribution: AttributionHealth;
  offline: OfflineConversionSummary;
  
  // Listas
  series: TimeSeriesPoint[];
  campaigns: CampaignRow[]; // Tabela expandida
  alerts: AlertItem[];
  
  // Legacy / Compatibilidade (opcional, manter se quiser facilitar refactor progressivo)
  // Mas a ideia é migrar tudo para os blocos acima.
  // Vou comentar para forçar o uso dos novos, mas se quebrar muito eu reativo.
  kpis?: any; 
  delta?: any;
}
