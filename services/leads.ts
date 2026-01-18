import { Lead, LeadInteraction, LeadStage } from '@/types';
import { supabase } from '@/lib/supabase/client';

// Helper to map database row to Lead type
function mapDbLeadToLead(dbLead: any): Lead {
  return {
    id: dbLead.id,
    name: dbLead.name,
    phone: dbLead.phone,
    createdAt: dbLead.created_at,
    stage: dbLead.stage as LeadStage,
    platform: dbLead.platform === 'google' ? 'google' : 'google',
    campaignId: dbLead.campaign_id,
    campaignName: dbLead.campaign_name || '',
    adsetName: dbLead.adset_name,
    creativeName: dbLead.creative_name,
    gclid: dbLead.gclid,
    fbclid: dbLead.fbclid,
    utmSource: dbLead.utm_source,
    utmCampaign: dbLead.utm_campaign,
    utmMedium: dbLead.utm_medium,
    utmContent: dbLead.utm_content,
    firstMessageAt: dbLead.first_message_at,
    lastMessageAt: dbLead.last_message_at,
    sale: dbLead.sale_value ? {
      value: dbLead.sale_value,
      currency: dbLead.sale_currency || 'BRL',
      happenedAt: dbLead.sale_happened_at,
      status: dbLead.sale_status as 'won' | 'lost',
    } : undefined,
    tenantId: dbLead.tenant_id,
  };
}

export const leadsService = {
  listLeads: async (): Promise<Lead[]> => {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching leads:', error);
      throw error;
    }

    return (data || []).map(mapDbLeadToLead);
  },

  getLeadById: async (id: string): Promise<Lead | undefined> => {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching lead:', error);
      return undefined;
    }

    return data ? mapDbLeadToLead(data) : undefined;
  },

  updateLeadStage: async (id: string, stage: LeadStage): Promise<Lead> => {
    const { data, error } = await supabase
      .from('leads')
      .update({ stage, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating lead stage:', error);
      throw error;
    }

    return mapDbLeadToLead(data);
  },

  markSale: async (id: string, value: number, happenedAt: string): Promise<Lead> => {
    const { data, error } = await supabase
      .from('leads')
      .update({
        stage: 'Vendido',
        sale_value: value,
        sale_currency: 'BRL',
        sale_happened_at: happenedAt,
        sale_status: 'won',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error marking sale:', error);
      throw error;
    }

    return mapDbLeadToLead(data);
  },

  getInteractions: async (leadId: string): Promise<LeadInteraction[]> => {
    const { data, error } = await supabase
      .from('lead_interactions')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching interactions:', error);
      return [];
    }

    return (data || []).map((row): LeadInteraction => ({
      id: row.id,
      leadId: row.lead_id,
      type: row.type as 'whatsapp' | 'call',
      direction: row.direction as 'in' | 'out',
      content: row.content,
      createdAt: row.created_at!,
      userId: row.user_id || undefined,
    }));
  }
};
