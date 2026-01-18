import { OfflineConversion } from '@/types';
import { subDays, subHours } from 'date-fns';

export const fixtureConversions: OfflineConversion[] = [
  {
    id: 'conv1',
    leadId: 'l3',
    platform: 'google',
    eventName: 'purchase',
    value: 1250.00,
    currency: 'BRL',
    happenedAt: subDays(new Date(), 3).toISOString(),
    sentAt: subDays(new Date(), 3).toISOString(),
    status: 'sent'
  },
  {
    id: 'conv2',
    leadId: 'l2',
    platform: 'google',
    eventName: 'lead',
    value: 0,
    currency: 'BRL',
    happenedAt: subDays(new Date(), 4).toISOString(),
    sentAt: subDays(new Date(), 4).toISOString(),
    status: 'sent'
  },
  {
    id: 'conv3',
    leadId: 'l1',
    platform: 'google',
    eventName: 'lead',
    value: 0,
    currency: 'BRL',
    happenedAt: subHours(new Date(), 12).toISOString(),
    status: 'queued'
  },
  {
    id: 'conv4',
    leadId: 'l5',
    platform: 'google',
    eventName: 'purchase',
    value: 0,
    currency: 'BRL',
    happenedAt: subDays(new Date(), 10).toISOString(),
    sentAt: subDays(new Date(), 10).toISOString(),
    status: 'failed',
    errorMessage: 'Invalid gclid parameter'
  }
];
