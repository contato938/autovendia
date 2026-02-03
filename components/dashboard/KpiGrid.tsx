import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import type { KpiValue } from '@/types/googleAdsDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
  variant?: 'default' | 'minimal';
}

export function KpiGrid({ title, items, columns = 4, variant = 'default' }: KpiGridProps) {
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
          
          let trendUp = delta !== undefined ? delta >= 0 : undefined;
          
          if (item.trendReversed && delta !== undefined) {
             trendUp = delta <= 0;
          }

          const Icon = item.icon;
          const trend = formatTrend(delta);

          if (variant === 'minimal') {
            return (
              <div key={index} className="flex flex-col p-4 transition-colors hover:bg-muted/50 rounded-sm border-l-2 border-transparent hover:border-slate-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">{item.title}</span>
                  <Icon className="h-4 w-4 text-muted-foreground/50" />
                </div>
                <div className="text-2xl font-bold tracking-tight">{formatValue(displayValue, item.format)}</div>
                {trend !== undefined && (
                  <div className={`text-xs flex items-center gap-1 mt-1 ${
                    trendUp ? 'text-emerald-600' : 'text-amber-600'
                  }`}>
                    {trendUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    <span>{trend}</span>
                  </div>
                )}
              </div>
            );
          }

          return (
            <Card key={index} className="rounded-sm border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  {item.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-slate-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{formatValue(displayValue, item.format)}</div>
                {trend !== undefined && (
                  <p className={`text-xs flex items-center gap-1 ${
                    trendUp ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {trendUp ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span>{trend}</span>
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
