'use client';

import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AvatarUpload } from '@/components/account/AvatarUpload';
import { ProfileForm } from '@/components/account/ProfileForm';
import { PasswordSection } from '@/components/account/PasswordSection';
import { accountService } from '@/services/account';
import { supabase } from '@/lib/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User, Shield } from 'lucide-react';

export default function AccountPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      setUserEmail(session.user.email || null);
      setIsCheckingAuth(false);
    };
    checkAuth();
  }, [router]);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['account', 'profile'],
    queryFn: () => accountService.getProfile(),
    enabled: !isCheckingAuth,
  });

  if (isCheckingAuth) {
    return (
      <div className="p-6">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-96 mb-8" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Conta</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais e configurações de segurança
        </p>
      </div>

      {/* Email e Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informações da Conta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-sm font-medium">{userEmail || 'Não disponível'}</p>
            </div>
            {profile && (
              <div>
                <p className="text-sm text-muted-foreground">Função</p>
                <p className="text-sm font-medium capitalize">{profile.role || 'Não definida'}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Segurança
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Foto de Perfil</CardTitle>
              <CardDescription>
                Adicione uma foto para que outros usuários possam reconhecê-lo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AvatarUpload
                currentAvatarUrl={profile?.avatar_url}
                userName={profile?.nome || 'Usuário'}
                userId={profile?.id || ''}
              />
            </CardContent>
          </Card>

          <ProfileForm profile={profile} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <PasswordSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
