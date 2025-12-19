'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Filter } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { LeadDrawer } from '@/components/leads/LeadDrawer';
import { Skeleton } from '@/components/ui/skeleton';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { mockUsers } from '@/mocks/data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function LeadsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const { openLeadDrawer } = useStore();

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: api.leads.list,
  });

  // Filter leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.telefone.includes(searchQuery);
    const matchesStage = stageFilter === 'all' || lead.etapa === stageFilter;
    return matchesSearch && matchesStage;
  });

  const stages = ['Novo', 'Em atendimento', 'Orçamento gerado', 'Orçamento enviado', 'Negociação', 'Fechado', 'Perdido'];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
        <p className="text-muted-foreground">
          Gerencie todos os seus leads
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
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
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
                  <TableHead>Veículo / Peça</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead>Canal</TableHead>
                  <TableHead>Etapa</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Último Contato</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => {
                  const responsible = mockUsers.find(u => u.id === lead.responsavelId);
                  
                  return (
                    <TableRow key={lead.id} className="cursor-pointer hover:bg-muted/50" onClick={() => openLeadDrawer(lead.id)}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{lead.nome}</div>
                          <div className="text-sm text-muted-foreground">{lead.telefone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{lead.vehicle?.marca} {lead.vehicle?.modelo}</div>
                          <div className="text-muted-foreground">{lead.part?.nome}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{lead.origem}</div>
                          {lead.campanha && <div className="text-muted-foreground">{lead.campanha}</div>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{lead.canal}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge>{lead.etapa}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={lead.score > 70 ? 'default' : lead.score > 40 ? 'secondary' : 'outline'}>
                          {lead.score}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {lead.lastContactAt ? formatDistanceToNow(new Date(lead.lastContactAt), { locale: ptBR, addSuffix: true }) : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            openLeadDrawer(lead.id);
                          }}
                        >
                          Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <LeadDrawer />
    </div>
  );
}
