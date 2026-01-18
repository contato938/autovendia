'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { campaignsService } from '@/services/campaigns';
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
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CampaignStatus } from '@/types';

export default function CampaignsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | 'all'>('all');

  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ['campaigns'],
    queryFn: campaignsService.listCampaigns,
  });

  // Filter campaigns
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Campanhas</h1>
        <p className="text-muted-foreground">
          Performance de campanhas Google Ads
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
                placeholder="Buscar por nome da campanha..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as CampaignStatus | 'all')}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativa</SelectItem>
                <SelectItem value="paused">Pausada</SelectItem>
                <SelectItem value="ended">Encerrada</SelectItem>
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
          ) : filteredCampaigns.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              Nenhuma campanha encontrada
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campanha</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Gasto</TableHead>
                  <TableHead className="text-right">Leads</TableHead>
                  <TableHead className="text-right">Vendas</TableHead>
                  <TableHead className="text-right">Receita</TableHead>
                  <TableHead className="text-right">ROAS</TableHead>
                  <TableHead>Atualizado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCampaigns.map((campaign) => (
                  <TableRow key={campaign.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium max-w-[300px]">
                      <div className="truncate">{campaign.name}</div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          campaign.status === 'active' ? 'default' : 
                          campaign.status === 'paused' ? 'secondary' : 
                          'outline'
                        }
                      >
                        {campaign.status === 'active' ? 'Ativa' : 
                         campaign.status === 'paused' ? 'Pausada' : 
                         'Encerrada'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      R$ {campaign.spend.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-right">{campaign.leads}</TableCell>
                    <TableCell className="text-right">{campaign.purchases}</TableCell>
                    <TableCell className="text-right">
                      R$ {campaign.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {campaign.roas > 0 ? `${campaign.roas.toFixed(2)}x` : '-'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(campaign.updatedAt), 'dd/MM/yyyy', { locale: ptBR })}
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
