import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  MessageSquare, 
  Target, 
  RefreshCw, 
  Zap, 
  ShieldCheck, 
  Users, 
  ArrowRightLeft
} from 'lucide-react';

export function FeatureGrid() {
  return (
    <div className="space-y-24 py-12 md:py-24">
      {/* Problema */}
      <section className="container mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/15">O Problema</Badge>
          <h2 className="type-h2 text-primary">Por que você está perdendo dinheiro?</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: MessageSquare,
              title: "WhatsApp é uma caixa preta",
              text: "O lead clica, chama no 'Zap' e você perde o rastro. Qual campanha trouxe essa venda? Ninguém sabe."
            },
            {
              icon: Target,
              title: "Otimização Cega",
              text: "O Google Ads só vê o clique ou o lead, não a venda. O algoritmo começa a trazer curiosos em vez de compradores."
            },
            {
              icon: Users,
              title: "Demora na Resposta",
              text: "Enquanto seu time dorme ou almoça, o lead esfria. Você paga caro pelo clique e perde a oportunidade."
            }
          ].map((item, i) => (
            <Card key={i} className="border-none shadow-md bg-card">
              <CardHeader>
                <item.icon className="h-10 w-10 text-primary mb-2" />
                <CardTitle className="text-xl">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{item.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Solução */}
      <section className="bg-primary text-primary-foreground py-16 -mx-4 md:-mx-8 px-4 md:px-8">
        <div className="container mx-auto text-center space-y-6">
          <h2 className="type-h2 text-primary-foreground">Feche o loop do clique à venda</h2>
          <p className="text-xl max-w-3xl mx-auto text-primary-foreground/90">
            Do anúncio ao WhatsApp, do WhatsApp à venda, da venda de volta ao Google Ads. 
            Uma linha contínua de dados para maximizar seu lucro.
          </p>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" className="container mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <Badge variant="outline" className="border-primary text-primary mb-4">Passo a passo</Badge>
          <h2 className="type-h2 text-primary">Como funciona</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-border -z-10" />
          {[
            { step: 1, title: "Conecte sua conta", text: "Integre Google Ads em poucos cliques." },
            { step: 2, title: "Rastreie a origem", text: "Capture o GCLID e amarre na conversa." },
            { step: 3, title: "Marque a venda", text: "Qualifique o lead no nosso painel." },
            { step: 4, title: "Otimize automático", text: "Enviamos a conversão offline pro Ads." },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center space-y-4 bg-background p-4">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg z-10 ring-4 ring-background">
                {item.step}
              </div>
              <h3 className="text-lg font-bold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recursos */}
      <section id="recursos" className="container mx-auto space-y-8">
        <div className="text-center">
          <h2 className="type-h2 text-primary mb-4">Tudo o que você precisa</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: BarChart3, title: "Dashboard Completo", text: "KPIs vitais: investimento, leads, vendas, receita e ROAS em tempo real." },
            { icon: ArrowRightLeft, title: "Funil AUTOVEND IA", text: "Visualização clara: click → WhatsApp → qualificado → venda." },
            { icon: Target, title: "Campanhas Reais", text: "Analise quais campanhas trazem dinheiro, não apenas curiosos." },
            { icon: RefreshCw, title: "Conversões Offline", text: "Gestão completa de envios: fila, processados, falhas e reprocessamento." },
            { icon: Zap, title: "Saúde Operacional", text: "Monitore tempo de 1ª resposta e gargalos no atendimento." },
            { icon: ShieldCheck, title: "Integrações", text: "Configuração simples por conta de anúncio e período." },
          ].map((feat, i) => (
            <Card key={i} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <feat.icon className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-lg">{feat.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feat.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Integrações */}
      <section className="container mx-auto bg-muted/50 rounded-3xl p-8 md:p-12 text-center space-y-8">
        <h2 className="type-h3">Integrações Nativas</h2>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          <div className="flex flex-col items-center gap-2">
            <div className="h-16 w-16 bg-white rounded-xl shadow-sm flex items-center justify-center p-3">
               {/* Simple Google Ads Logo Representation */}
               <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.6 22H21V12h-5.4v10zm-6.6 0h5.4v-6H9v6zM2.4 22h5.4V2H2.4v20z" fill="#F4B400"/>
               </svg>
            </div>
            <span className="font-medium">Google Ads</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-16 w-16 bg-white rounded-xl shadow-sm flex items-center justify-center p-3">
              {/* Simple WhatsApp Logo Representation */}
               <svg viewBox="0 0 24 24" className="w-10 h-10 fill-green-500" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </div>
            <span className="font-medium">WhatsApp</span>
          </div>
          <div className="flex flex-col items-center gap-2 opacity-50 grayscale hover:grayscale-0 transition-all cursor-not-allowed">
            <div className="h-16 w-16 bg-white rounded-xl shadow-sm flex items-center justify-center p-3 border border-dashed">
               <span className="font-bold text-xs">META ADS</span>
            </div>
            <span className="font-medium text-xs">Em breve</span>
          </div>
        </div>
      </section>

       {/* Security */}
      <section className="container mx-auto text-center space-y-6">
        <div className="flex justify-center">
            <ShieldCheck className="w-12 h-12 text-primary/50" />
        </div>
        <h2 className="type-h3">Segurança e LGPD</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto text-sm text-muted-foreground">
            <div className="bg-card p-4 rounded-lg border">
                <p>Dados em trânsito criptografados via HTTPS</p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
                <p>Controle estrito por tenant e papéis de usuário</p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
                <p>Logs detalhados de todo envio de conversão</p>
            </div>
        </div>
      </section>
    </div>
  );
}
