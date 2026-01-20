import { MarketingNavbar } from '@/components/marketing/MarketingNavbar';
import { MarketingFooter } from '@/components/marketing/MarketingFooter';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <MarketingNavbar />
      
      <main className="flex-1 py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-2 mb-8 border-b pb-8">
            <h1 className="type-h2 text-primary">Termos de Uso</h1>
            <p className="text-muted-foreground">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
          </div>

          <div className="space-y-8 text-foreground/90 leading-relaxed">
            <section className="space-y-4">
              <h2 className="type-h3 text-foreground">1. Aceitação dos Termos</h2>
              <p>
                Ao acessar e utilizar a plataforma AUTOVEND IA, você concorda em cumprir estes Termos de Uso e todas as leis aplicáveis. Se você não concordar com algum destes termos, está proibido de usar ou acessar este serviço.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="type-h3 text-foreground">2. Descrição do Serviço</h2>
              <p>
                O AUTOVEND IA é uma ferramenta SaaS que auxilia na integração de dados entre plataformas de anúncios (como Google Ads) e canais de comunicação (como WhatsApp) para fins de atribuição de vendas e otimização de campanhas através de conversões offline.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="type-h3 text-foreground">3. Uso Responsável</h2>
              <p>Você concorda em:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Utilizar a plataforma apenas para fins legítimos de negócios.</li>
                <li>Não tentar realizar engenharia reversa ou acessar o código fonte da plataforma.</li>
                <li>Não utilizar o serviço para envio de SPAM ou comunicações não solicitadas.</li>
                <li>Manter suas credenciais de acesso seguras e confidenciais.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="type-h3 text-foreground">4. Conformidade com Terceiros</h2>
              <p>
                O usuário reconhece que o uso do AUTOVEND IA depende de serviços de terceiros (Google Ads, WhatsApp, etc.). É responsabilidade exclusiva do usuário cumprir as políticas e termos de uso dessas plataformas terceiras. O AUTOVEND IA não se responsabiliza por bloqueios ou suspensões de contas nessas plataformas decorrentes de mau uso.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="type-h3 text-foreground">5. Limitação de Responsabilidade</h2>
              <p>
                Em nenhuma circunstância o AUTOVEND IA ou seus fornecedores serão responsáveis por quaisquer danos (incluindo, sem limitação, danos por perda de dados ou lucro, ou devido a interrupção dos negócios) decorrentes do uso ou da incapacidade de usar nossos serviços.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="type-h3 text-foreground">6. Assinatura e Cancelamento</h2>
              <p>
                Os termos de pagamento, renovação e cancelamento são regidos pelo plano contratado. O usuário pode cancelar sua assinatura a qualquer momento através do painel de controle, sujeito às regras específicas do seu plano.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="type-h3 text-foreground">7. Modificações</h2>
              <p>
                Podemos revisar estes termos de serviço a qualquer momento, sem aviso prévio. Ao usar este site, você concorda em ficar vinculado à versão atual desses termos de serviço.
              </p>
            </section>
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
