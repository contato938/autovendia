# 🚀 Deploy do AutovendaIA no Dokploy

Este documento explica como fazer deploy do AutovendaIA no Dokploy com substituição de variáveis em runtime.

## 📋 Visão Geral

O AutovendaIA utiliza uma estratégia de **placeholders no build** + **substituição em runtime** para variáveis `NEXT_PUBLIC_*`. Isso permite que o Docker build funcione sem depender de Build Args, e as variáveis reais sejam injetadas quando o container inicia.

### Como Funciona

1. **Build**: Next.js compila com placeholders (valores fake)
2. **Runtime**: Script `entrypoint.sh` substitui placeholders pelos valores reais das env vars
3. **Resultado**: Aplicação roda com as credenciais corretas do Supabase

## 🔧 Configuração no Dokploy

### Variáveis de Ambiente Obrigatórias

Configure as seguintes variáveis na seção **Environment** do Dokploy:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-key-aqui
```

### Variáveis Opcionais

```bash
NEXT_PUBLIC_SITE_URL=https://seudominio.com
NEXT_PUBLIC_API_BASE_URL=https://api.seudominio.com
```

**⚠️ IMPORTANTE**: 
- Configure apenas **Environment Variables** (runtime)
- **NÃO** precisa configurar Build Args
- As variáveis serão automaticamente injetadas no container

## 🐳 Build Local (Teste)

Para testar o build localmente:

```bash
# Build sem passar build args
docker build -t autovendia .

# Rodar com env vars em runtime
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-key-aqui \
  autovendia
```

## ✅ Verificação Pós-Deploy

### 1. Verificar Logs do Container

Ao iniciar, o container deve mostrar:

```
🚀 AutovendaIA - Iniciando aplicação...
📊 Configuração detectada:
  - SUPABASE_URL: https://s...y89g
  - SUPABASE_ANON_KEY: eyJhbGci...xNzQ=
  - SITE_URL: https://seudominio.com
🔄 Substituindo placeholders no bundle Next.js...
✅ Placeholders substituídos com sucesso!
🎯 Iniciando servidor Next.js...
```

### 2. Verificar Placeholders Foram Substituídos

Entre no container e verifique:

```bash
# Entrar no container
docker exec -it <container-id> sh

# Não deve existir placeholders nos arquivos
grep -r "placeholder.supabase.co" /app/.next
grep -r "placeholder-anon-key" /app/.next

# Deve retornar vazio (nenhum resultado)
```

### 3. Testar Login

1. Acesse `https://seudominio.com/login`
2. Tente fazer login com credenciais válidas
3. **NÃO** deve aparecer erro "Supabase env vars ausentes"
4. Login deve funcionar normalmente

## 🔍 Troubleshooting

### Erro: "Supabase env vars ausentes"

**Causa**: Variáveis não foram configuradas no Dokploy ou ainda estão com placeholders.

**Solução**:
1. Verifique se as variáveis estão na seção Environment do Dokploy
2. Refaça o deploy para aplicar as mudanças
3. Verifique os logs do container

### Build Falha

**Causa**: Build sempre deve funcionar, usa placeholders.

**Solução**:
1. Verifique se o arquivo `entrypoint.sh` existe na raiz
2. Verifique permissões: `chmod +x entrypoint.sh`
3. Refaça build: `docker build -t autovendia .`

### Container Inicia mas Login Não Funciona

**Causa**: Placeholders não foram substituídos corretamente.

**Solução**:
1. Entre no container e verifique `/app/.next`
2. Se ainda tem "placeholder.supabase.co", o entrypoint não rodou
3. Verifique se ENTRYPOINT está correto no Dockerfile
4. Recrie o container

## 📝 Arquitetura da Solução

### Arquivos Envolvidos

1. **`Dockerfile`**
   - Define placeholders nos ARGs do builder
   - Copia `entrypoint.sh` para o runner
   - Usa ENTRYPOINT ao invés de CMD

2. **`entrypoint.sh`**
   - Valida que env vars não estão vazias
   - Substitui placeholders no bundle Next.js
   - Inicia servidor com `exec node server.js`

3. **`lib/supabase/client.ts`**
   - Usa inicialização lazy com Proxy
   - Tenta ler de `window.__SUPABASE_ENV__` primeiro
   - Fallback para `process.env`

4. **`app/layout.tsx`**
   - Injeta variáveis no `window` via Script
   - Garante disponibilidade no browser

### Fluxo de Inicialização

```
1. Container inicia
2. entrypoint.sh executa
3. Valida env vars (erro se vazias)
4. Substitui placeholders em /app/.next
5. Inicia node server.js
6. Next.js serve bundle com valores reais
7. Browser recebe credenciais corretas
8. Supabase client conecta
```

## 🎯 Diferenças vs Abordagem Anterior

| Aspecto | Antes | Agora |
|---------|-------|-------|
| Build | Dependia de Build Args | Usa placeholders |
| Runtime | ENV não funcionava | Substituição em runtime |
| Dokploy | Precisava Build Args | Só Environment Variables |
| Manutenção | Complexa (proxy, lazy) | Simples (substituição direta) |

## 📚 Referências

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Docker Multi-stage Builds](https://docs.docker.com/build/building/multi-stage/)
- [Dokploy Documentation](https://docs.dokploy.com/)

---

**Última atualização**: 2026-01-18
