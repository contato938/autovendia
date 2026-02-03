import type { DashboardFilters, DashboardSummary } from '@/types/googleAdsDashboard';
import { supabase } from '@/lib/supabase/client';
import { logger } from '@/lib/logger';

export const dashboardGoogleService = {
  getDashboardSummary: async (filters: DashboardFilters, tenantId?: string): Promise<DashboardSummary> => {
    try {
      // Add tenant_id to filters if provided
      const filtersWithTenant = tenantId 
        ? { ...filters, tenant_id: tenantId }
        : filters;
      
      // Fetch from Supabase RPC - using correct function name
      const { data, error } = await supabase.rpc('dashboard_autovend_summary', {
        filters: filtersWithTenant as any,
      });

      if (error) {
        logger.error('[Dashboard] RPC error', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        });
        throw new Error(`Erro ao carregar dashboard: ${error.message}`);
      }

      // Validate and Adapter Pattern
      // The RPC returns a flat structure that needs to be mapped to the DashboardSummary interface
      const rawData = data as any;

      if (!rawData || !rawData.kpis) {
        logger.error('[Dashboard] Invalid RPC response structure', { data });
        throw new Error('Resposta inválida do servidor: Dados ausentes');
      }

      // Map flat RPC data to nested DashboardSummary structure
      const kpis = rawData.kpis || {};
      const delta = rawData.delta || {};
      const ops = rawData.ops || {};

      const mappedData: DashboardSummary = {
        marketing: {
          spend: { value: kpis.spend || 0, deltaPercent: delta.spend || 0 },
          impressions: { value: kpis.impressions || 0 },
          clicks: { value: kpis.clicks || 0 },
          ctr: { value: kpis.ctr || 0 },
          cpc: { value: kpis.cpc || 0 },
          cpm: { value: kpis.cpm || 0 },
          impressionShare: kpis.impressionShare || 0,
          topImpressionShare: kpis.topImpressionShare || 0,
          lostBudgetShare: kpis.lostBudgetShare || 0,
          lostRankShare: kpis.lostRankShare || 0,
        },
        sales: {
          revenue: { value: kpis.revenue || 0, deltaPercent: delta.revenue || 0 },
          roas: { value: kpis.roas || 0 },
          orders: { value: kpis.purchases || 0 },
          ticket: { value: kpis.ticket || 0 },
          cac: { value: kpis.cac || 0 },
        },
        conversion: {
          whatsapp_started: { value: kpis.whatsapp_started || 0 },
          calls: { value: kpis.calls || 0 }, // Assuming calls is in kpis or needs to be added
          call_answered_rate: ops.call_answered_rate || 0,
          click_to_whatsapp_rate: kpis.click_to_whatsapp_rate || 0,
          cost_per_conversation: kpis.cost_per_conversation || 0,
        },
        customers: {
          uniqueCustomers: 0, // Not provided by RPC yet
          newCustomersPct: 0,
          returningCustomersPct: 0,
          ltv: 0,
          ltvCacRatio: 0,
        },
        ops: {
          firstResponseAvgMinutes: ops.firstResponseAvgMinutes || 0,
          unansweredCount: ops.unansweredCount || 0,
          staleCount: ops.staleCount || 0,
          responseRate: ops.responseRate || 0,
          followUpRate: ops.followUpRate || 0,
        },
        funnel: rawData.funnel || {
          impressions: kpis.impressions || 0,
          clicks: kpis.clicks || 0,
          whatsapp_started: kpis.whatsapp_started || 0,
          qualified: kpis.qualified || 0,
          purchases: kpis.purchases || 0,
        },
        attribution: rawData.attribution || {
          attributedRate: 0,
          unattributedCount: 0,
          avgClickToFirstMsgMinutes: 0,
          trackingAlerts: []
        },
        series: rawData.series || [],
        campaigns: rawData.campaigns || [],
        alerts: rawData.alerts || [],
      };

      logger.info(`[Dashboard] Loaded and mapped successfully`, { campaignCount: mappedData.campaigns?.length || 0 });
      return mappedData;
    } catch (error: any) {
      logger.error('[Dashboard] Error fetching data', { error: error.message });
      throw error;
    }
  },
};
