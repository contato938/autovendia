import type { DashboardFilters, DashboardSummary } from '@/types/googleAdsDashboard';
import { supabase } from '@/lib/supabase/client';
import { generateDashboardSummary } from '@/fixtures/dashboardGoogle';

export const dashboardGoogleService = {
  getDashboardSummary: async (filters: DashboardFilters): Promise<DashboardSummary> => {
    try {
      // Try to fetch from Supabase RPC
      const { data, error } = await supabase.rpc('dashboard_google_summary', {
        filters: filters as any,
      });

      if (error) {
        console.warn('Dashboard RPC error, falling back to fixtures:', error);
        return generateDashboardSummary();
      }

      // Check if we have real data (campaigns array has items)
      if (data && data.campaigns && Array.isArray(data.campaigns) && data.campaigns.length > 0) {
        return data as DashboardSummary;
      }

      // No data yet, use fixtures
      console.log('No campaign data yet, using fixtures');
      return generateDashboardSummary();
    } catch (error) {
      console.warn('Dashboard fetch error, falling back to fixtures:', error);
      return generateDashboardSummary();
    }
  },
};
