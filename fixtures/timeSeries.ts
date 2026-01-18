import { TimeSeriesPoint } from '@/types';
import { subDays, format } from 'date-fns';

export const fixtureTimeSeries: TimeSeriesPoint[] = Array.from({ length: 30 }).map((_, i) => {
  const date = subDays(new Date(), 29 - i);
  const base = 1200 + Math.random() * 400;
  
  return {
    date: format(date, 'yyyy-MM-dd'),
    spend: Math.round(base + Math.random() * 300),
    leads: Math.round((base / 100) + Math.random() * 5),
    purchases: Math.round((base / 800) + Math.random() * 2),
    revenue: Math.round((base * 3.5) + Math.random() * 1000)
  };
});
