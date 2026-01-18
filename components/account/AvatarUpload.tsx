'use client';

import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { accountService } from '@/services/account';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

interface AvatarUploadProps {
  currentAvatarUrl?: string | null;
  userName: string;
  userId: string;
}

export function AvatarUpload({ currentAvatarUrl, userName, userId }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  // Sincronizar previewUrl com currentAvatarUrl quando mudar
  useEffect(() => {
    setPreviewUrl(currentAvatarUrl || null);
  }, [currentAvatarUrl]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo
    const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Tipo de arquivo inválido. Use PNG, JPEG ou WebP.');
      return;
    }

    // Validar tamanho (2MB)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Arquivo muito grande. Tamanho máximo: 2MB.');
      return;
    }

    // Preview local
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    setUploading(true);
    try {
      const avatarUrl = await accountService.uploadAvatar(file);
      
      // Atualizar perfil
      await accountService.updateProfile({ avatar_url: avatarUrl });
      
      // Invalidar cache
      queryClient.invalidateQueries({ queryKey: ['account', 'profile'] });
      
      toast.success('Avatar atualizado com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer upload do avatar');
      setPreviewUrl(currentAvatarUrl || null); // Reverter preview
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = async () => {
    setUploading(true);
    try {
      await accountService.removeAvatar();
      setPreviewUrl(null);
      
      // Invalidar cache
      queryClient.invalidateQueries({ queryKey: ['account', 'profile'] });
      
      toast.success('Avatar removido com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao remover avatar');
    } finally {
      setUploading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-24 w-24">
        {previewUrl ? (
          <AvatarImage src={previewUrl} alt={userName} />
        ) : null}
        <AvatarFallback className="text-lg">
          {getInitials(userName)}
        </AvatarFallback>
      </Avatar>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <Upload className="h-4 w-4" />
          {uploading ? 'Enviando...' : 'Alterar foto'}
        </Button>

        {previewUrl && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRemove}
            disabled={uploading}
          >
            <X className="h-4 w-4" />
            Remover
          </Button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      <p className="text-xs text-muted-foreground text-center max-w-xs">
        PNG, JPEG ou WebP. Máximo 2MB.
      </p>
    </div>
  );
}
