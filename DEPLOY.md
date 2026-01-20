# 🚀 Deploy do AutovendaIA no Dokploy

Este documento explica como fazer deploy do AutovendaIA no Dokploy usando Build Args.

## 📋 Visão Geral

O AutovendaIA utiliza **Build Args** para embutir as variáveis `NEXT_PUBLIC_*` diretamente no build do Next.js. Isso garante que as variáveis estejam disponíveis em tempo de build e runtime.

### Como Funciona

1. **Build**: Next.js compila com as variáveis passadas via Build Args
2. **Runtime**: Variáveis já estão embutidas no código compilado
3. **Resultado**: Aplicação funciona corretamente sem necessidade de substituição em runtime

## 🔧 Configuração no Dokploy

### Build Arguments (OBRIGATÓRIO)

Configure na aba **Build** do seu serviço no Dokploy:

```
NEXT_PUBLIC_SUPABASE_URL=https://hzsuzblmuxyjiyfkqpci.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-key-aqui
NEXT_PUBLIC_SITE_URL=https://seudominio.com
NEXT_PUBLIC_API_BASE_URL=https://api.seudominio.com
```

### Environment Variables (TAMBÉM NECESSÁRIO)

Configure também na seção **Environment** do Dokploy (para validação em runtime):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://hzsuzblmuxyjiyfkqpci.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-key-aqui
NEXT_PUBLIC_SITE_URL=https://seudominio.com
NEXT_PUBLIC_API_BASE_URL=https://api.seudominio.com
```

**⚠️ IMPORTANTE**: 
- Configure **AMBOS** Build Args E Environment Variables
- Build Args: para embutir no build do Next.js
- Environment Variables: para validação em runtime pelo entrypoint.sh
- Se não configurar Build Args, o build irá FALHAR (sem placeholders)

## 🐳 Build Local (Teste)

Para testar o build localmente:

```bash
# Build passando build args (OBRIGATÓRIO)
docker build -t autovendia \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=https://hzsuzblmuxyjiyfkqpci.supabase.co \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-key-aqui \
  --build-arg NEXT_PUBLIC_SITE_URL=http://localhost:3000 \
  --build-arg NEXT_PUBLIC_API_BASE_URL=https://api.seudominio.com \
  .

# Rodar com env vars em runtime (para validação)
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=https://hzsuzblmuxyjiyfkqpci.supabase.co \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-key-aqui \
  autovendia
```

## ✅ Verificação Pós-Deploy

### 1. Verificar Logs do Container

Ao iniciar, o container deve mostrar:

```
🚀 AutovendaIA - Iniciando aplicação...
📊 Configuração detectada:
  - SUPABASE_URL: https://h...pci
  - SUPABASE_ANON_KEY: eyJhbGci...xNzQ=
  - SITE_URL: https://seudominio.com
✅ SUPABASE_URL validada!
✅ SUPABASE_ANON_KEY validada!
🎯 Iniciando servidor Next.js...
```

**⚠️ Se aparecer warnings de placeholder**, significa que os Build Args não foram configurados corretamente!

### 2. Testar Login

1. Acesse `https://seudominio.com/login`
2. Tente fazer login com credenciais válidas
3. **NÃO** deve aparecer erro "Supabase não configurado corretamente"
4. Login deve funcionar normalmente

### 3. Verificar Console do Browser

Abra o DevTools e verifique:
- **NÃO** deve ter warnings sobre "Supabase não configurado"
- **NÃO** deve ter erros de autenticação
- Login deve redirecionar para o dashboard

## 🔍 Troubleshooting

### Erro: "Supabase não configurado corretamente"

**Causa**: Build Args não foram configurados no Dokploy.

**Solução**:
1. Verifique se os **Build Arguments** estão configurados na aba Build do Dokploy
2. Verifique se as **Environment Variables** também estão configuradas
3. Refaça o build (rebuild) para aplicar os Build Args
4. Verifique os logs do container

### Build Falha com Erro de Variáveis Ausentes

**Causa**: Build Args não foram passados e o Dockerfile não tem valores default.

**Solução**:
1. Configure os Build Arguments no Dokploy antes de buildar
2. Para build local, use `--build-arg` para todas as variáveis necessárias
3. Exemplo: `docker build --build-arg NEXT_PUBLIC_SUPABASE_URL=... -t autovendia .`

### Container Inicia mas Login Não Funciona

**Causa**: Build foi feito sem Build Args ou com valores incorretos.

**Solução**:
1. Verifique os logs do container - deve mostrar as URLs mascaradas
2. Se aparecer warnings de placeholder, refaça o build com Build Args corretos
3. Delete a imagem antiga e refaça o build completo
2. Se ainda tem "placeholder.supabase.co", o entrypoint não rodou
3. Verifique se ENTRYPOINT está correto no Dockerfile
4. Recrie o container

## 📝 Arquitetura da Solução

### Arquivos Envolvidos

1. **`Dockerfile`**
   - Define ARGs **SEM valores default** (obriga configuração)
   - Passa ARGs como ENV para o build do Next.js
   - Copia `entrypoint.sh` para validação em runtime

2. **`entrypoint.sh`**
   - Valida que env vars não estão vazias (warnings apenas)
   - Inicia servidor com `exec node server.js`

3. **`lib/supabase/client.ts`**
   - Lê diretamente de `process.env.NEXT_PUBLIC_*`
   - Usa inicialização lazy com Proxy
   - Valida e retorna stub se variáveis ausentes

4. **`app/layout.tsx`**
   - Layout simples sem lógica de injeção
   - Next.js já tem as variáveis embutidas do build

### Fluxo de Inicialização

```
1. Build: Next.js compila com Build Args → variáveis embutidas no código
2. Container inicia
3. entrypoint.sh executa e valida env vars (warnings)
4. Inicia node server.js
5. Next.js serve bundle com valores já embutidos
6. Browser acessa código com credenciais corretas
7. Supabase client conecta
```

## 🎯 Benefícios da Nova Abordagem

| Aspecto | Antes (Placeholders) | Agora (Build Args) |
|---------|----------------------|-------------------|
| Build | Sempre funcionava (placeholders) | Falha se não configurar (seguro) |
| Runtime | Substituição complexa com sed | Sem substituição (mais rápido) |
| Dokploy | Só Environment Variables | Build Args + Environment Variables |
| Manutenção | Complexa (sed, script inline) | Simples (build direto) |
| Confiabilidade | Podia buildar com placeholder | Garante build com valores reais |

## 📚 Referências

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Docker Multi-stage Builds](https://docs.docker.com/build/building/multi-stage/)
- [Dokploy Documentation](https://docs.dokploy.com/)

---

**Última atualização**: 2026-01-20 - Migração para Build Args obrigatórios
