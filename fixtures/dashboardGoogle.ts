import { subDays, format } from 'date-fns';
import type {
  DashboardSummary,
  KpiValue,
  MarketingKpis,
  ChannelKpis,
  SalesKpis,
  CustomerKpis,
  OpsMetrics,
  AlertItem,
  TimeSeriesPoint,
  CampaignRow,
  AttributionHealth,
  FunnelMetrics,
  OfflineConversionSummary,
} from '@/types/googleAdsDashboard';

// Helper: gera KpiValue com delta simulado
function kpi(value: number, deltaPercent: number): KpiValue {
  const previous = value / (1 + deltaPercent / 100);
  return {
    value,
    previousValue: previous,
    deltaPercent,
  };
}

// Gera série temporal de 30 dias
function generateTimeSeries(): TimeSeriesPoint[] {
  const series: TimeSeriesPoint[] = [];
  for (let i = 29; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const baseSpend = 1200 + Math.random() * 500;
    const whatsappRate = 0.025 + Math.random() * 0.01;
    const purchaseRate = 0.12 + Math.random() * 0.08;
    
    const whatsappStarted = Math.round(baseSpend * whatsappRate);
    const purchases = Math.round(whatsappStarted * purchaseRate);
    const revenue = purchases * (1800 + Math.random() * 800);
    
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

// Gera campanhas expandidas
function generateCampaigns(): CampaignRow[] {
  const campaignNames = [
    'Google Search - Peças Automotivas SP',
    'Google Performance Max - Auto Peças',
    'Google Display - Manutenção Veículos',
    'Google Shopping - Kit Embreagem',
    'Google Search - Freios e Suspensão',
    'Google Search - Baterias Automotivas',
    'Google Search - Institucional',
    'Google Display - Remarketing Ofertas',
  ];
  
  const campaigns: CampaignRow[] = [];
  
  for (let i = 0; i < campaignNames.length; i++) {
    const spend = 500 + Math.random() * 5000;
    const clicks = Math.round(spend / (2 + Math.random() * 3));
    const cpc = spend / clicks;
    const ctr = 2 + Math.random() * 8; // 2-10%
    
    const whatsappStarted = Math.round(clicks * (0.05 + Math.random() * 0.05));
    const qualified = Math.round(whatsappStarted * 0.7);
    const purchases = Math.round(qualified * 0.3);
    const revenue = purchases * (1200 + Math.random() * 2000);
    const roas = spend > 0 ? revenue / spend : 0;
    
    // Novos campos
    const cac = purchases > 0 ? spend / purchases : 0;
    
    // Label logic simples
    let label: CampaignRow['label'] = 'manter';
    if (roas > 5) label = 'escalar';
    if (roas < 2) label = 'ajustar';
    if (spend > 1000 && purchases === 0) label = 'pausar';
    
    campaigns.push({
      id: `gc${i + 1}`,
      name: campaignNames[i],
      status: 'active',
      spend: Math.round(spend),
      clicks,
      cpc: Number(cpc.toFixed(2)),
      ctr: Number(ctr.toFixed(1)),
      whatsapp_started: whatsappStarted,
      qualified,
      purchases,
      revenue: Math.round(revenue),
      roas: Number(roas.toFixed(2)),
      // Novos
      revenueSharePct: 0, // calculado depois
      cac: Math.round(cac),
      ltv: Math.round(revenue * 1.5), // estimado
      label,
    });
  }
  
  // Calcular revenue share
  const totalRev = campaigns.reduce((acc, c) => acc + c.revenue, 0);
  campaigns.forEach(c => {
    c.revenueSharePct = totalRev > 0 ? Number(((c.revenue / totalRev) * 100).toFixed(1)) : 0;
  });
  
  return campaigns.sort((a, b) => b.spend - a.spend);
}

// Gera Alerts
function generateAlerts(): AlertItem[] {
  return [
    { id: '1', severity: 'critical', title: 'ROAS da campanha "Freios" abaixo da meta', detail: 'Atual: 1.8 | Meta: 3.0', metric: 'roas' },
    { id: '2', severity: 'warning', title: 'CTR caiu 20% na campanha institucional', metric: 'ctr' },
    { id: '3', severity: 'info', title: 'Oportunidade: Campanha "Peças" com ROAS 8.5', detail: 'Sugerido: Aumentar orçamento em 20%', metric: 'roas' },
    { id: '4', severity: 'success', title: 'Meta de leads batida na semana', detail: '145 leads (Meta: 120)', metric: 'leads' },
  ];
}

// Exporta sumário completo
export function generateDashboardSummary(): DashboardSummary {
  const series = generateTimeSeries();
  const campaigns = generateCampaigns();
  const alerts = generateAlerts();
  
  // Agregados simples para exemplo
  const totalSpend = campaigns.reduce((acc, c) => acc + c.spend, 0);
  const totalRev = campaigns.reduce((acc, c) => acc + c.revenue, 0);
  
  return {
    marketing: {
      spend: kpi(totalSpend, 12.5),
      impressions: kpi(totalSpend * 100, 5.2), // pseudo
      clicks: kpi(totalSpend / 3.5, 8.1),
      ctr: kpi(4.2, -2.1),
      cpc: kpi(3.50, 1.5),
      cpm: kpi(15.20, 0.5),
      impressionShare: 65,
      topImpressionShare: 45,
      lostBudgetShare: 20,
      lostRankShare: 15,
    },
    conversion: {
      whatsapp_started: kpi(450, 15),
      calls: kpi(120, -5),
      call_answered_rate: 68,
      click_to_whatsapp_rate: 3.5,
      cost_per_conversation: 12.50,
    },
    sales: {
      orders: kpi(85, 20),
      revenue: kpi(totalRev, 25),
      ticket: kpi(totalRev / 85, 5),
      cac: kpi(totalSpend / 85, -8),
      roas: kpi(totalRev / totalSpend, 10),
      margin: 35, // %
    },
    customers: {
      uniqueCustomers: 78,
      newCustomersPct: 65,
      returningCustomersPct: 35,
      ltv: 3500,
      ltvCacRatio: 4.5,
      avgDaysBetweenPurchases: 45,
    },
    ops: {
      firstResponseAvgMinutes: 12,
      unansweredCount: 5,
      staleCount: 8,
      responseRate: 98,
      followUpRate: 65,
    },
    funnel: {
      impressions: 45000,
      clicks: 1250,
      whatsapp_started: 450,
      qualified: 280,
      proposals: 150,
      purchases: 85,
    },
    attribution: {
      attributedRate: 88.5,
      unattributedCount: 12,
      avgClickToFirstMsgMinutes: 8,
      trackingAlerts: [],
    },
    offline: {
      queued: 5,
      failed: 1,
      sentToday: 15,
    },
    series,
    campaigns,
    alerts,
  };
}

export const fixtureDashboardGoogle = generateDashboardSummary();
