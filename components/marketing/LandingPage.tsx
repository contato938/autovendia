import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MarketingNavbar } from './MarketingNavbar';
import { ProductPreview } from './ProductPreview';
import { FeatureGrid } from './FeatureGrid';
import { FAQ } from './FAQ';
import { MarketingFooter } from './MarketingFooter';
import { BrandLogo } from '@/components/brand/BrandLogo';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <MarketingNavbar />
      
      <main>
        {/* Hero Section */}
        <section className="container mx-auto pt-20 pb-12 md:pt-32 md:pb-16 text-center space-y-8 relative">
          {/* Marca (reforço visual) */}
          <div className="flex justify-center">
            <BrandLogo variant="horizontal" mode="light" className="h-9 w-[220px]" />
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="type-h1 text-primary leading-tight">
              Pare de adivinhar. <br className="hidden md:block" />
              Saiba quais anúncios viram venda no WhatsApp.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              O AUTOVEND IA conecta Google Ads + WhatsApp + venda, mostra ROAS real e envia conversões offline para otimizar o algoritmo.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/login">
              <Button size="lg" className="h-12 px-8 text-lg w-full md:w-auto">
                Começar agora
              </Button>
            </Link>
            <Link href="#como-funciona">
              <Button variant="outline" size="lg" className="h-12 px-8 text-lg w-full md:w-auto">
                Ver como funciona
              </Button>
            </Link>
          </div>

          <div className="pt-8 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              Atribuição: campanha → conversa → venda
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              Funil completo com ROAS real
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              Conversões offline automáticas
            </div>
          </div>
        </section>

        {/* Visual Proof */}
        <ProductPreview />

        {/* Features & Flow */}
        <FeatureGrid />

        {/* FAQ & Final CTA */}
        <FAQ />
      </main>

      <MarketingFooter />
    </div>
  );
}
