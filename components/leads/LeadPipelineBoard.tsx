'use client';

import { useEffect, useMemo, useState } from 'react';
import { DragDropContext, Draggable, Droppable, type DropResult } from '@hello-pangea/dnd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { leadsService } from '@/services/leads';
import type { Lead, LeadStage } from '@/types';
import { useStore } from '@/store/useStore';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { GripVertical, Search } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const STAGES: LeadStage[] = [
  'Novo',
  'Em conversa (WhatsApp)',
  'Qualificado',
  'Vendido',
  'Perdido',
];

type BoardState = Record<LeadStage, string[]>;

function emptyBoard(): BoardState {
  return {
    'Novo': [],
    'Em conversa (WhatsApp)': [],
    'Qualificado': [],
    'Vendido': [],
    'Perdido': [],
  };
}

function normalizeText(s: string) {
  return (s || '').toLowerCase().trim();
}

function normalizePhone(s: string) {
  return (s || '').replace(/\D/g, '');
}

function leadSortKey(lead: Lead) {
  const d = lead.lastMessageAt || lead.createdAt;
  return new Date(d).getTime();
}

export function LeadPipelineBoard() {
  const queryClient = useQueryClient();
  const { openLeadDrawer, selectedTenantId } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [board, setBoard] = useState<BoardState>(emptyBoard);

  const { data: leads = [], isLoading, isError } = useQuery({
    queryKey: ['leads', selectedTenantId],
    queryFn: () => leadsService.listLeads(selectedTenantId || undefined),
    enabled: !!selectedTenantId,
  });

  const leadById = useMemo(() => {
    const map = new Map<string, Lead>();
    for (const l of leads) map.set(l.id, l);
    return map;
  }, [leads]);

  const matchesSearch = (lead: Lead) => {
    const q = normalizeText(searchQuery);
    if (!q) return true;

    const name = normalizeText(lead.name);
    const phone = normalizePhone(lead.phone);
    const campaign = normalizeText(lead.campaignName || '');

    return name.includes(q) || phone.includes(normalizePhone(q)) || campaign.includes(q);
  };

  const updateStageMutation = useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: LeadStage }) =>
      leadsService.updateLeadStage(id, stage),
    onMutate: async ({ id, stage }) => {
      await queryClient.cancelQueries({ queryKey: ['leads', selectedTenantId] });
      const previous = queryClient.getQueryData<Lead[]>(['leads', selectedTenantId]);

      if (previous) {
        queryClient.setQueryData<Lead[]>(
          ['leads', selectedTenantId],
          previous.map((l) => (l.id === id ? { ...l, stage } : l))
        );
      }

      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(['leads', selectedTenantId], ctx.previous);
      }
      toast.error('Falha ao atualizar etapa. Reverti a mudança.');
    },
    onSuccess: () => {
      toast.success('Etapa atualizada!');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['leads', selectedTenantId] });
    },
  });

  useEffect(() => {
    if (!leads || leads.length === 0) {
      setBoard((prev) => prev);
      return;
    }

    const idsByStage: Record<LeadStage, string[]> = emptyBoard();

    const sorted = [...leads].sort((a, b) => leadSortKey(b) - leadSortKey(a));
    for (const lead of sorted) {
      idsByStage[lead.stage].push(lead.id);
    }

    setBoard((prev) => {
      const next: BoardState = emptyBoard();

      for (const stage of STAGES) {
        const desired = idsByStage[stage];
        const prevList = (prev[stage] || []).filter((id) => desired.includes(id));
        const missing = desired.filter((id) => !prevList.includes(id));
        next[stage] = [...prevList, ...missing];
      }

      return next;
    });
  }, [leads]);

  const getVisibleIds = (stage: LeadStage, currentBoard: BoardState) => {
    const ids = currentBoard[stage] || [];
    return ids.filter((id) => {
      const lead = leadById.get(id);
      if (!lead) return false;
      return matchesSearch(lead);
    });
  };

  const insertByVisibleIndex = (
    destStage: LeadStage,
    destList: string[],
    visibleDestList: string[],
    leadId: string,
    visibleIndex: number
  ) => {
    const cleanDest = destList.filter((id) => id !== leadId);

    const cleanVisible = visibleDestList.filter((id) => id !== leadId);
    const anchorId = cleanVisible[visibleIndex];

    if (!anchorId) {
      return [...cleanDest, leadId];
    }

    const anchorPos = cleanDest.indexOf(anchorId);
    if (anchorPos === -1) {
      return [...cleanDest, leadId];
    }

    const out = [...cleanDest];
    out.splice(anchorPos, 0, leadId);
    return out;
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    const fromStage = source.droppableId as LeadStage;
    const toStage = destination.droppableId as LeadStage;

    if (!STAGES.includes(fromStage) || !STAGES.includes(toStage)) return;

    setBoard((prev) => {
      const next: BoardState = {
        ...prev,
        [fromStage]: [...(prev[fromStage] || [])],
        [toStage]: fromStage === toStage ? [...(prev[toStage] || [])] : [...(prev[toStage] || [])],
      } as BoardState;

      const fromList = next[fromStage].filter((id) => id !== draggableId);
      next[fromStage] = fromList;

      const destList = next[toStage] || [];
      const visibleDest = getVisibleIds(toStage, next);

      next[toStage] = insertByVisibleIndex(
        toStage,
        destList,
        visibleDest,
        draggableId,
        destination.index
      );

      return next;
    });

    if (fromStage !== toStage) {
      updateStageMutation.mutate({ id: draggableId, stage: toStage });
    }
  };

  const stageStats = (stage: LeadStage) => {
    const ids = board[stage] || [];
    let count = 0;
    let total = 0;

    for (const id of ids) {
      const lead = leadById.get(id);
      if (!lead) continue;
      if (!matchesSearch(lead)) continue;
      count += 1;
      if (lead.sale && lead.sale.value > 0) total += lead.sale.value;
    }

    return { count, total };
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {STAGES.map((s) => (
          <Card key={s} className="h-[520px]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{s}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          Não consegui carregar os leads agora.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, telefone ou campanha..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Dica: Arraste o card pelo ícone lateral para movê-lo sem abrir os detalhes
          </div>
        </CardContent>
      </Card>

      <div className="w-full overflow-x-auto">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 min-w-[1100px]">
            {STAGES.map((stage) => {
              const { count, total } = stageStats(stage);
              const visibleIds = getVisibleIds(stage, board);

              return (
                <Card key={stage} className="w-[340px] shrink-0">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <CardTitle className="text-base leading-tight">{stage}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{count} leads</Badge>
                          {total > 0 ? (
                            <Badge variant="default">
                              R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                            </Badge>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <Droppable droppableId={stage}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={[
                            'rounded-lg border border-dashed p-2 transition-colors',
                            snapshot.isDraggingOver ? 'bg-muted/40' : 'bg-transparent',
                          ].join(' ')}
                        >
                          <ScrollArea className="h-[420px] pr-2">
                            {visibleIds.length === 0 ? (
                              <div className="p-6 text-center text-sm text-muted-foreground">
                                Nenhum lead aqui
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {visibleIds.map((id, index) => {
                                  const lead = leadById.get(id);
                                  if (!lead) return null;

                                  return (
                                    <Draggable key={id} draggableId={id} index={index}>
                                      {(dragProvided, dragSnapshot) => (
                                        <div
                                          ref={dragProvided.innerRef}
                                          {...dragProvided.draggableProps}
                                          className={[
                                            'rounded-md border bg-background',
                                            dragSnapshot.isDragging ? 'shadow-md' : '',
                                          ].join(' ')}
                                        >
                                          <div className="flex items-stretch">
                                            <button
                                              type="button"
                                              className="px-2 flex items-center justify-center text-muted-foreground hover:text-foreground"
                                              aria-label="Arrastar"
                                              {...dragProvided.dragHandleProps}
                                            >
                                              <GripVertical className="h-4 w-4" />
                                            </button>

                                            <button
                                              type="button"
                                              className="flex-1 text-left p-3"
                                              onClick={() => openLeadDrawer(lead.id)}
                                            >
                                              <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                  <div className="font-medium truncate">{lead.name}</div>
                                                  <div className="text-xs text-muted-foreground truncate">
                                                    {lead.phone} · {lead.campaignName || 'Sem campanha'}
                                                  </div>
                                                </div>
                                                {lead.sale && lead.sale.value > 0 ? (
                                                  <Badge variant="default" className="shrink-0">
                                                    R$ {lead.sale.value.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                                                  </Badge>
                                                ) : null}
                                              </div>

                                              <div className="mt-2 text-xs text-muted-foreground">
                                                {lead.lastMessageAt
                                                  ? `Último contato ${formatDistanceToNow(new Date(lead.lastMessageAt), { locale: ptBR, addSuffix: true })}`
                                                  : `Criado ${formatDistanceToNow(new Date(lead.createdAt), { locale: ptBR, addSuffix: true })}`}
                                              </div>
                                            </button>
                                          </div>
                                        </div>
                                      )}
                                    </Draggable>
                                  );
                                })}
                              </div>
                            )}

                            {provided.placeholder}
                          </ScrollArea>
                        </div>
                      )}
                    </Droppable>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}
