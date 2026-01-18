import { IntegrationStatus } from '@/types';
import { supabase } from '@/lib/supabase/client';

export const integrationsService = {
  getStatus: async (): Promise<IntegrationStatus[]> => {
    const { data, error } = await supabase
      .from('integrations')
      .select('*')
      .order('platform');

    if (error) {
      console.error('Error fetching integrations:', error);
      throw error;
    }

    return (data || []).map((row): IntegrationStatus => ({
      platform: row.platform as 'google_ads' | 'meta_ads' | 'whatsapp',
      connected: row.connected || false,
      lastSyncAt: row.last_sync_at || undefined,
      error: row.error || undefined,
    }));
  },

  startOAuth: async (platform: string): Promise<{ authUrl: string }> => {
    // OAuth flow is still a stub - would need backend implementation
    return { authUrl: '#' };
  }
};
