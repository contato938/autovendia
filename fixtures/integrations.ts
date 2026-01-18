import { IntegrationStatus } from '@/types';
import { subDays } from 'date-fns';

export const fixtureIntegrations: IntegrationStatus[] = [
  {
    platform: 'google_ads',
    connected: true,
    lastSyncAt: subDays(new Date(), 0).toISOString()
  },
  {
    platform: 'whatsapp',
    connected: false,
    error: 'Aguardando autorização'
  }
];
