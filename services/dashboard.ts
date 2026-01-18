import { MetricKpi, TimeSeriesPoint, DashboardFunnel } from '@/types';
import { http } from './http';
import { fixtureDashboardKpis, fixtureDashboardFunnel } from '@/fixtures/dashboard';
import { fixtureTimeSeries } from '@/fixtures/timeSeries';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const dashboardService = {
  getKpis: async (): Promise<MetricKpi> => {
    try {
      return await http.get<MetricKpi>('/dashboard/kpis');
    } catch (error: any) {
      if (error.message === 'NO_API_CONFIGURED') {
        await delay(500);
        return fixtureDashboardKpis;
      }
      throw error;
    }
  },

  getTimeSeries: async (): Promise<TimeSeriesPoint[]> => {
    try {
      return await http.get<TimeSeriesPoint[]>('/dashboard/timeseries');
    } catch (error: any) {
      if (error.message === 'NO_API_CONFIGURED') {
        await delay(500);
        return fixtureTimeSeries;
      }
      throw error;
    }
  },

  getFunnel: async (): Promise<DashboardFunnel> => {
    try {
      return await http.get<DashboardFunnel>('/dashboard/funnel');
    } catch (error: any) {
      if (error.message === 'NO_API_CONFIGURED') {
        await delay(400);
        return fixtureDashboardFunnel;
      }
      throw error;
    }
  }
};
