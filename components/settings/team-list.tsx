'use client';

import { useState, useEffect, useCallback } from 'react';
import { useStore } from '@/store/useStore';
import { supabase } from '@/lib/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2, Shield, ShieldCheck, User as UserIcon, Mail } from 'lucide-react';

interface TeamMember {
  user_id: string;
  role: 'admin' | 'gestor' | 'vendedor';
  joined_at: string;
  profile: {
    nome: string;
    email: string | null;
    avatar_url: string | null;
  };
}

export function TeamList() {
  const { selectedTenantId, user } = useStore();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'gestor' | 'vendedor'>('vendedor');
  const [inviting, setInviting] = useState(false);

  const fetchMembers = useCallback(async () => {
    if (!selectedTenantId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_tenants')
        .select(`
          user_id,
          role,
          created_at,
          profiles:user_id (
            nome,
            email,
            avatar_url
          )
        `)
        .eq('tenant_id', selectedTenantId);

      if (error) throw error;

      // Transform data to match interface
      const teamMembers = (data || []).map((item: any) => ({
        user_id: item.user_id,
        role: item.role,
        joined_at: item.created_at,
        profile: item.profiles || { nome: 'Usuário Desconhecido', email: null, avatar_url: null },
      }));

      setMembers(teamMembers);
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast.error('Erro ao carregar equipe.');
    } finally {
      setLoading(false);
    }
  }, [selectedTenantId]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleInvite = async () => {
    if (!inviteEmail || !selectedTenantId) return;
    
    setInviting(true);
    try {
      // 1. Check if user exists by email
      const { data: userId, error: lookupError } = await supabase.rpc('get_user_id_by_email', {
        email_input: inviteEmail,
      });

      if (lookupError) {
        throw new Error('Erro ao buscar usuário: ' + lookupError.message);
      }

      if (!userId) {
        toast.error('Usuário não encontrado com este email. Peça para ele se cadastrar primeiro.');
        return;
      }

      // 2. Check if already in team
      const existingMember = members.find(m => m.user_id === userId);
      if (existingMember) {
        toast.error('Este usuário já faz parte da equipe.');
        return;
      }

      // 3. Add to user_tenants
      const { error: insertError } = await supabase
        .from('user_tenants')
        .insert({
          user_id: userId,
          tenant_id: selectedTenantId,
          role: inviteRole,
        });

      if (insertError) throw insertError;

      toast.success('Membro adicionado com sucesso!');
      setInviteOpen(false);
      setInviteEmail('');
      fetchMembers();
    } catch (error) {
      console.error('Error adding member:', error);
      toast.error('Erro ao adicionar membro.');
    } finally {
      setInviting(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!confirm('Tem certeza que deseja remover este membro da equipe?')) return;
    if (!selectedTenantId) return;

    try {
      const { error } = await supabase
        .from('user_tenants')
        .delete()
        .eq('user_id', userId)
        .eq('tenant_id', selectedTenantId);

      if (error) throw error;

      toast.success('Membro removido.');
      fetchMembers();
    } catch (error) {
      console.error('Error removing member:', error);
      toast.error('Erro ao remover membro.');
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    if (!selectedTenantId) return;

    try {
      const { error } = await supabase
        .from('user_tenants')
        .update({ role: newRole })
        .eq('user_id', userId)
        .eq('tenant_id', selectedTenantId);

      if (error) throw error;

      toast.success('Função atualizada.');
      fetchMembers();
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Erro ao atualizar função.');
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">Membros da Equipe</h2>
          <p className="text-sm text-muted-foreground">
            Gerencie quem tem acesso a esta conta e suas permissões.
          </p>
        </div>
        
        {isAdmin && (
          <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Membro
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Membro</DialogTitle>
                <DialogDescription>
                  Adicione um novo membro à sua equipe. O usuário já deve ter uma conta no sistema.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="email">Email do Usuário</label>
                  <Input
                    id="email"
                    placeholder="email@exemplo.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <label>Função</label>
                  <Select value={inviteRole} onValueChange={(v: any) => setInviteRole(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vendedor">Vendedor</SelectItem>
                      <SelectItem value="gestor">Gestor</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setInviteOpen(false)}>Cancelar</Button>
                <Button onClick={handleInvite} disabled={inviting}>
                  {inviting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Adicionar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Membro</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Adicionado em</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : members.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  Nenhum membro encontrado.
                </TableCell>
              </TableRow>
            ) : (
              members.map((member) => (
                <TableRow key={member.user_id}>
                  <TableCell className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={member.profile.avatar_url || ''} />
                      <AvatarFallback>
                        {member.profile.nome?.substring(0, 2).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{member.profile.nome}</span>
                      <span className="text-xs text-muted-foreground">{member.profile.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {isAdmin && member.user_id !== user?.id ? (
                      <Select 
                        defaultValue={member.role} 
                        onValueChange={(v) => handleUpdateRole(member.user_id, v)}
                      >
                        <SelectTrigger className="w-[130px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vendedor">Vendedor</SelectItem>
                          <SelectItem value="gestor">Gestor</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant="outline" className="capitalize">
                        {member.role === 'admin' && <ShieldCheck className="mr-1 h-3 w-3 text-primary" />}
                        {member.role === 'gestor' && <Shield className="mr-1 h-3 w-3 text-blue-500" />}
                        {member.role === 'vendedor' && <UserIcon className="mr-1 h-3 w-3 text-gray-500" />}
                        {member.role}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(member.joined_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right">
                    {isAdmin && member.user_id !== user?.id && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleRemoveMember(member.user_id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
