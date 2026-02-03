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
      
      // Try to fetch from Supabase RPC
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
        throw error;
      }

      // Fallback para fixtures apenas quando o banco ainda não tem dados de campanhas
      // Verificação mais robusta: se retornou algo vazio ou kpis zerados, usa fixture para desenvolvimento
      const hasRealData = data && (data as any).campaigns && (data as any).campaigns.length > 0;
      
      if (hasRealData) {
        return data as DashboardSummary;
      }

      return generateDashboardSummary();
    } catch (error) {
      // Não mascarar erro de RPC; deixar o caller (React Query) lidar com estado de erro
      throw error;
    }
  },
};
