import { subDays, format } from 'date-fns';
import type {
  DashboardSummary,
  Kpis,
  KpiDelta,
  TimeSeriesPoint,
  CampaignRow,
  AttributionHealth,
  FunnelMetrics,
  OpsMetrics,
  OfflineConversionSummary,
} from '@/types/googleAdsDashboard';

// Gera série temporal de 30 dias com dados realistas
function generateTimeSeries(): TimeSeriesPoint[] {
  const series: TimeSeriesPoint[] = [];
  
  for (let i = 29; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const baseSpend = 1200 + Math.random() * 500;
    const whatsappRate = 0.025 + Math.random() * 0.01; // 2.5-3.5% dos gastos vira conversa
    const purchaseRate = 0.12 + Math.random() * 0.08; // 12-20% das conversas vira venda
    
    const whatsappStarted = Math.round(baseSpend * whatsappRate);
    const purchases = Math.round(whatsappStarted * purchaseRate);
    const revenue = purchases * (1800 + Math.random() * 800); // ticket médio R$ 1800-2600
    
    series.push({
      date: format(date, 'yyyy-MM-dd'),
      spend: Math.round(baseSpend),
      whatsapp_started: whatsappStarted,
      purchases,
      revenue: Math.round(revenue),
    });
  }
  
  return series;
}

// Gera 15-25 campanhas com distribuição plausível
function generateCampaigns(): CampaignRow[] {
  const campaignNames = [
    'Google Search - Peças Automotivas SP',
    'Google Search - Freios e Suspensão',
    'Google Search - Amortecedores',
    'Google Display - Manutenção Veículos',
    'Google Shopping - Kit Embreagem',
    'Google Performance Max - Auto Peças',
    'Google Search - Filtros e Óleos',
    'Google Display - Pneus e Alinhamento',
    'Google Search - Baterias Automotivas',
    'Google Shopping - Pastilhas de Freio',
    'Google Search - Escapamento',
    'Google Performance Max - Acessórios',
    'Google Display - Ar Condicionado Automotivo',
    'Google Search - Injeção Eletrônica',
    'Google Shopping - Velas e Cabos',
    'Google Search - Correias e Tensores',
    'Google Display - Iluminação Automotiva',
    'Google Search - Sistema Elétrico',
    'Google Performance Max - Oficina Mecânica',
    'Google Search - Direção Hidráulica',
  ];
  
  const numCampaigns = 15 + Math.floor(Math.random() * 11); // 15-25
  const campaigns: CampaignRow[] = [];
  
  for (let i = 0; i < numCampaigns; i++) {
    const status = i < numCampaigns - 3 ? 'active' : (Math.random() > 0.5 ? 'paused' : 'ended');
    const spend = status === 'active' 
      ? 800 + Math.random() * 8000 
      : 200 + Math.random() * 2000;
    
    const clicks = Math.round(spend / (2 + Math.random() * 3)); // CPC entre R$ 2-5
    const cpc = spend / clicks;
    
    // Simula atribuição quebrada em algumas campanhas
    const attributionWorking = Math.random() > 0.15; // 85% ok
    const whatsappRate = attributionWorking ? 0.025 + Math.random() * 0.015 : 0.005;
    const whatsappStarted = Math.round(clicks * whatsappRate);
    
    const qualifiedRate = 0.6 + Math.random() * 0.3; // 60-90% qualificados
    const qualified = Math.round(whatsappStarted * qualifiedRate);
    
    const purchaseRate = 0.1 + Math.random() * 0.15; // 10-25% viram venda
    const purchases = Math.round(whatsappStarted * purchaseRate);
    
    const avgTicket = 1500 + Math.random() * 1500; // R$ 1500-3000
    const revenue = purchases * avgTicket;
    const roas = spend > 0 ? revenue / spend : 0;
    
    campaigns.push({
      id: `gc${i + 1}`,
      name: campaignNames[i % campaignNames.length],
      status,
      spend: Math.round(spend),
      clicks,
      cpc: Math.round(cpc * 100) / 100,
      whatsapp_started: whatsappStarted,
      qualified,
      purchases,
      revenue: Math.round(revenue),
      roas: Math.round(roas * 100) / 100,
    });
  }
  
  // Ordena por spend decrescente
  return campaigns.sort((a, b) => b.spend - a.spend);
}

// Gera dados de atribuição (incluindo cenário de queda)
function generateAttributionHealth(): AttributionHealth {
  // Simula um cenário onde a atribuição caiu recentemente
  const attributedRate = 78 + Math.random() * 10; // 78-88%
  const unattributedCount = Math.round(15 + Math.random() * 20); // 15-35 leads
  const avgClickToFirstMsgMinutes = Math.round(8 + Math.random() * 15); // 8-23 min
  
  const trackingAlerts: string[] = [];
  
  if (attributedRate < 85) {
    trackingAlerts.push('Taxa de atribuição abaixo do ideal (< 85%)');
  }
  
  if (unattributedCount > 25) {
    trackingAlerts.push(`${unattributedCount} leads sem identificador de clique nos últimos 7 dias`);
  }
  
  if (avgClickToFirstMsgMinutes > 20) {
    trackingAlerts.push('Tempo médio clique→WhatsApp acima de 20 minutos');
  }
  
  // Simula queda brusca (cenário crítico do produto)
  if (Math.random() > 0.7) {
    trackingAlerts.push('⚠️ Queda de 18% na taxa de atribuição vs. semana passada');
  }
  
  return {
    attributedRate: Math.round(attributedRate * 10) / 10,
    unattributedCount,
    avgClickToFirstMsgMinutes,
    trackingAlerts,
  };
}

