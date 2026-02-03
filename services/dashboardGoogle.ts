import type { DashboardFilters, DashboardSummary } from '@/types/googleAdsDashboard';
import { supabase } from '@/lib/supabase/client';
import { generateDashboardSummary } from '@/fixtures/dashboardGoogle';

export const dashboardGoogleService = {
  getDashboardSummary: async (filters: DashboardFilters, tenantId?: string): Promise<DashboardSummary> => {
    try {
      // Add tenant_id to filters if provided
      const filtersWithTenant = tenantId 
        ? { ...filters, tenant_id: tenantId }
        : filters;
      
      // Fetch from Supabase RPC - now returns correct DashboardSummary structure
      const { data, error } = await supabase.rpc('dashboard_google_summary', {
        filters: filtersWithTenant as any,
      });

      if (error) {
        console.error('Dashboard RPC error:', {
          code: (error as any).code,
          message: (error as any).message,
          details: (error as any).details,
          hint: (error as any).hint,
        });
        // Fallback to fixtures on RPC error
        return generateDashboardSummary();
      }

      // Validate the response has the expected structure
      if (data && data.marketing && data.sales && data.campaigns) {
        console.log(`[Dashboard] Using real data (${data.campaigns.length} campaigns)`);
        return data as DashboardSummary;
      }

      // Fallback to fixtures if RPC returned empty/invalid data
      console.log('[Dashboard] RPC returned incomplete data, using fixtures');
      return generateDashboardSummary();
    } catch (error) {
      console.error('[Dashboard] Error fetching data:', error);
      // Fallback to fixtures on any error
      return generateDashboardSummary();
    }
  },
};
