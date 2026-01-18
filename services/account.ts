import { supabase } from '@/lib/supabase/client';
import type { TablesUpdate } from '@/types/database';

export type ProfileUpdate = TablesUpdate<'profiles'>;

export const accountService = {
  /**
   * Busca o perfil do usuário atual
   */
  getProfile: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Atualiza o perfil do usuário atual
   */
  updateProfile: async (updates: ProfileUpdate) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Faz upload de avatar para o Supabase Storage
   * @param file Arquivo de imagem
   * @returns URL pública do avatar
   */
  uploadAvatar: async (file: File): Promise<string> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    // Validar tipo de arquivo
    const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Tipo de arquivo inválido. Use PNG, JPEG ou WebP.');
    }

    // Validar tamanho (2MB máximo)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      throw new Error('Arquivo muito grande. Tamanho máximo: 2MB.');
    }

    // Gerar nome do arquivo: {user.id}/avatar-{timestamp}.{ext}
    const ext = file.name.split('.').pop() || 'png';
    const timestamp = Date.now();
    const fileName = `${user.id}/avatar-${timestamp}.${ext}`;

    // Upload para o bucket avatars
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false, // Não sobrescrever, criar novo arquivo
      });

    if (uploadError) throw uploadError;

    // Obter URL pública
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(uploadData.path);

    return urlData.publicUrl;
  },

  /**
   * Remove o avatar do usuário
   */
  removeAvatar: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    // Buscar avatar atual
    const { data: profile } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', user.id)
      .single();

    // Limpar avatar_url no perfil
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: null, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (updateError) throw updateError;

    // Tentar deletar arquivo antigo se existir
    if (profile?.avatar_url) {
      // Extrair path do URL (ex: avatars/user-id/avatar-123.png)
      const urlPath = profile.avatar_url.split('/avatars/')[1];
      if (urlPath) {
        await supabase.storage
          .from('avatars')
          .remove([urlPath])
          .catch(() => {
            // Ignorar erro se arquivo não existir
          });
      }
    }
  },

  /**
   * Troca a senha do usuário após reautenticação
   */
  changePassword: async (currentPassword: string, newPassword: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) throw new Error('Email não encontrado');

    // Reautenticar com senha atual
    const { error: reauthError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (reauthError) {
      throw new Error('Senha atual incorreta');
    }

    // Atualizar senha
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) throw updateError;
  },

  /**
   * Envia email de reset de senha
   */
  sendPasswordResetEmail: async (redirectTo?: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) throw new Error('Email não encontrado');

    const redirectUrl = redirectTo || `${window.location.origin}/reset`;
    
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: redirectUrl,
    });

    if (error) throw error;
  },
};
