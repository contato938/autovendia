'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { leadsService } from '@/services/leads';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { LeadDrawer } from '@/components/leads/LeadDrawer';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LeadStage } from '@/types';

export default function LeadsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<LeadStage | 'all'>('all');
  const { openLeadDrawer, selectedTenantId } = useStore();

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['leads', selectedTenantId],
    queryFn: () => leadsService.listLeads(selectedTenantId || undefined),
    enabled: !!selectedTenantId,
  });

  // Filter leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.phone.includes(searchQuery);
    const matchesStage = stageFilter === 'all' || lead.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  const stages: LeadStage[] = ['Novo', 'Em conversa (WhatsApp)', 'Qualificado', 'Vendido', 'Perdido'];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
        <p className="text-muted-foreground">
          Gerencie todos os seus leads com atribuição completa
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou telefone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={stageFilter} onValueChange={(v) => setStageFilter(v as LeadStage | 'all')}>
              <SelectTrigger className="w-full md:w-[220px]">
                <SelectValue placeholder="Filtrar por etapa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as etapas</SelectItem>
                {stages.map(stage => (
                  <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              Nenhum lead encontrado
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lead</TableHead>
                  <TableHead>Campanha</TableHead>
                  <TableHead>Etapa</TableHead>
                  <TableHead>Último contato</TableHead>
                  <TableHead className="text-right">Valor venda</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow 
                    key={lead.id} 
                    className="cursor-pointer hover:bg-muted/50" 
                    onClick={() => openLeadDrawer(lead.id)}
                  >
                    <TableCell>
                      <div>
                        <div className="font-medium">{lead.name}</div>
                        <div className="text-sm text-muted-foreground">{lead.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[250px]">
                      <div className="truncate text-sm">{lead.campaignName}</div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          lead.stage === 'Vendido' ? 'default' : 
                          lead.stage === 'Perdido' ? 'destructive' : 
                          'outline'
                        }
                      >
                        {lead.stage}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {lead.lastMessageAt ? formatDistanceToNow(new Date(lead.lastMessageAt), { locale: ptBR, addSuffix: true }) : '-'}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {lead.sale && lead.sale.value > 0 ? 
                        `R$ ${lead.sale.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 
                        '-'
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <LeadDrawer />
    </div>
  );
}
