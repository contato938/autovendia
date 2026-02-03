import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, ArrowUpDown } from 'lucide-react';
import type { CampaignRow } from '@/types/googleAdsDashboard';
import { useState } from 'react';

interface CampaignsTableProps {
  campaigns: CampaignRow[];
  onCampaignClick: (campaign: CampaignRow) => void;
}

type SortField = keyof CampaignRow;

export function CampaignsTable({ campaigns, onCampaignClick }: CampaignsTableProps) {
  const [sortField, setSortField] = useState<SortField>('spend');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedCampaigns = [...campaigns].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    // Handle string comparisons if any (mostly numbers here)
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
    
    // Handle numeric
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const getLabelBadge = (label: CampaignRow['label']) => {
    switch (label) {
      case 'escalar': 
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-0">Escalar</Badge>;
      case 'ajustar': 
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-0">Ajustar</Badge>;
      case 'pausar': 
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-0">Pausar</Badge>;
      case 'manter': 
        return <Badge variant="outline" className="text-gray-600">Manter</Badge>;
      default:
        return null; // ou <Badge variant="secondary">Novo</Badge>
    }
  };

  const SortHeader = ({ field, label, right = false }: { field: SortField, label: string, right?: boolean }) => (
    <TableHead 
      className={`cursor-pointer hover:bg-gray-50 ${right ? 'text-right' : ''}`}
      onClick={() => handleSort(field)}
    >
      <div className={`flex items-center gap-1 ${right ? 'justify-end' : ''}`}>
        {label}
        <ArrowUpDown className="h-3 w-3" />
      </div>
    </TableHead>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance por Campanha</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <SortHeader field="name" label="Campanha" />
                <TableHead>Status</TableHead>
                <TableHead>Sugestão</TableHead>
                <SortHeader field="spend" label="Invest." right />
                <SortHeader field="clicks" label="Cliques" right />
                <SortHeader field="ctr" label="CTR" right />
                <SortHeader field="whatsapp_started" label="WPP" right />
                <SortHeader field="purchases" label="Vendas" right />
                <SortHeader field="cac" label="CAC" right />
                <SortHeader field="revenue" label="Receita" right />
                <SortHeader field="revenueSharePct" label="% Rec." right />
                <SortHeader field="roas" label="ROAS" right />
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCampaigns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={13} className="h-24 text-center">
                    Nenhuma campanha encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                sortedCampaigns.map((campaign) => (
                  <TableRow 
                    key={campaign.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => onCampaignClick(campaign)}
                  >
                    <TableCell className="font-medium max-w-[200px] truncate" title={campaign.name}>
                      {campaign.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                        {campaign.status === 'active' ? 'Ativa' : campaign.status === 'paused' ? 'Pausada' : 'Finalizada'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {getLabelBadge(campaign.label)}
                    </TableCell>
                    <TableCell className="text-right">
                      R$ {campaign.spend.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-right">{campaign.clicks}</TableCell>
                    <TableCell className="text-right">{campaign.ctr}%</TableCell>
                    <TableCell className="text-right">{campaign.whatsapp_started}</TableCell>
                    <TableCell className="text-right">{campaign.purchases}</TableCell>
                    <TableCell className="text-right">R$ {campaign.cac}</TableCell>
                    <TableCell className="text-right">
                       R$ {campaign.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-right text-gray-500">
                      {campaign.revenueSharePct}%
                    </TableCell>
                    <TableCell className={`text-right font-medium ${
                      campaign.roas >= 5 ? 'text-green-600' : 
                      campaign.roas < 2 ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {campaign.roas.toFixed(2)}x
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
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
