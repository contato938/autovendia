import { MarketingNavbar } from '@/components/marketing/MarketingNavbar';
import { MarketingFooter } from '@/components/marketing/MarketingFooter';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <MarketingNavbar />
      
      <main className="flex-1 py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-2 mb-8 border-b pb-8">
            <h1 className="type-h2 text-primary">Política de Privacidade</h1>
            <p className="text-muted-foreground">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
          </div>

          <div className="space-y-8 text-foreground/90 leading-relaxed">
            <section className="space-y-4">
              <h2 className="type-h3 text-foreground">1. Introdução</h2>
              <p>
                A AUTOVEND IA ("nós", "nosso") respeita a sua privacidade e está comprometida em proteger os dados pessoais que você compartilha conosco. Esta política descreve como coletamos, usamos e protegemos suas informações ao utilizar nossa plataforma de integração de dados de vendas e marketing.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="type-h3 text-foreground">2. Dados que Coletamos</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Dados da Conta:</strong> Nome, e-mail, telefone e informações de login.</li>
                <li><strong>Dados de Integração:</strong> Tokens de acesso (Google Ads, CRM), IDs de campanhas, GCLIDs (Google Click IDs) e metadados de conversas.</li>
                <li><strong>Dados de Uso:</strong> Logs de acesso, interações com a plataforma e métricas de desempenho.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="type-h3 text-foreground">3. Como Usamos Seus Dados</h2>
              <p>Utilizamos seus dados para:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Fornecer o serviço de atribuição e envio de conversões offline.</li>
                <li>Autenticar seu acesso ao painel.</li>
                <li>Melhorar nossos algoritmos e funcionalidades.</li>
                <li>Comunicar atualizações, alertas de segurança e suporte.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="type-h3 text-foreground">4. Compartilhamento de Dados</h2>
              <p>
                Não vendemos seus dados pessoais. Compartilhamos informações apenas com:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Plataformas de Anúncio (Google Ads):</strong> Apenas os dados estritamente necessários para registrar a conversão offline, conforme sua configuração.</li>
                <li><strong>Prestadores de Serviço:</strong> Infraestrutura de hospedagem e banco de dados (ex: Supabase, Vercel), sob contratos de confidencialidade.</li>
                <li><strong>Obrigação Legal:</strong> Quando exigido por lei ou ordem judicial.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="type-h3 text-foreground">5. Segurança</h2>
              <p>
                Empregamos medidas de segurança robustas, incluindo criptografia em trânsito (HTTPS) e em repouso, controles de acesso rigorosos e monitoramento constante para proteger seus dados contra acesso não autorizado.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="type-h3 text-foreground">6. Seus Direitos (LGPD)</h2>
              <p>
                Você tem o direito de solicitar o acesso, correção, anonimização ou exclusão de seus dados pessoais. Para exercer esses direitos, entre em contato através do nosso suporte.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="type-h3 text-foreground">7. Contato</h2>
              <p>
                Se tiver dúvidas sobre esta política, entre em contato pelo e-mail: privacidade@autovendaia.com.br
              </p>
            </section>
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
