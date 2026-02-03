import { MetricKpi, TimeSeriesPoint, DashboardFunnel } from '@/types';
import { http } from './http';

export const dashboardService = {
  getKpis: async (): Promise<MetricKpi> => {
    return await http.get<MetricKpi>('/dashboard/kpis');
  },

  getTimeSeries: async (): Promise<TimeSeriesPoint[]> => {
    return await http.get<TimeSeriesPoint[]>('/dashboard/timeseries');
  },

  getFunnel: async (): Promise<DashboardFunnel> => {
    return await http.get<DashboardFunnel>('/dashboard/funnel');
  }
};
