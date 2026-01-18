import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export function ProductPreview() {
  return (
    <section className="container mx-auto py-12 md:py-24 space-y-8">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-primary">
          Visão do que importa
        </h2>
        <p className="text-xl text-muted-foreground">
          KPIs de negócio, funil e fila de conversões, tudo num lugar só.
        </p>
      </div>

      <div className="mx-auto max-w-5xl">
        <Card className="bg-card border-border shadow-2xl overflow-hidden relative">
          <div className="bg-muted/50 border-b p-4 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="mx-auto bg-background border px-3 py-1 rounded-md text-xs text-muted-foreground w-64 text-center">
              app.autovendaia.com/dashboard
            </div>
          </div>
          
          <CardContent className="p-6 md:p-8 bg-background/50 space-y-8">
            {/* Top KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Investimento', value: 'R$ 12.450', change: '+12%', color: 'text-foreground' },
                { label: 'Vendas', value: '142', change: '+8%', color: 'text-foreground' },
                { label: 'Receita', value: 'R$ 48.200', change: '+15%', color: 'text-primary' },
                { label: 'ROAS', value: '3.87', change: '+2%', color: 'text-green-600' },
              ].map((kpi, i) => (
                <div key={i} className="p-4 rounded-lg border bg-background space-y-1">
                  <p className="text-xs text-muted-foreground font-medium uppercase">{kpi.label}</p>
                  <div className="flex items-end justify-between">
                    <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
                    <span className="text-xs text-green-600 font-medium bg-green-100 dark:bg-green-900 px-1.5 py-0.5 rounded">
                      {kpi.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Funnel Chart */}
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">Funil de Vendas</h3>
                  <Badge variant="outline" className="text-xs">Últimos 30 dias</Badge>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Cliques (Google Ads)', value: '1.240', pct: '100%', color: 'bg-blue-200 dark:bg-blue-900' },
                    { label: 'Iniciaram Conversa', value: '850', pct: '68%', color: 'bg-blue-300 dark:bg-blue-800' },
                    { label: 'Lead Qualificado', value: '320', pct: '25%', color: 'bg-blue-400 dark:bg-blue-700' },
                    { label: 'Venda Realizada', value: '142', pct: '11%', color: 'bg-green-500 text-white' },
                  ].map((step, i) => (
                    <div key={i} className="group relative">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium">{step.label}</span>
                        <span className="text-muted-foreground">{step.value} ({step.pct})</span>
                      </div>
                      <div className="h-8 w-full bg-muted rounded-md overflow-hidden relative">
                        <div 
                          className={`h-full rounded-r-md ${step.color} transition-all duration-1000 ease-out`} 
                          style={{ width: step.pct }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conversion Queue */}
              <div className="space-y-4 border rounded-lg p-4 bg-background">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Feed em Tempo Real
                </h3>
                <div className="space-y-4">
                  {[
                    { status: 'success', time: '2 min', desc: 'Venda R$ 350 enviada' },
                    { status: 'success', time: '5 min', desc: 'Venda R$ 120 enviada' },
                    { status: 'pending', time: '8 min', desc: 'Processando lead...' },
                    { status: 'success', time: '12 min', desc: 'Venda R$ 890 enviada' },
                    { status: 'error', time: '15 min', desc: 'Falha no GCLID (Retentando)' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <div className={`mt-1.5 w-1.5 h-1.5 rounded-full ${
                        item.status === 'success' ? 'bg-green-500' : 
                        item.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <p className="font-medium text-xs">{item.desc}</p>
                        <p className="text-[10px] text-muted-foreground">Há {item.time} • Google Ads</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
