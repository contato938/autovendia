import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Clock, MessageSquare, CheckCircle } from 'lucide-react';
import type { OpsMetrics } from '@/types/googleAdsDashboard';
import { Progress } from '@/components/ui/progress';

interface OpsHealthCardProps {
  ops: OpsMetrics;
}

export function OpsHealthCard({ ops }: OpsHealthCardProps) {
  const isHealthy = ops.firstResponseAvgMinutes < 60 && ops.unansweredCount < 10;

  return (
    <Card className={isHealthy ? '' : 'border-amber-500 border-2'}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Saúde do Atendimento</CardTitle>
          {!isHealthy && <AlertCircle className="h-5 w-5 text-amber-600" />}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="w-4 h-4" /> Tempo de 1ª Resp.
            </span>
            <p className="text-2xl font-bold">{ops.firstResponseAvgMinutes} min</p>
          </div>
          
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <MessageSquare className="w-4 h-4" /> Sem Resposta
            </span>
            <p className="text-2xl font-bold">{ops.unansweredCount}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Taxa de Resposta</span>
              <span className="font-medium">{ops.responseRate}%</span>
            </div>
            <Progress value={ops.responseRate} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Taxa de Follow-up</span>
              <span className="font-medium">{ops.followUpRate}%</span>
            </div>
            <Progress value={ops.followUpRate} className="h-2 bg-gray-100" />
          </div>
        </div>

        {!isHealthy && (
          <div className="pt-2 border-t text-sm bg-amber-50 p-2 rounded text-amber-800 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5" />
            <span>Atenção: Existem conversas pendentes há muito tempo. Verifique a fila.</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
