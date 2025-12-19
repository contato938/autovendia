'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { LeadStage, Lead } from '@/types';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/store/useStore';
import { LeadDrawer } from '@/components/leads/LeadDrawer';
import { toast } from 'sonner';
import { Clock, TrendingUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  'Novo': 'bg-blue-500',
  'Em atendimento': 'bg-yellow-500',
  'Orçamento gerado': 'bg-purple-500',
  'Orçamento enviado': 'bg-orange-500',
  'Negociação': 'bg-pink-500',
  'Fechado': 'bg-green-500',
  'Perdido': 'bg-red-500',
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

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const newStage = destination.droppableId as LeadStage;
    updateLeadMutation.mutate({
      id: draggableId,
      updates: { etapa: newStage },
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
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {stages.map(stage => (
            <Skeleton key={stage} className="h-[600px]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pipeline</h1>
        <p className="text-muted-foreground">
          Visualize e gerencie leads por etapa
        </p>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 pb-4">
          {stages.map((stage) => (
            <div key={stage} className="flex flex-col min-w-[280px]">
              <div className="mb-3 flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${stageColors[stage]}`} />
                <h3 className="font-semibold text-sm">{stage}</h3>
                <Badge variant="secondary" className="ml-auto">
                  {leadsByStage[stage]?.length || 0}
                </Badge>
              </div>

              <Droppable droppableId={stage}>
                {(provided, snapshot) => (
                  <ScrollArea
                    className={`flex-1 rounded-lg border-2 border-dashed p-2 transition-colors ${
                      snapshot.isDraggingOver ? 'border-primary bg-accent/50' : 'border-border bg-muted/20'
                    }`}
                    style={{ minHeight: '500px', maxHeight: '70vh' }}
                  >
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="space-y-2 min-h-full"
                    >
                      {leadsByStage[stage]?.map((lead, index) => (
                        <Draggable key={lead.id} draggableId={lead.id} index={index}>
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`cursor-pointer hover:shadow-lg transition-shadow ${
                                snapshot.isDragging ? 'shadow-xl ring-2 ring-primary' : ''
                              }`}
                              onClick={() => openLeadDrawer(lead.id)}
                            >
                              <CardContent className="p-4 space-y-2">
                                <div className="font-medium text-sm">{lead.nome}</div>
                                <div className="text-xs text-muted-foreground">
                                  {lead.vehicle?.marca} {lead.vehicle?.modelo}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {lead.part?.nome}
                                </div>
                                <div className="flex items-center justify-between pt-2">
                                  <Badge variant="outline" className="text-xs">
                                    {lead.origem}
                                  </Badge>
                                  <div className="flex items-center gap-1 text-xs">
                                    <TrendingUp className="h-3 w-3" />
                                    {lead.score}
                                  </div>
                                </div>
                                {lead.lastContactAt && (
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground pt-1">
                                    <Clock className="h-3 w-3" />
                                    {formatDistanceToNow(new Date(lead.lastContactAt), {
                                      locale: ptBR,
                                      addSuffix: true,
                                    })}
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {leadsByStage[stage]?.length === 0 && (
                        <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
                          Nenhum lead
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <LeadDrawer />
    </div>
  );
}
