import { OfflineConversion } from '@/types';
import { supabase } from '@/lib/supabase/client';

// Helper to map database row to OfflineConversion type
function mapDbConversion(dbConv: any): OfflineConversion {
  return {
    id: dbConv.id,
    leadId: dbConv.lead_id,
    platform: dbConv.platform === 'google' ? 'google' : 'google',
    eventName: dbConv.event_name,
    value: parseFloat(dbConv.value) || 0,
    currency: dbConv.currency || 'BRL',
    happenedAt: dbConv.happened_at,
    sentAt: dbConv.sent_at,
    status: dbConv.status,
    errorMessage: dbConv.error_message,
  };
}

export const conversionsService = {
  listConversions: async (): Promise<OfflineConversion[]> => {
    const { data, error } = await supabase
      .from('offline_conversions')
      .select('*')
      .order('happened_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversions:', error);
      throw error;
    }

    return (data || []).map(mapDbConversion);
  },

  retryConversion: async (id: string): Promise<OfflineConversion> => {
    const { data, error } = await supabase
      .from('offline_conversions')
      .update({
        status: 'queued',
        error_message: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error retrying conversion:', error);
      throw error;
    }

    return mapDbConversion(data);
  },

  sendConversion: async (conversion: Omit<OfflineConversion, 'id' | 'status' | 'sentAt'>): Promise<OfflineConversion> => {
    // Get tenant_id from current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: profile } = await supabase
      .from('profiles')
      .select('tenant_id')
      .eq('id', user.id)
      .single();

    if (!profile) throw new Error('Profile not found');

    const { data, error } = await supabase
      .from('offline_conversions')
      .insert({
        tenant_id: profile.tenant_id,
        lead_id: conversion.leadId,
        platform: conversion.platform,
        event_name: conversion.eventName,
        value: conversion.value,
        currency: conversion.currency,
        happened_at: conversion.happenedAt,
        status: 'queued',
      })
      .select()
      .single();

    if (error) {
      console.error('Error sending conversion:', error);
      throw error;
    }

    return mapDbConversion(data);
  }
};
