'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, CheckCircle, XCircle, Search, ShoppingBag, Package, AlertTriangle, TrendingUp, Users } from 'lucide-react';
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

  // Compute metrics
  const metrics = useMemo(() => {
    const pending = demands.filter(d => d.status === 'pending');
    const highPriority = pending.filter(d => d.priority === 'high').length;
    
    // Count unique products
    const productCounts = pending.reduce((acc, d) => {
      acc[d.product_name] = (acc[d.product_name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topProduct = Object.entries(productCounts)
      .sort(([, a], [, b]) => b - a)[0];

    return {
      totalPending: pending.length,
      highPriority,
      topProduct: topProduct ? { name: topProduct[0], count: topProduct[1] } : null,
      uniqueProducts: Object.keys(productCounts).length,
    };
  }, [demands]);

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-200 font-medium">Alta</Badge>;
      case 'medium':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200 font-medium">Média</Badge>;
      case 'low':
        return <Badge variant="outline" className="text-muted-foreground">Baixa</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200">Pendente</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200">Resolvido</Badge>;
      case 'ignored':
        return <Badge variant="outline" className="text-muted-foreground">Ignorado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-l-4 border-l-red-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Demandas Pendentes
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-kpi text-red-600 tabular-nums">{metrics.totalPending}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.highPriority} de alta prioridade
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Produtos Únicos
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-kpi tabular-nums">{metrics.uniqueProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Sendo procurados
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Mais Procurado
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold font-kpi leading-tight line-clamp-1" title={metrics.topProduct?.name}>
              {metrics.topProduct?.name || '-'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.topProduct ? `${metrics.topProduct.count} solicitações` : 'Nenhum dado'}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Leads Interessados
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-kpi tabular-nums">
              {demands.filter(d => d.lead_id && d.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Aguardando produto
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-muted/30 p-4 rounded-lg border">
        <div className="flex w-full sm:w-auto items-center gap-2">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar produto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[150px] bg-background">
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
        <div className="text-sm text-muted-foreground">
          {demands.length} {demands.length === 1 ? 'resultado' : 'resultados'}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold">Data</TableHead>
              <TableHead className="font-semibold">Produto</TableHead>
              <TableHead className="font-semibold">SKU</TableHead>
              <TableHead className="font-semibold">Lead</TableHead>
              <TableHead className="font-semibold">Prioridade</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="text-right font-semibold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {demands.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-40">
                  <div className="flex flex-col items-center justify-center gap-3 text-center">
                    <div className="rounded-full bg-muted p-4">
                      <ShoppingBag className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Nenhuma demanda encontrada</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {searchTerm 
                          ? 'Tente ajustar os filtros de busca' 
                          : 'Quando produtos forem solicitados e não estiverem em estoque, eles aparecerão aqui'}
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              demands.map((demand) => (
                <TableRow 
                  key={demand.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="text-muted-foreground text-sm whitespace-nowrap font-mono">
                    {format(new Date(demand.created_at), "dd/MM/yyyy", { locale: ptBR })}
                    <div className="text-xs text-muted-foreground/70">
                      {format(new Date(demand.created_at), "HH:mm", { locale: ptBR })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-foreground">{demand.product_name}</div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {demand.sku || <span className="text-muted-foreground/50">-</span>}
                  </TableCell>
                  <TableCell>
                    {demand.leads ? (
                      <div className="flex flex-col text-sm">
                        <span className="font-medium">{demand.leads.name}</span>
                        <span className="text-xs text-muted-foreground font-mono">{demand.leads.phone}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>{getPriorityBadge(demand.priority)}</TableCell>
                  <TableCell>{getStatusBadge(demand.status)}</TableCell>
                  <TableCell className="text-right">
                    {demand.status === 'pending' && (
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-3 text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => handleUpdateStatus(demand.id, 'resolved')}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Resolver
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleUpdateStatus(demand.id, 'ignored')}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Ignorar
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

      {metrics.totalPending > 0 && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-blue-900">Oportunidade de Crescimento</h3>
              <p className="mt-1 text-sm text-blue-700">
                Você tem <span className="font-semibold">{metrics.totalPending} produtos</span> sendo solicitados 
                que não estão disponíveis. Resolver essas demandas pode aumentar significativamente suas vendas.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
