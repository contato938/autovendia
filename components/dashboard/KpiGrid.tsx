import { KPICard } from './KPICard';
import { LucideIcon } from 'lucide-react';
import type { KpiValue } from '@/types/googleAdsDashboard';

export interface KpiItemConfig {
  title: string;
  value: number | string;
  icon: LucideIcon;
  kpiValue?: KpiValue; // Se passar o objeto completo KpiValue, usa o delta dele
  deltaPercent?: number; // Ou passa direto o delta
  format?: 'currency' | 'number' | 'percent' | 'decimal';
  trendReversed?: boolean; // Se true, queda é bom (ex: CPC, custo)
}

interface KpiGridProps {
  title?: string;
  items: KpiItemConfig[];
  columns?: 2 | 3 | 4 | 5 | 6;
}

export function KpiGrid({ title, items, columns = 4 }: KpiGridProps) {
  const formatValue = (val: number | string, fmt: string | undefined) => {
    if (typeof val === 'string') return val;
    if (fmt === 'currency') return `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    if (fmt === 'percent') return `${val.toFixed(1)}%`;
    if (fmt === 'decimal') return val.toFixed(2);
    return val.toLocaleString('pt-BR');
  };

  const formatTrend = (value: number | undefined) => {
    if (value === undefined || value === null) return undefined;
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const getColsClass = (cols: number) => {
    switch(cols) {
      case 2: return 'md:grid-cols-2';
      case 3: return 'md:grid-cols-2 lg:grid-cols-3';
      case 4: return 'md:grid-cols-2 lg:grid-cols-4';
      case 5: return 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5';
      case 6: return 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6';
      default: return 'md:grid-cols-2 lg:grid-cols-4';
    }
  };

  return (
    <div className="space-y-4">
      {title && <h3 className="text-lg font-medium tracking-tight text-gray-900">{title}</h3>}
      <div className={`grid gap-4 ${getColsClass(columns)}`}>
        {items.map((item, index) => {
          const delta = item.kpiValue?.deltaPercent ?? item.deltaPercent;
          const displayValue = item.kpiValue?.value ?? item.value;
          
          // Lógica de trendUp:
          // Se trendReversed is true: delta < 0 is GOOD (green)
          // Se trendReversed is false: delta > 0 is GOOD (green)
          // KPICard geralmente usa trendUp=true para verde.
          // Então se trendReversed, trendUp = delta < 0
          
          let trendUp = delta !== undefined ? delta >= 0 : undefined;
          
          if (item.trendReversed && delta !== undefined) {
             trendUp = delta <= 0;
          }

          return (
            <KPICard
              key={index}
              title={item.title}
              value={formatValue(displayValue, item.format)}
              icon={item.icon}
              trend={formatTrend(delta)}
              trendUp={trendUp}
            />
          );
        })}
      </div>
    </div>
  );
}
