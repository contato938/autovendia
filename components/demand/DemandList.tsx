'use client';

import { useState, useEffect, useCallback } from 'react';
import { useStore } from '@/store/useStore';
import { supabase } from '@/lib/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, CheckCircle, XCircle, Search, AlertCircle, ShoppingBag } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ProductDemand } from '@/types/demand';

export function DemandList() {
  const { selectedTenantId } = useStore();
  const [demands, setDemands] = useState<ProductDemand[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('pending');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchDemands = useCallback(async () => {
    if (!selectedTenantId) return;
    
    setLoading(true);
    try {
      let query = supabase
        .from('product_demand')
        .select(`
          *,
          leads (
            name,
            phone
          )
        `)
        .eq('tenant_id', selectedTenantId)
        .order('created_at', { ascending: false });

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      if (searchTerm) {
        query = query.ilike('product_name', `%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      setDemands(data as unknown as ProductDemand[]);
    } catch (error) {
      console.error('Error fetching demand:', error);
      toast.error('Erro ao carregar demandas.');
    } finally {
      setLoading(false);
    }
  }, [selectedTenantId, filterStatus, searchTerm]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchDemands();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchDemands]);

  const handleUpdateStatus = async (id: string, newStatus: 'resolved' | 'ignored') => {
    try {
      const { error } = await supabase
        .from('product_demand')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Demanda ${newStatus === 'resolved' ? 'resolvida' : 'ignorada'} com sucesso.`);
      fetchDemands();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Erro ao atualizar status.');
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">Alta</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-200">Média</Badge>;
      case 'low':
        return <Badge variant="outline">Baixa</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pendente</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Resolvido</Badge>;
      case 'ignored':
        return <Badge variant="outline" className="text-muted-foreground">Ignorado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex w-full sm:w-auto items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar produto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pending">Pendentes</SelectItem>
              <SelectItem value="resolved">Resolvidos</SelectItem>
              <SelectItem value="ignored">Ignorados</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Lead</TableHead>
              <TableHead>Prioridade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : demands.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <ShoppingBag className="h-8 w-8 text-muted-foreground/50" />
                    <p>Nenhuma demanda encontrada.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              demands.map((demand) => (
                <TableRow key={demand.id}>
                  <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                    {format(new Date(demand.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  </TableCell>
                  <TableCell className="font-medium">{demand.product_name}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {demand.sku || '-'}
                  </TableCell>
                  <TableCell>
                    {demand.leads ? (
                      <div className="flex flex-col text-sm">
                        <span>{demand.leads.name}</span>
                        <span className="text-xs text-muted-foreground">{demand.leads.phone}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>{getPriorityBadge(demand.priority)}</TableCell>
                  <TableCell>{getStatusBadge(demand.status)}</TableCell>
                  <TableCell className="text-right">
                    {demand.status === 'pending' && (
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                          title="Marcar como Resolvido"
                          onClick={() => handleUpdateStatus(demand.id, 'resolved')}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          title="Ignorar"
                          onClick={() => handleUpdateStatus(demand.id, 'ignored')}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
