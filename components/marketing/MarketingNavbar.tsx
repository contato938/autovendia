import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function MarketingNavbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-xl font-bold text-white">A</span>
          </div>
          <span className="text-xl font-bold text-primary">AutovendaIA</span>
        </div>

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
