'use client';

import { Users, FileText, TrendingUp, Percent, DollarSign, Target } from 'lucide-react';
import { KPICard } from '@/components/dashboard/KPICard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { mockLeads } from '@/mocks/data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/store/useStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const funnelData = [
  { stage: 'Leads', value: 120 },
  { stage: 'Orçamentos', value: 65 },
  { stage: 'Vendas', value: 18 },
];

const roiData = [
  { date: '01/12', value: 280 },
  { date: '05/12', value: 290 },
  { date: '10/12', value: 310 },
  { date: '15/12', value: 320 },
  { date: '19/12', value: 320 },
];

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: api.dashboard.getStats,
  });

  const { openLeadDrawer } = useStore();
  const recentLeads = mockLeads.slice(0, 5);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do seu negócio
        </p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KPICard
          title="Leads Gerados"
          value={stats?.leadsGenerated || 0}
          icon={Users}
          trend="+12% vs mês anterior"
          trendUp={true}
        />
        <KPICard
          title="Orçamentos Enviados"
          value={stats?.quotesSent || 0}
          icon={FileText}
        />
        <KPICard
          title="Vendas"
          value={stats?.sales || 0}
          icon={TrendingUp}
          trend="+8% vs mês anterior"
          trendUp={true}
        />
        <KPICard
          title="Conversão"
          value={`${stats?.conversionRate || 0}%`}
          icon={Percent}
        />
        <KPICard
          title="CAC Estimado"
          value={`R$ ${stats?.cac || 0}`}
          icon={DollarSign}
        />
        <KPICard
          title="ROI Estimado"
          value={`${stats?.roi || 0}%`}
          icon={Target}
          trend="+15% vs mês anterior"
          trendUp={true}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Funil de Vendas</CardTitle>
            <CardDescription>Jornada dos leads</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={funnelData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="stage" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ROI ao Longo do Tempo</CardTitle>
            <CardDescription>Últimos 30 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={roiData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="hsl(var(--chart-3))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Leads */}
      <Card>
        <CardHeader>
          <CardTitle>Últimos Leads</CardTitle>
          <CardDescription>Leads mais recentes no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                <div className="flex-1">
                  <div className="font-medium">{lead.nome}</div>
                  <div className="text-sm text-muted-foreground">
                    {lead.vehicle?.marca} {lead.vehicle?.modelo} • {lead.part?.nome}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{lead.etapa}</Badge>
                  <Badge variant="secondary">{lead.canal}</Badge>
                  <Button size="sm" onClick={() => openLeadDrawer(lead.id)}>
                    Abrir
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
