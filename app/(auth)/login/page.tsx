'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { BrandLogo } from '@/components/brand/BrandLogo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          router.replace('/dashboard');
        }
      } catch (error) {
        // Only log in development to prevent credential leaks
        if (process.env.NODE_ENV === 'development') {
          console.error('Error checking session:', error);
        }
      } finally {
        setCheckingSession(false);
      }
    };

    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        toast.success('Login realizado com sucesso!');
        router.replace('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
      toast.error('Falha na autenticação');
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-background to-muted p-4">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-5xl items-center">
        <div className="grid w-full gap-8 md:grid-cols-2 md:items-stretch">
          {/* Painel de marca (marketing) */}
          <div className="hidden md:flex flex-col justify-center rounded-2xl border bg-card p-10 shadow-sm relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 opacity-10">
              <BrandLogo variant="symbol" mode="light" className="h-48 w-48" />
            </div>
            <BrandLogo variant="vertical" mode="light" className="h-40 w-40" />
            <h1 className="mt-8 type-h3 text-primary">
              Clique → WhatsApp → Venda, com atribuição real.
            </h1>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Conecte Google Ads, rastreie a origem do lead e envie conversões offline para o algoritmo otimizar pelo que importa: venda.
            </p>
            <div className="mt-6 grid gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Funil completo e ROAS real
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Conversões offline automáticas
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Visão operacional do atendimento
              </div>
            </div>
          </div>

          {/* Card de login */}
          <div className="flex items-center">
            <Card className="w-full max-w-md shadow-xl mx-auto">
              <CardHeader className="space-y-1 text-center">
                <div className="flex justify-center mb-6">
                  <BrandLogo variant="horizontal" mode="light" className="h-12 w-48" />
                </div>
                <CardDescription>Atribuição completa do clique à venda. Maximize seu ROAS com dados reais.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      autoComplete="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      autoComplete="current-password"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Link
                      href="/reset"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Esqueci minha senha
                    </Link>
                  </div>
                  {error && (
                    <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                      {error}
                    </div>
                  )}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Entrando...
                      </>
                    ) : (
                      'Entrar'
                    )}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Link 
                  href="/" 
                  className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para o site
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
