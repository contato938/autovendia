# Configuração da Área de Conta do Usuário

Este documento descreve os passos necessários para configurar a área de conta do usuário no AutovendaIA.

## 📋 Pré-requisitos

- Projeto Supabase configurado e funcionando
- Acesso ao Supabase Dashboard ou MCP Supabase

## 🔧 Passos de Configuração

### 1. Aplicar Migration SQL

Execute o arquivo `migration_account_profile.sql` no Supabase:

**Opção A: Via Supabase Dashboard**
1. Acesse o Supabase Dashboard → SQL Editor
2. Cole o conteúdo de `migration_account_profile.sql`
3. Execute a query

**Opção B: Via MCP Supabase**
```bash
# Use o MCP Supabase para aplicar a migration
```

A migration irá:
- ✅ Adicionar campos `phone` e `company_name` na tabela `profiles`
- ✅ Criar políticas RLS para o bucket `avatars` (se o bucket existir)

### 2. Criar Bucket de Avatares

No Supabase Dashboard:

1. Vá em **Storage** → **Buckets**
2. Clique em **New bucket**
3. Configure:
   - **Name**: `avatars`
   - **Public bucket**: ✅ (marcado para URLs públicas)
   - **File size limit**: 2MB (ou conforme necessário)
   - **Allowed MIME types**: `image/png,image/jpeg,image/webp`

4. Após criar o bucket, as políticas RLS criadas pela migration já estarão ativas

### 3. Verificar Políticas RLS

As políticas de Storage devem permitir:
- ✅ SELECT: usuários podem ver seus próprios avatares
- ✅ INSERT: usuários podem fazer upload de seus próprios avatares
- ✅ UPDATE: usuários podem atualizar seus próprios avatares
- ✅ DELETE: usuários podem deletar seus próprios avatares

As políticas usam o padrão: `(storage.foldername(name))[1] = auth.uid()::text`

### 4. Testar Funcionalidades

Após a configuração, teste:

1. **Acesse `/account`** no app
2. **Upload de Avatar**:
   - Clique em "Alterar foto"
   - Selecione uma imagem (PNG, JPEG ou WebP, máximo 2MB)
   - Verifique se o avatar aparece após o upload
3. **Editar Perfil**:
   - Preencha nome, telefone e empresa
   - Salve e verifique se os dados persistem
4. **Trocar Senha**:
   - Preencha senha atual e nova senha
   - Verifique se a troca funciona
5. **Reset por Email**:
   - Clique em "Enviar email de redefinição"
   - Verifique se o email é enviado

## 📁 Arquivos Criados

### Componentes
- `components/account/AvatarUpload.tsx` - Upload e preview de avatar
- `components/account/ProfileForm.tsx` - Formulário de edição de perfil
- `components/account/PasswordSection.tsx` - Troca de senha e reset por email

### Services
- `services/account.ts` - Service para gerenciar perfil e senha

### Páginas
- `app/(app)/account/page.tsx` - Página principal da conta com tabs

### Migrations
- `migration_account_profile.sql` - SQL para adicionar campos e políticas

## 🔐 Segurança

- ✅ RLS habilitado nas políticas de Storage
- ✅ Usuários só podem acessar seus próprios avatares
- ✅ Reautenticação obrigatória para trocar senha
- ✅ Validação de tipos e tamanhos de arquivo
- ✅ Isolamento por `auth.uid()`

## 🐛 Troubleshooting

### Avatar não aparece após upload
- Verifique se o bucket `avatars` existe e está público
- Verifique as políticas RLS do Storage
- Verifique se o `avatar_url` está sendo salvo no perfil

### Erro ao trocar senha
- Verifique se a senha atual está correta
- Verifique se a nova senha tem pelo menos 6 caracteres
- Verifique os logs do Supabase Auth

### Email de reset não chega
- Verifique a configuração de email do Supabase
- Verifique a pasta de spam
- Verifique se o email está correto no perfil

## 📝 Notas

- Os campos `phone` e `company_name` são opcionais
- O avatar é armazenado em `avatars/{user_id}/avatar-{timestamp}.{ext}`
- A URL pública do avatar é salva em `profiles.avatar_url`
- O componente AvatarUpload sincroniza automaticamente com o perfil via React Query
