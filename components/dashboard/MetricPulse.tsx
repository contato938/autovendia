import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface MetricPulseProps {
  label: string;
  value: string | number;
  delta?: number;
  deltaLabel?: string;
  icon?: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendReversed?: boolean; // if true, up is bad (e.g. cost)
  loading?: boolean;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export function MetricPulse({
  label,
  value,
  delta,
  deltaLabel,
  icon: Icon,
  trend, // can be explicit, or derived from delta
  trendReversed = false,
  loading = false,
  className,
  variant = 'primary',
}: MetricPulseProps) {
  if (loading) {
    return (
      <div className={cn("space-y-2", className)}>
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-4 w-16" />
      </div>
    );
  }

  // Determine trend direction and color
  const computedTrend = trend || (delta !== undefined ? (delta > 0 ? 'up' : delta < 0 ? 'down' : 'neutral') : 'neutral');
  
  const isPositive = computedTrend === 'up';
  const isNegative = computedTrend === 'down';
  
  // Logic: 
  // Normal: Up = Good (Green), Down = Bad (Red)
  // Reversed: Up = Bad (Red), Down = Good (Emerald/Green)
  
  let trendColor = 'text-slate-500';
  if (isPositive) trendColor = trendReversed ? 'text-amber-600' : 'text-emerald-600';
  if (isNegative) trendColor = trendReversed ? 'text-emerald-600' : 'text-amber-600';

  const TrendIcon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;

  return (
    <div className={cn(
      "flex flex-col group transition-all duration-300 hover:translate-x-1",
      variant === 'ghost' && "opacity-80 hover:opacity-100",
      className
    )}>
      <div className="flex items-center gap-2 text-muted-foreground mb-1">
        {Icon && <Icon className="w-4 h-4 opacity-70" />}
        <span className="text-sm font-medium uppercase tracking-wider text-xs">{label}</span>
      </div>
      
      <div className="flex items-baseline gap-3">
        <span className={cn(
          "text-3xl md:text-4xl font-bold tracking-tight text-foreground",
          // Use 'tabular-nums' to prevent layout shift on number changes if animated later
          "tabular-nums"
        )}>
          {value}
        </span>
      </div>

      {(delta !== undefined || deltaLabel) && (
        <div className={cn("flex items-center gap-1.5 mt-1 text-sm font-medium", trendColor)}>
          {delta !== undefined && <TrendIcon className="w-4 h-4" />}
          {delta !== undefined && (
            <span>{Math.abs(delta)}%</span>
          )}
          {deltaLabel && <span className="opacity-80 text-xs ml-1">{deltaLabel}</span>}
        </div>
      )}
    </div>
  );
}
