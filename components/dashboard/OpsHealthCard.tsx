import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Clock, MessageSquare } from 'lucide-react';
import type { OpsMetrics } from '@/types/googleAdsDashboard';

interface OpsHealthCardProps {
  ops: OpsMetrics;
}

export function OpsHealthCard({ ops }: OpsHealthCardProps) {
  const isHealthy = ops.firstResponseAvgMinutes < 60 && ops.unansweredCount < 10 && ops.staleCount < 10;

  return (
    <Card className={isHealthy ? '' : 'border-amber-500 border-2'}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Saúde do Atendimento</CardTitle>
          {!isHealthy && <AlertCircle className="h-5 w-5 text-amber-600" />}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">1ª Resposta</div>
            </div>
            <div className="text-2xl font-bold">{ops.firstResponseAvgMinutes}min</div>
            <div className="text-xs text-muted-foreground mt-1">
              {ops.firstResponseAvgMinutes < 60 ? 'Ótimo' : 'Lento'}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">Sem Resposta</div>
            </div>
            <div className="text-2xl font-bold">{ops.unansweredCount}</div>
            <div className="text-xs text-muted-foreground mt-1">conversas</div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">Paradas</div>
            </div>
            <div className="text-2xl font-bold">{ops.staleCount}</div>
            <div className="text-xs text-muted-foreground mt-1">há +24h</div>
          </div>
        </div>

        {!isHealthy && (
          <div className="pt-2 border-t text-sm bg-amber-50 dark:bg-amber-950/20 p-2 rounded">
            <AlertCircle className="h-4 w-4 text-amber-600 inline mr-2" />
            <span>Atendimento precisa de atenção. Verifique conversas pendentes.</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