// Gera métricas de saúde operacional (atendimento lento)
function generateOpsMetrics(): OpsMetrics {
  // Simula um cenário com gargalos no atendimento
  const firstResponseAvgMinutes = Math.round(45 + Math.random() * 90); // 45-135 min
  const unansweredCount = Math.round(8 + Math.random() * 12); // 8-20
  const staleCount = Math.round(5 + Math.random() * 15); // 5-20
  
  return {
    firstResponseAvgMinutes,
    unansweredCount,
    staleCount,
  };
}

// Gera sumário de conversões offline (com falhas)
function generateOfflineConversionSummary(): OfflineConversionSummary {
  const queued = Math.round(3 + Math.random() * 8); // 3-11 na fila
  const failed = Math.round(2 + Math.random() * 6); // 2-8 falharam
  const sentToday = Math.round(12 + Math.random() * 15); // 12-27 enviadas hoje
  
  // lastSendAt pode estar desatualizado (problema)
  const hoursSinceLastSend = Math.random() > 0.7 ? 0.5 + Math.random() * 2 : 8 + Math.random() * 18;
  const lastSendAt = subDays(new Date(), hoursSinceLastSend / 24).toISOString();
  
  return {
    queued,
    failed,
    sentToday,
    lastSendAt,
  };
}

// Calcula KPIs totais a partir das campanhas e série
function calculateKpis(campaigns: CampaignRow[], series: TimeSeriesPoint[]): { kpis: Kpis; delta: KpiDelta } {
  const spend = campaigns.reduce((sum, c) => sum + c.spend, 0);
  const clicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
  const whatsapp_started = campaigns.reduce((sum, c) => sum + c.whatsapp_started, 0);
  const qualified = campaigns.reduce((sum, c) => sum + c.qualified, 0);
  const purchases = campaigns.reduce((sum, c) => sum + c.purchases, 0);
  const revenue = campaigns.reduce((sum, c) => sum + c.revenue, 0);
  const cpc = clicks > 0 ? spend / clicks : 0;
  const roas = spend > 0 ? revenue / spend : 0;
  
  // Simula delta vs período anterior (valores "vs ontem" para demonstração)
  const deltaPercent = {
    spend: -2.3 + Math.random() * 8, // -2% a +6%
    clicks: -1.5 + Math.random() * 7,
    cpc: -3 + Math.random() * 5,
    whatsapp_started: 5 + Math.random() * 15, // +5% a +20%
    qualified: 3 + Math.random() * 10,
    purchases: 8 + Math.random() * 12, // +8% a +20%
    revenue: 10 + Math.random() * 15,
    roas: 12 + Math.random() * 18,
  };
  
  const kpis: Kpis = {
    spend: Math.round(spend),
    clicks,
    cpc: Math.round(cpc * 100) / 100,
    whatsapp_started,
    qualified,
    purchases,
    revenue: Math.round(revenue),
    roas: Math.round(roas * 100) / 100,
  };
  
  const delta: KpiDelta = {
    spend: Math.round(spend * (1 - deltaPercent.spend / 100)),
    clicks: Math.round(clicks * (1 - deltaPercent.clicks / 100)),
    cpc: Math.round((cpc * (1 - deltaPercent.cpc / 100)) * 100) / 100,
    whatsapp_started: Math.round(whatsapp_started * (1 - deltaPercent.whatsapp_started / 100)),
    qualified: Math.round(qualified * (1 - deltaPercent.qualified / 100)),
    purchases: Math.round(purchases * (1 - deltaPercent.purchases / 100)),
    revenue: Math.round(revenue * (1 - deltaPercent.revenue / 100)),
    roas: Math.round((roas * (1 - deltaPercent.roas / 100)) * 100) / 100,
    deltaPercent: {
      spend: Math.round(deltaPercent.spend * 10) / 10,
      clicks: Math.round(deltaPercent.clicks * 10) / 10,
      cpc: Math.round(deltaPercent.cpc * 10) / 10,
      whatsapp_started: Math.round(deltaPercent.whatsapp_started * 10) / 10,
      qualified: Math.round(deltaPercent.qualified * 10) / 10,
      purchases: Math.round(deltaPercent.purchases * 10) / 10,
      revenue: Math.round(deltaPercent.revenue * 10) / 10,
      roas: Math.round(deltaPercent.roas * 10) / 10,
    },
  };
  
  return { kpis, delta };
}

// Calcula métricas do funil
function calculateFunnel(campaigns: CampaignRow[]): FunnelMetrics {
  return {
    clicks: campaigns.reduce((sum, c) => sum + c.clicks, 0),
    whatsapp_started: campaigns.reduce((sum, c) => sum + c.whatsapp_started, 0),
    qualified: campaigns.reduce((sum, c) => sum + c.qualified, 0),
    purchases: campaigns.reduce((sum, c) => sum + c.purchases, 0),
  };
}

// Exporta sumário completo do dashboard
export function generateDashboardSummary(): DashboardSummary {
  const series = generateTimeSeries();
  const campaigns = generateCampaigns();
  const { kpis, delta } = calculateKpis(campaigns, series);
  const attribution = generateAttributionHealth();
  const funnel = calculateFunnel(campaigns);
  const ops = generateOpsMetrics();
  const offline = generateOfflineConversionSummary();
  
  return {
    kpis,
    delta,
    series,
    campaigns,
    attribution,
    funnel,
    ops,
    offline,
  };
}

// Fixture pronto para uso
export const fixtureDashboardGoogle = generateDashboardSummary();
