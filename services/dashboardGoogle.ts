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
        filters: filtersWithTenant,
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

      // Validate the response has the expected structure
      if (!data || !data.marketing || !data.sales) {
        logger.error('[Dashboard] Invalid RPC response structure', { data });
        throw new Error('Resposta inválida do servidor');
      }

      logger.info(`[Dashboard] Loaded successfully`, { campaignCount: data.campaigns?.length || 0 });
      return data as DashboardSummary;
    } catch (error: any) {
      logger.error('[Dashboard] Error fetching data', { error: error.message });
      throw error;
    }
  },
};
