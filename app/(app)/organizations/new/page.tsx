'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase/client';
import { ArrowLeft } from 'lucide-react';

export default function NewOrganizationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Usuário não autenticado');
        return;
      }

      // Create tenant
      const { data: tenant, error: tenantError } = await supabase
        .from('tenants')
        .insert({
          nome: formData.nome,
          cnpj: formData.cnpj || null,
        })
        .select()
        .single();

      if (tenantError) throw tenantError;

      // Link user to tenant
      const { error: linkError } = await supabase
        .from('user_tenants')
        .insert({
          user_id: user.id,
          tenant_id: tenant.id,
          role: 'admin',
        });

      if (linkError) throw linkError;

      toast.success('Organização criada com sucesso!');
      
      // Redirect back to dashboard
      router.push('/dashboard');
      router.refresh();
    } catch (error: any) {
      console.error('Error creating organization:', error);
      toast.error(error.message || 'Erro ao criar organização');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Adicionar Nova Organização</CardTitle>
            <CardDescription>
              Crie uma nova organização para começar a gerenciar suas campanhas e leads.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Organização *</Label>
                <Input
                  id="nome"
                  placeholder="Ex: Minha Empresa Ltda"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ (opcional)</Label>
                <Input
                  id="cnpj"
                  placeholder="00.000.000/0000-00"
                  value={formData.cnpj}
                  onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  Você pode adicionar o CNPJ agora ou depois nas configurações.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={loading}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !formData.nome}
                  className="flex-1"
                >
                  {loading ? 'Criando...' : 'Criar Organização'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800">
          <CardHeader>
            <CardTitle className="text-base">Por que preciso de uma organização?</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              Organizações permitem que você:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Gerencie múltiplas empresas separadamente</li>
              <li>Mantenha dados isolados e seguros</li>
              <li>Convide membros da equipe</li>
              <li>Configure integrações específicas</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
