'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { LeadStage, Lead } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useStore } from '@/store/useStore';
import { LeadDrawer } from '@/components/leads/LeadDrawer';
import { toast } from 'sonner';
import { Calendar, GripVertical, MessageCircle, Plus, TrendingUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';

const stages: LeadStage[] = [
  'Novo',
  'Em atendimento',
  'Orçamento gerado',
  'Orçamento enviado',
  'Negociação',
  'Fechado',
  'Perdido'
];

const stageColors: Record<LeadStage, string> = {
  'Novo': '#2F6FA3',
  'Em atendimento': '#7BC043',
  'Orçamento gerado': '#6B6E73',
  'Orçamento enviado': '#2F6FA3',
  'Negociação': '#7BC043',
  'Fechado': '#2F6FA3',
  'Perdido': '#6B6E73',
};

export default function PipelinePage() {
  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: api.leads.list,
  });

  const { openLeadDrawer } = useStore();
  const queryClient = useQueryClient();

  const updateLeadMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Lead> }) =>
      api.leads.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead atualizado com sucesso!');
    },
  });

  const handleDragStart = (e: React.DragEvent, lead: Lead) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(lead));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStage: LeadStage) => {
    e.preventDefault();
    const lead = JSON.parse(e.dataTransfer.getData('text/plain')) as Lead;

    if (lead.etapa === targetStage) return;

    updateLeadMutation.mutate({
      id: lead.id,
      updates: { etapa: targetStage },
    });
  };

  // Group leads by stage
  const leadsByStage = stages.reduce((acc, stage) => {
    acc[stage] = leads.filter(lead => lead.etapa === stage);
    return acc;
  }, {} as Record<LeadStage, Lead[]>);

  if (isLoading) {
    return (
      <div className="p-6">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {stages.slice(0, 4).map(stage => (
            <Skeleton key={stage} className="h-[600px]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Pipeline
        </h1>
        <p className="text-muted-foreground">Gerencie leads com arrastar e soltar</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {stages.map((stage) => (
          <div
            key={stage}
            className="bg-muted/30 backdrop-blur-sm rounded-lg p-4 border"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 flex-1">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: stageColors[stage] }} />
                <h3 className="font-semibold text-sm truncate">
                  {stage}
                </h3>
              </div>
              <Badge variant="secondary" className="ml-2 shrink-0">
                {leadsByStage[stage]?.length || 0}
              </Badge>
            </div>

            <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-1">
              {leadsByStage[stage]?.map((lead) => (
                <Card
                  key={lead.id}
                  className="cursor-move transition-all hover:shadow-md"
                  draggable
                  onDragStart={(e) => handleDragStart(e, lead)}
                  onClick={() => openLeadDrawer(lead.id)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-sm leading-tight flex-1">
                          {lead.nome}
                        </h4>
                        <GripVertical className="w-4 h-4 text-muted-foreground cursor-move shrink-0" />
                      </div>

                      {(lead.vehicle || lead.part) && (
                        <div className="text-xs text-muted-foreground space-y-1">
                          {lead.vehicle && (
                            <div>{lead.vehicle.marca} {lead.vehicle.modelo}</div>
                          )}
                          {lead.part && (
                            <div>{lead.part.nome}</div>
                          )}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">
                          {lead.origem}
                        </Badge>
                        {lead.canal && (
                          <Badge variant="outline" className="text-xs">
                            {lead.canal}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          {lead.lastContactAt && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span className="text-xs">
                                {formatDistanceToNow(new Date(lead.lastContactAt), {
                                  locale: ptBR,
                                  addSuffix: true,
                                })}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            <span className="text-xs font-medium">{lead.score}</span>
                          </div>
                        </div>

                        <Avatar className="w-6 h-6 ring-2 ring-background">
                          <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                            {lead.nome
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {leadsByStage[stage]?.length === 0 && (
                <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
                  Nenhum lead
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <LeadDrawer />
    </div>
  );
}
