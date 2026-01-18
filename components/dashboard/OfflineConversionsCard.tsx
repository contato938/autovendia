import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Clock, ExternalLink } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import type { OfflineConversionSummary } from '@/types/googleAdsDashboard';

interface OfflineConversionsCardProps {
  offline: OfflineConversionSummary;
}

export function OfflineConversionsCard({ offline }: OfflineConversionsCardProps) {
  const router = useRouter();
  const hasIssues = offline.failed > 0 || offline.queued > 5;

  return (
    <Card className={hasIssues ? 'border-red-500 border-2' : ''}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Conversões Offline Google Ads</CardTitle>
          {hasIssues && <XCircle className="h-5 w-5 text-red-600" />}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">Na Fila</div>
            </div>
            <div className="text-2xl font-bold">{offline.queued}</div>
            {offline.queued > 5 && (
              <Badge variant="outline" className="mt-1">Alta fila</Badge>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <XCircle className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">Falhas</div>
            </div>
            <div className="text-2xl font-bold text-red-600">{offline.failed}</div>
            {offline.failed > 0 && (
              <Badge variant="destructive" className="mt-1">Requer ação</Badge>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">Enviadas Hoje</div>
            </div>
            <div className="text-2xl font-bold text-green-600">{offline.sentToday}</div>
          </div>
        </div>

        {offline.lastSendAt && (
          <div className="text-xs text-muted-foreground pt-2 border-t">
            Último envio: {format(parseISO(offline.lastSendAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
          </div>
        )}

        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => router.push('/conversions')}
        >
          Ver Fila de Conversões
          <ExternalLink className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}
