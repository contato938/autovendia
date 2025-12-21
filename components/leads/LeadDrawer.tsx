'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useStore } from '@/store/useStore';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Phone, MessageSquare, Car, Package, MapPin, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';

export function LeadDrawer() {
  const { selectedLeadId, isLeadDrawerOpen, closeLeadDrawer } = useStore();

  const { data: lead, isLoading } = useQuery({
    queryKey: ['lead', selectedLeadId],
    queryFn: () => api.leads.getById(selectedLeadId!),
    enabled: !!selectedLeadId,
  });

  const { data: interactions = [] } = useQuery({
    queryKey: ['interactions', selectedLeadId],
    queryFn: () => api.leads.getInteractions(selectedLeadId!),
    enabled: !!selectedLeadId,
  });

  if (!selectedLeadId) return null;

  return (
    <Sheet open={isLeadDrawerOpen} onOpenChange={closeLeadDrawer}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        {isLoading || !lead ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : (
          <>
            <SheetHeader>
              <SheetTitle className="text-2xl">{lead.nome}</SheetTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                {lead.telefone}
              </div>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              {/* Summary Cards - Reduced shadows */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="border-2">
                  <CardContent className="pt-6 pb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <TrendingUp className="h-4 w-4" />
                      Score
                    </div>
                    <div className="text-3xl font-bold">{lead.score}</div>
                  </CardContent>
                </Card>
                <Card className="border-2">
                  <CardContent className="pt-6 pb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <MessageSquare className="h-4 w-4" />
                      Canal
                    </div>
                    <div className="text-3xl font-bold">{lead.canal}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Lead Info - Better icon alignment */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Informações</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="flex-1">
                      <div className="font-medium">Origem</div>
                      <div className="text-muted-foreground">{lead.origem} {lead.campanha && `• ${lead.campanha}`}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Car className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="flex-1">
                      <div className="font-medium">Veículo</div>
                      <div className="text-muted-foreground">
                        {lead.vehicle?.marca} {lead.vehicle?.modelo} {lead.vehicle?.ano}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Package className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="flex-1">
                      <div className="font-medium">Peça</div>
                      <div className="text-muted-foreground">
                        {lead.part?.nome} • {lead.part?.sku}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{lead.part?.compatibilidadeResumo}</div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Stage - Better spacing */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Etapa Atual</h3>
                <Badge className="text-sm px-3 py-1">{lead.etapa}</Badge>
              </div>

              <Separator className="my-6" />

              {/* Timeline - Better spacing */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Histórico de Interações</h3>
                {interactions.length === 0 ? (
                  <div className="text-sm text-muted-foreground text-center py-8 bg-muted/30 rounded-lg">
                    Nenhuma interação registrada
                  </div>
                ) : (
                  <div className="space-y-3">
                    {interactions.map((interaction) => (
                      <Card key={interaction.id} className="border">
                        <CardContent className="pt-4 pb-4">
                          <div className="flex items-start gap-3">
                            {interaction.type === 'whatsapp' ? (
                              <MessageSquare className="h-5 w-5 text-green-600 shrink-0" />
                            ) : (
                              <Phone className="h-5 w-5 text-blue-600 shrink-0" />
                            )}
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-sm">
                                  {interaction.type === 'whatsapp' ? 'WhatsApp' : 'Ligação'}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {format(new Date(interaction.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">{interaction.content}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              <Separator className="my-6" />

              {/* AI Summary - Better styling */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Resumo da IA</h3>
                <Card className="bg-accent/30 border-accent">
                  <CardContent className="pt-4 pb-4">
                    <p className="text-sm leading-relaxed">
                      Lead qualificado buscando {lead.part?.nome} para {lead.vehicle?.marca} {lead.vehicle?.modelo}.
                      Origem: {lead.origem}. Próximos passos recomendados:
                    </p>
                    <ul className="mt-3 space-y-1.5 text-sm list-disc list-inside text-muted-foreground">
                      <li>Enviar orçamento detalhado</li>
                      <li>Confirmar compatibilidade da peça</li>
                      <li>Agendar retorno em 24h</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button className="flex-1" size="sm">
                  Gerar Orçamento
                </Button>
                <Button variant="outline" className="flex-1" size="sm">
                  Mover Etapa
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
