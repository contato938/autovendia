import { Button } from "@/components/ui/button";
import Link from "next/link";

// Using a simple list structure if Accordion doesn't exist, but typically shadcn projects have it.
// To be safe and compliant with "no new deps/use existing components", I'll implement a simple collapsible or just list if I am not 100% sure. 
// However, I checked "ls components/ui" and I didn't see accordion.tsx. I saw:
// avatar, badge, button, calendar, card, chart, command, dialog, dropdown-menu, input, label, popover, 
// scroll-area, select, separator, sheet, sidebar, skeleton, sonner, table, tabs, textarea, tooltip.
// NO ACCORDION.
// So I will build a simple FAQ using Cards or just HTML details/summary to avoid complex state if possible, or standard React state.

export function FAQ() {
    return (
      <section id="faq" className="container mx-auto py-12 md:py-24 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-primary">Perguntas Frequentes</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {[
            {
              q: "Preciso trocar meu WhatsApp?",
              a: "Não. O AutovendaIA funciona como uma camada de inteligência sobre o seu processo atual. Você continua usando seu número."
            },
            {
              q: "Precisa de Tag Manager?",
              a: "É recomendável, mas não obrigatório. Se você já tem o GTM instalado, a integração é ainda mais rápida."
            },
            {
              q: "Como vocês identificam a origem do lead?",
              a: "Capturamos o GCLID (Google Click ID) no momento que o usuário clica no anúncio e preservamos esse código até o início da conversa no WhatsApp."
            },
            {
              q: "Quanto tempo para ficar de pé?",
              a: "A configuração inicial leva menos de 15 minutos. Depois, é só começar a alimentar o funil."
            },
            {
              q: "E se eu não tiver a venda confirmada na hora?",
              a: "Sem problemas. O sistema permite marcar a venda dias ou semanas depois. A conversão offline é enviada com o timestamp correto para o Google."
            },
            {
              q: "O que acontece se a conversão offline falhar?",
              a: "Nós temos uma fila de retentativa automática e um painel de logs que te avisa exatamente o porquê da falha para correção."
            }
          ].map((item, i) => (
            <div key={i} className="bg-card border rounded-lg p-6 space-y-2">
              <h3 className="font-semibold text-lg">{item.q}</h3>
              <p className="text-muted-foreground text-sm">{item.a}</p>
            </div>
          ))}
        </div>
  
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center space-y-6 max-w-3xl mx-auto mt-12">
          <h3 className="text-2xl font-bold">Pronto para escalar com dado real?</h3>
          <p className="text-muted-foreground">Entre e veja o painel com suas métricas.</p>
          <div className="flex justify-center">
            <Link href="/login">
                <Button size="lg" className="px-8 font-semibold">
                    Começar agora
                </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }
