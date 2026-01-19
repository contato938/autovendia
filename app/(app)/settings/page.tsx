'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Users, Webhook, Bell, Cable } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações da sua conta
        </p>
      </div>

      {/* Settings Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Empresa
            </CardTitle>
            <CardDescription>
              Informações da sua empresa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Em breve: Nome, logo, CNPJ, endereço, etc.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Usuários
            </CardTitle>
            <CardDescription>
              Gerencie usuários e permissões
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Em breve: Adicionar/remover usuários, definir roles (admin, gestor, vendedor).
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Webhook className="h-5 w-5" />
              Webhooks
            </CardTitle>
            <CardDescription>
              Configure webhooks para eventos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Em breve: Receba notificações em tempo real de novos leads, vendas e conversões.
            </p>
          </CardContent>
        </Card>

        <Link
          href="/integrations"
          className="block rounded-xl focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Card className="transition hover:border-foreground/20 hover:shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cable className="h-5 w-5" />
                Integrações
              </CardTitle>
              <CardDescription>
                Conecte ferramentas e fontes de dados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Gerencie integrações com CRMs, mídia e canais externos.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificações
            </CardTitle>
            <CardDescription>
              Preferências de notificação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Em breve: Email, SMS, push notifications para eventos importantes.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
