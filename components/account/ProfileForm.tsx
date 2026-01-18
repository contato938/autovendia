'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { accountService } from '@/services/account';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

interface ProfileFormProps {
  profile: {
    nome: string;
    phone?: string | null;
    company_name?: string | null;
  } | null;
  isLoading?: boolean;
}

export function ProfileForm({ profile, isLoading }: ProfileFormProps) {
  const [nome, setNome] = useState('');
  const [phone, setPhone] = useState('');
  const [company_name, setCompanyName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const queryClient = useQueryClient();

  useEffect(() => {
    if (profile) {
      setNome(profile.nome || '');
      setPhone(profile.phone || '');
      setCompanyName(profile.company_name || '');
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nome.trim()) {
      setError('Nome é obrigatório');
      return;
    }

    setIsSubmitting(true);
    try {
      await accountService.updateProfile({
        nome: nome.trim(),
        phone: phone.trim() || null,
        company_name: company_name.trim() || null,
      });

      // Invalidar cache
      queryClient.invalidateQueries({ queryKey: ['account', 'profile'] });
      
      toast.success('Perfil atualizado com sucesso!');
    } catch (error: any) {
      setError(error.message || 'Erro ao atualizar perfil');
      toast.error(error.message || 'Erro ao atualizar perfil');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Pessoais</CardTitle>
        <CardDescription>
          Atualize suas informações de perfil
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="nome">Nome completo *</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Seu nome completo"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(11) 99999-9999"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company_name">Empresa</Label>
            <Input
              id="company_name"
              value={company_name}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Nome da sua empresa (opcional)"
              disabled={isSubmitting}
            />
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
