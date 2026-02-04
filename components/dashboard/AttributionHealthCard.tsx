import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import type { AttributionHealth } from '@/types/googleAdsDashboard';

interface AttributionHealthCardProps {
  attribution: AttributionHealth;
}

export function AttributionHealthCard({ attribution }: AttributionHealthCardProps) {
  // Safe defaults
  const attributedRate = attribution?.attributedRate ?? 0;
  const unattributedCount = attribution?.unattributedCount ?? 0;
  const avgClickToFirstMsgMinutes = attribution?.avgClickToFirstMsgMinutes ?? 0;
  const trackingAlerts = attribution?.trackingAlerts ?? [];

  const isHealthy = attributedRate >= 85 && trackingAlerts.length === 0;

  return (
    <Card className={isHealthy ? '' : 'border-amber-500 border-2'}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Saúde da Atribuição</CardTitle>
          {isHealthy ? (
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Taxa de Atribuição</div>
            <div className="text-2xl font-bold">{attributedRate}%</div>
            <div className="text-xs text-muted-foreground mt-1">
              {attributedRate >= 85 ? 'Ótimo' : 'Atenção'}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Sem Atribuição</div>
            <div className="text-2xl font-bold">{unattributedCount}</div>
            <div className="text-xs text-muted-foreground mt-1">leads sem gclid</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Tempo Médio</div>
            <div className="text-2xl font-bold flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {avgClickToFirstMsgMinutes}min
            </div>
            <div className="text-xs text-muted-foreground mt-1">clique → WhatsApp</div>
          </div>
        </div>

        {trackingAlerts.length > 0 && (
          <div className="space-y-2 pt-2 border-t">
            <div className="text-sm font-semibold">Alertas</div>
            {trackingAlerts.map((alert, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm bg-amber-50 dark:bg-amber-950/20 p-2 rounded">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{alert}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
