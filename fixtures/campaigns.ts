import { Campaign } from '@/types';
import { subDays } from 'date-fns';

export const fixtureCampaigns: Campaign[] = [
  {
    id: 'c1',
    platform: 'google',
    name: 'Campanha Google - Peças Automotivas',
    status: 'active',
    spend: 18500.00,
    leads: 142,
    purchases: 21,
    revenue: 76300.00,
    roas: 4.12,
    updatedAt: subDays(new Date(), 0).toISOString()
  },
  {
    id: 'c2',
    platform: 'google',
    name: 'Google Ads - Promoção de Freios',
    status: 'active',
    spend: 12300.50,
    leads: 98,
    purchases: 14,
    revenue: 52100.00,
    roas: 4.24,
    updatedAt: subDays(new Date(), 1).toISOString()
  },
  {
    id: 'c3',
    platform: 'google',
    name: 'Google Search - Amortecedores',
    status: 'active',
    spend: 8400.00,
    leads: 87,
    purchases: 12,
    revenue: 38200.00,
    roas: 4.55,
    updatedAt: subDays(new Date(), 2).toISOString()
  },
  {
    id: 'c4',
    platform: 'google',
    name: 'Google Display - Filtros e Óleos',
    status: 'paused',
    spend: 6030.00,
    leads: 60,
    purchases: 5,
    revenue: 20850.00,
    roas: 3.46,
    updatedAt: subDays(new Date(), 5).toISOString()
  },
  {
    id: 'c5',
    platform: 'google',
    name: 'Google Shopping - Kit Embreagem',
    status: 'active',
    spend: 0,
    leads: 0,
    purchases: 0,
    revenue: 0,
    roas: 0,
    updatedAt: subDays(new Date(), 7).toISOString()
  }
];
