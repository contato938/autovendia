'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import { Search, ArrowUpDown } from 'lucide-react';
import type { CampaignRow } from '@/types/googleAdsDashboard';

interface CampaignsTableProps {
  campaigns: CampaignRow[];
  onCampaignClick: (campaign: CampaignRow) => void;
}

type SortField = 'spend' | 'whatsapp_started' | 'purchases' | 'roas';

export function CampaignsTable({ campaigns, onCampaignClick }: CampaignsTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('spend');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const filteredAndSorted = campaigns
    .filter(campaign => 
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const multiplier = sortOrder === 'asc' ? 1 : -1;
      return (a[sortField] - b[sortField]) * multiplier;
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campanhas Google Ads</CardTitle>
        <CardDescription>Performance orientada a conversa e venda</CardDescription>
        <div className="pt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar campanha..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campanha</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right cursor-pointer" onClick={() => handleSort('spend')}>
                  <div className="flex items-center justify-end gap-1">
                    Gasto <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="text-right">Cliques</TableHead>
                <TableHead className="text-right">CPC</TableHead>
                <TableHead className="text-right cursor-pointer" onClick={() => handleSort('whatsapp_started')}>
                  <div className="flex items-center justify-end gap-1">
                    WhatsApp <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="text-right">Qualificados</TableHead>
                <TableHead className="text-right cursor-pointer" onClick={() => handleSort('purchases')}>
                  <div className="flex items-center justify-end gap-1">
                    Vendas <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="text-right">Receita</TableHead>
                <TableHead className="text-right cursor-pointer" onClick={() => handleSort('roas')}>
                  <div className="flex items-center justify-end gap-1">
                    ROAS <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSorted.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                    Nenhuma campanha encontrada
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSorted.map((campaign) => (
                  <TableRow 
                    key={campaign.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onCampaignClick(campaign)}
                  >
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
                    <TableCell className="text-right">{campaign.clicks.toLocaleString('pt-BR')}</TableCell>
                    <TableCell className="text-right">R$ {campaign.cpc.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-semibold">{campaign.whatsapp_started}</TableCell>
                    <TableCell className="text-right">{campaign.qualified}</TableCell>
                    <TableCell className="text-right font-semibold">{campaign.purchases}</TableCell>
                    <TableCell className="text-right">
                      R$ {campaign.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {campaign.roas > 0 ? `${campaign.roas.toFixed(2)}x` : '-'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
