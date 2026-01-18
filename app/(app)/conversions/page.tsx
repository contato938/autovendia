'use client';

import { useQuery } from '@tanstack/react-query';
import { conversionsService } from '@/services/conversions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { RefreshCw, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function ConversionsPage() {
  const queryClient = useQueryClient();

  const { data: conversions = [], isLoading } = useQuery({
    queryKey: ['conversions'],
    queryFn: conversionsService.listConversions,
  });

  const retryMutation = useMutation({
    mutationFn: (id: string) => conversionsService.retryConversion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversions'] });
      toast.success('Conversão reenviada para fila!');
    },
    onError: () => {
      toast.error('Erro ao reenviar conversão');
    }
  });

  // Stats
  const today = new Date().toISOString().split('T')[0];
  const conversionsToday = conversions.filter(c => c.happenedAt.startsWith(today)).length;
  const failed = conversions.filter(c => c.status === 'failed').length;
  const queued = conversions.filter(c => c.status === 'queued').length;
  const failureRate = conversions.length > 0 ? ((failed / conversions.length) * 100).toFixed(1) : '0';

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Conversões Offline</h1>
        <p className="text-muted-foreground">
          Envio de conversões para Google Ads
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Conversões Hoje
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionsToday}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taxa de Falha
            </CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{failureRate}%</div>
            <p className="text-xs text-muted-foreground">
              {failed} de {conversions.length} falharam
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Fila Pendente
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{queued}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando envio
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Conversões</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : conversions.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              Nenhuma conversão registrada
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lead ID</TableHead>
                  <TableHead>Evento</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead>Aconteceu em</TableHead>
                  <TableHead>Enviado em</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {conversions.map((conversion) => (
                  <TableRow key={conversion.id}>
                    <TableCell className="font-mono text-xs">{conversion.leadId}</TableCell>
                    <TableCell>{conversion.eventName}</TableCell>
                    <TableCell className="text-right">
                      {conversion.value > 0 ? 
                        `R$ ${conversion.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 
                        '-'
                      }
                    </TableCell>
                    <TableCell className="text-sm">
                      {format(new Date(conversion.happenedAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </TableCell>
                    <TableCell className="text-sm">
                      {conversion.sentAt ? 
                        format(new Date(conversion.sentAt), 'dd/MM/yyyy HH:mm', { locale: ptBR }) : 
                        '-'
                      }
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          conversion.status === 'sent' ? 'default' : 
                          conversion.status === 'failed' ? 'destructive' : 
                          'outline'
                        }
                      >
                        {conversion.status === 'sent' ? 'Enviado' : 
                         conversion.status === 'failed' ? 'Falhou' : 
                         'Na fila'}
                      </Badge>
                      {conversion.errorMessage && (
                        <div className="text-xs text-destructive mt-1">
                          {conversion.errorMessage}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {conversion.status === 'failed' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => retryMutation.mutate(conversion.id)}
                          disabled={retryMutation.isPending}
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Retry
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
