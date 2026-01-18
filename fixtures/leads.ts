import { Lead, LeadInteraction } from '@/types';
import { subDays, subHours } from 'date-fns';

const stages = ['Novo', 'Em conversa (WhatsApp)', 'Qualificado', 'Vendido', 'Perdido'] as const;

export const fixtureLeads: Lead[] = [
  {
    id: 'l1',
    name: 'João Silva',
    phone: '(11) 98765-4321',
    createdAt: subDays(new Date(), 2).toISOString(),
    stage: 'Em conversa (WhatsApp)',
    platform: 'google',
    campaignId: 'c1',
    campaignName: 'Campanha Google - Peças Automotivas',
    adsetName: 'Adset Freios SP',
    creativeName: 'Creative Pastilhas',
    gclid: 'Cj0KCQjw...',
    utmSource: 'google',
    utmCampaign: 'pecas_automotivas',
    utmMedium: 'cpc',
    firstMessageAt: subHours(new Date(), 12).toISOString(),
    lastMessageAt: subHours(new Date(), 2).toISOString(),
    tenantId: 't1'
  },
  {
    id: 'l2',
    name: 'Maria Santos',
    phone: '(11) 97654-3210',
    createdAt: subDays(new Date(), 5).toISOString(),
    stage: 'Qualificado',
    platform: 'google',
    campaignId: 'c2',
    campaignName: 'Google Ads - Promoção de Freios',
    adsetName: 'Adset São Paulo 25-45',
    creativeName: 'Video Freios',
    gclid: 'Cj0KCQjw2x...',
    utmSource: 'google',
    utmCampaign: 'promo_freios',
    utmMedium: 'cpc',
    firstMessageAt: subDays(new Date(), 4).toISOString(),
    lastMessageAt: subDays(new Date(), 1).toISOString(),
    tenantId: 't1'
  },
  {
    id: 'l3',
    name: 'Pedro Costa',
    phone: '(11) 96543-2109',
    createdAt: subDays(new Date(), 8).toISOString(),
    stage: 'Vendido',
    platform: 'google',
    campaignId: 'c3',
    campaignName: 'Google Search - Amortecedores',
    gclid: 'Cj0KCQjy...',
    utmSource: 'google',
    utmCampaign: 'amortecedores',
    firstMessageAt: subDays(new Date(), 7).toISOString(),
    lastMessageAt: subDays(new Date(), 3).toISOString(),
    sale: {
      value: 1250.00,
      currency: 'BRL',
      happenedAt: subDays(new Date(), 3).toISOString(),
      status: 'won'
    },
    tenantId: 't1'
  },
  {
    id: 'l4',
    name: 'Ana Oliveira',
    phone: '(11) 95432-1098',
    createdAt: subDays(new Date(), 1).toISOString(),
    stage: 'Novo',
    platform: 'google',
    campaignId: 'c2',
    campaignName: 'Google Ads - Promoção de Freios',
    gclid: 'Cj0KCQjw3z...',
    utmSource: 'google',
    utmCampaign: 'promo_freios',
    tenantId: 't1'
  },
  {
    id: 'l5',
    name: 'Carlos Lima',
    phone: '(11) 94321-0987',
    createdAt: subDays(new Date(), 12).toISOString(),
    stage: 'Perdido',
    platform: 'google',
    campaignId: 'c1',
    campaignName: 'Campanha Google - Peças Automotivas',
    gclid: 'Cj0KCQjz...',
    utmSource: 'google',
    utmCampaign: 'pecas_automotivas',
    firstMessageAt: subDays(new Date(), 11).toISOString(),
    lastMessageAt: subDays(new Date(), 10).toISOString(),
    sale: {
      value: 0,
      currency: 'BRL',
      happenedAt: subDays(new Date(), 10).toISOString(),
      status: 'lost'
    },
    tenantId: 't1'
  }
];

// Mapeamento de campanhas (duplicado localmente para evitar import circular)
const campaignNames: Record<string, string> = {
  'c1': 'Campanha Google - Peças Automotivas',
  'c2': 'Google Ads - Promoção de Freios',
  'c3': 'Google Search - Amortecedores',
  'c4': 'Google Display - Filtros e Óleos',
  'c5': 'Google Shopping - Kit Embreagem'
};

// Gerando mais 30 leads variados
for (let i = 6; i <= 35; i++) {
  const daysAgo = Math.floor(Math.random() * 30);
  const stage = stages[Math.floor(Math.random() * stages.length)];
  const platform = 'google';
  const campaignIds = ['c1', 'c2', 'c3', 'c4', 'c5'];
  const campaignId = campaignIds[Math.floor(Math.random() * campaignIds.length)];
  const campaignName = campaignNames[campaignId] || 'Campanha';
  
  fixtureLeads.push({
    id: `l${i}`,
    name: `Cliente ${i}`,
    phone: `(11) 9${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
    createdAt: subDays(new Date(), daysAgo).toISOString(),
    stage,
    platform,
    campaignId,
    campaignName,
    gclid: `Cj0KCQjw${i}...`,
    utmSource: 'google',
    utmCampaign: campaignName.toLowerCase().replace(/ /g, '_'),
    firstMessageAt: stage !== 'Novo' ? subDays(new Date(), daysAgo - 1).toISOString() : undefined,
    lastMessageAt: stage !== 'Novo' ? subHours(new Date(), Math.floor(Math.random() * 48)).toISOString() : undefined,
    sale: stage === 'Vendido' ? {
      value: Math.round(800 + Math.random() * 2000),
      currency: 'BRL',
      happenedAt: subDays(new Date(), Math.floor(daysAgo / 2)).toISOString(),
      status: 'won'
    } : undefined,
    tenantId: 't1'
  });
}

export const fixtureLeadInteractions: Record<string, LeadInteraction[]> = {
  l1: [
    {
      id: 'i1',
      leadId: 'l1',
      type: 'whatsapp',
      direction: 'in',
      content: 'Boa tarde! Vi o anúncio de vocês sobre pastilhas de freio. Quanto custa?',
      createdAt: subHours(new Date(), 12).toISOString()
    },
    {
      id: 'i2',
      leadId: 'l1',
      type: 'whatsapp',
      direction: 'out',
      content: 'Olá João! Temos pastilhas de várias marcas. Qual o modelo do seu carro?',
      createdAt: subHours(new Date(), 11).toISOString()
    },
    {
      id: 'i3',
      leadId: 'l1',
      type: 'whatsapp',
      direction: 'in',
      content: 'É um Gol G6 2015',
      createdAt: subHours(new Date(), 2).toISOString()
    }
  ],
  l2: [
    {
      id: 'i4',
      leadId: 'l2',
      type: 'whatsapp',
      direction: 'in',
      content: 'Olá, preciso de orçamento para troca completa de freios',
      createdAt: subDays(new Date(), 4).toISOString()
    }
  ]
};
