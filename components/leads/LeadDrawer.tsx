'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useStore } from '@/store/useStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadsService } from '@/services/leads';
import { conversionsService } from '@/services/conversions';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Phone, MessageSquare, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LeadStage } from '@/types';
import { toast } from 'sonner';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function LeadDrawer() {
  const { selectedLeadId, isLeadDrawerOpen, closeLeadDrawer } = useStore();
  const queryClient = useQueryClient();
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [saleValue, setSaleValue] = useState('');

  const { data: lead, isLoading } = useQuery({
    queryKey: ['lead', selectedLeadId],
    queryFn: () => leadsService.getLeadById(selectedLeadId!),
    enabled: !!selectedLeadId,
  });

  const { data: interactions = [] } = useQuery({
    queryKey: ['interactions', selectedLeadId],
    queryFn: () => leadsService.getInteractions(selectedLeadId!),
    enabled: !!selectedLeadId,
  });

  const updateStageMutation = useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: LeadStage }) =>
      leadsService.updateLeadStage(id, stage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead', selectedLeadId] });
      toast.success('Etapa atualizada com sucesso!');
    },
  });

  const markSaleMutation = useMutation({
    mutationFn: ({ id, value }: { id: string; value: number }) =>
      leadsService.markSale(id, value, new Date().toISOString()),
    onSuccess: async (updatedLead) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead', selectedLeadId] });
      
      // Cria conversão offline
      if (updatedLead && updatedLead.gclid) {
        await conversionsService.sendConversion({
          leadId: updatedLead.id,
          platform: updatedLead.platform,
          eventName: 'purchase',
          value: parseFloat(saleValue),
          currency: 'BRL',
          happenedAt: new Date().toISOString()
        });
      }
      
      toast.success('Venda registrada e conversão enfileirada!');
      setShowSaleForm(false);
      setSaleValue('');
    },
  });

  const handleStageChange = (stage: LeadStage) => {
    if (selectedLeadId) {
      updateStageMutation.mutate({ id: selectedLeadId, stage });
    }
  };

  const handleMarkSale = () => {
    if (selectedLeadId && saleValue) {
      markSaleMutation.mutate({ id: selectedLeadId, value: parseFloat(saleValue) });
    }
  };

  const stages: LeadStage[] = ['Novo', 'Em conversa (WhatsApp)', 'Qualificado', 'Vendido', 'Perdido'];

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
              <SheetTitle className="text-2xl">{lead.name}</SheetTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                {lead.phone}
              </div>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              {/* Atribuição */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Atribuição</h3>
                <Card className="border-2">
                  <CardContent className="pt-6">
                    <div className="space-y-3 text-sm">
                      <div>
                        <div className="font-medium text-muted-foreground">Campanha</div>
                        <div>{lead.campaignName}</div>
                      </div>
                      {lead.adsetName && (
                        <div>
                          <div className="font-medium text-muted-foreground">Adset</div>
                          <div>{lead.adsetName}</div>
                        </div>
                      )}
                      {lead.creativeName && (
                        <div>
                          <div className="font-medium text-muted-foreground">Creative</div>
                          <div>{lead.creativeName}</div>
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-muted-foreground">Plataforma</div>
                        <Badge variant="default">Google Ads</Badge>
                      </div>
                      {lead.gclid && (
                        <div>
                          <div className="font-medium text-muted-foreground">GCLID</div>
                          <div className="font-mono text-xs">{lead.gclid}</div>
                        </div>
                      )}
                      {lead.utmSource && (
                        <div>
                          <div className="font-medium text-muted-foreground">UTMs</div>
                          <div className="text-xs">
                            Source: {lead.utmSource} • Campaign: {lead.utmCampaign}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              {/* Timeline WhatsApp */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Timeline WhatsApp</h3>
                {lead.firstMessageAt && (
                  <div className="text-sm text-muted-foreground">
                    Primeira mensagem: {format(new Date(lead.firstMessageAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </div>
                )}
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
                            <MessageSquare className="h-5 w-5 text-green-600 shrink-0" />
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-sm">
                                  {interaction.direction === 'in' ? 'Cliente' : 'Você'}
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

              <Separator />

              {/* Venda */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Venda</h3>
                {lead.sale && lead.sale.value > 0 ? (
                  <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-900">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <DollarSign className="h-8 w-8 text-green-600" />
                        <div>
                          <div className="text-2xl font-bold text-green-600">
                            R$ {lead.sale.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {format(new Date(lead.sale.happenedAt), 'dd/MM/yyyy', { locale: ptBR })}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : !showSaleForm ? (
                  <Button onClick={() => setShowSaleForm(true)} className="w-full">
                    Marcar como Vendido
                  </Button>
                ) : (
                  <Card>
                    <CardContent className="pt-6 space-y-4">
                      <div>
                        <Label htmlFor="saleValue">Valor da venda (R$)</Label>
                        <Input
                          id="saleValue"
                          type="number"
                          placeholder="0.00"
                          value={saleValue}
                          onChange={(e) => setSaleValue(e.target.value)}
                          step="0.01"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleMarkSale} className="flex-1" disabled={!saleValue || markSaleMutation.isPending}>
                          Confirmar Venda
                        </Button>
                        <Button onClick={() => { setShowSaleForm(false); setSaleValue(''); }} variant="outline">
                          Cancelar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <Separator />

              {/* Etapa Atual */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Etapa Atual</h3>
                <Select value={lead.stage} onValueChange={handleStageChange} disabled={updateStageMutation.isPending}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map(stage => (
                      <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
