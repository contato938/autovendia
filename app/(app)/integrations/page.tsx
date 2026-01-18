'use client';

import { useQuery } from '@tanstack/react-query';
import { integrationsService } from '@/services/integrations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, XCircle, Cable } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function IntegrationsPage() {
  const { data: integrations = [], isLoading } = useQuery({
    queryKey: ['integrations'],
    queryFn: integrationsService.getStatus,
  });

  const platformNames: Record<string, string> = {
    google_ads: 'Google Ads',
    whatsapp: 'WhatsApp Business'
  };

  const platformDescriptions: Record<string, string> = {
    google_ads: 'Sincronize conversões offline e importe campanhas do Google Ads',
    whatsapp: 'Conecte sua conta WhatsApp Business para receber mensagens'
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Integrações</h1>
        <p className="text-muted-foreground">
          Conecte suas contas de anúncios e WhatsApp
        </p>
      </div>

      {/* Integration Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <>
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </>
        ) : (
          integrations.map((integration) => (
            <Card key={integration.platform} className="border-2">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      integration.connected ? 'bg-green-100 dark:bg-green-950' : 'bg-muted'
                    }`}>
                      <Cable className={`h-5 w-5 ${
                        integration.connected ? 'text-green-600' : 'text-muted-foreground'
                      }`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {platformNames[integration.platform]}
                      </CardTitle>
                    </div>
                  </div>
                  {integration.connected ? (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Conectado
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      <XCircle className="h-3 w-3 mr-1" />
                      Desconectado
                    </Badge>
                  )}
                </div>
                <CardDescription>
                  {platformDescriptions[integration.platform]}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {integration.connected ? (
                  <>
                    {integration.lastSyncAt && (
                      <div className="text-sm text-muted-foreground">
                        Última sincronização:{' '}
                        {format(new Date(integration.lastSyncAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1" size="sm">
                        Revalidar
                      </Button>
                      <Button variant="outline" className="flex-1" size="sm">
                        Desconectar
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {integration.error && (
                      <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                        {integration.error}
                      </div>
                    )}
                    <Button className="w-full" size="sm">
                      Conectar
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Como funciona?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <h4 className="font-semibold mb-2">Google Ads</h4>
            <p className="text-muted-foreground">
              Ao conectar o Google Ads, você poderá enviar conversões offline automaticamente
              e importar dados de campanhas em tempo real.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">WhatsApp Business</h4>
            <p className="text-muted-foreground">
              Conecte sua conta WhatsApp Business para receber e gerenciar mensagens
              de leads diretamente na plataforma.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
