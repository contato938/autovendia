import { Campaign } from '@/types';
import { supabase } from '@/lib/supabase/client';

// Helper to map database row to Campaign type
function mapDbCampaignToCampaign(dbCampaign: any): Campaign {
  return {
    id: dbCampaign.id,
    platform: dbCampaign.platform === 'google' ? 'google' : 'google',
    name: dbCampaign.name,
    status: dbCampaign.status,
    spend: parseFloat(dbCampaign.spend) || 0,
    leads: dbCampaign.leads || 0,
    purchases: dbCampaign.purchases || 0,
    revenue: parseFloat(dbCampaign.revenue) || 0,
    roas: parseFloat(dbCampaign.roas) || 0,
    updatedAt: dbCampaign.updated_at,
  };
}

export const campaignsService = {
  listCampaigns: async (): Promise<Campaign[]> => {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .order('spend', { ascending: false });

    if (error) {
      console.error('Error fetching campaigns:', error);
      throw error;
    }

    return (data || []).map(mapDbCampaignToCampaign);
  },

  getCampaignById: async (id: string): Promise<Campaign | undefined> => {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching campaign:', error);
      return undefined;
    }

    return data ? mapDbCampaignToCampaign(data) : undefined;
  }
};
