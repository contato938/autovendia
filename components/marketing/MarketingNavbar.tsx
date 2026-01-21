import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BrandLogo } from '@/components/brand/BrandLogo';

export function MarketingNavbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <BrandLogo variant="horizontal" mode="light" className="h-7 w-[170px]" />
          <span className="sr-only">AUTOVEND IA</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="#como-funciona" className="hover:text-primary transition-colors">
            Como funciona
          </Link>
          <Link href="#recursos" className="hover:text-primary transition-colors">
            Recursos
          </Link>
          <Link href="#faq" className="hover:text-primary transition-colors">
            FAQ
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
              Entrar
            </Button>
          </Link>
          <Link href="/login">
            <Button size="sm">Começar agora</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
