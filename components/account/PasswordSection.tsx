'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { accountService } from '@/services/account';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase/client';
import { Mail } from 'lucide-react';

export function PasswordSection() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserEmail(user?.email || null);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Preencha todos os campos');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (newPassword.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsSubmitting(true);
    try {
      await accountService.changePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Senha alterada com sucesso!');
    } catch (error: any) {
      setError(error.message || 'Erro ao alterar senha');
      toast.error(error.message || 'Erro ao alterar senha');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendResetEmail = async () => {
    if (!userEmail) {
      toast.error('Email não encontrado');
      return;
    }

    setIsSendingReset(true);
    try {
      await accountService.sendPasswordResetEmail();
      toast.success('Email de redefinição enviado! Verifique sua caixa de entrada.');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao enviar email');
    } finally {
      setIsSendingReset(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Alterar Senha</CardTitle>
          <CardDescription>
            Use sua senha atual para definir uma nova senha
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
              <Label htmlFor="currentPassword">Senha atual *</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Digite sua senha atual"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">Nova senha *</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite a nova senha"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar nova senha *</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme a nova senha"
                disabled={isSubmitting}
              />
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Alterando...' : 'Alterar senha'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Redefinir Senha por Email</CardTitle>
          <CardDescription>
            Não lembra sua senha? Enviaremos um link de redefinição para seu email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userEmail && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>Email: {userEmail}</span>
              </div>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={handleSendResetEmail}
              disabled={isSendingReset || !userEmail}
            >
              {isSendingReset ? 'Enviando...' : 'Enviar email de redefinição'}
            </Button>
            <p className="text-xs text-muted-foreground">
              Um link de redefinição será enviado para seu email. Verifique sua caixa de entrada e spam.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
