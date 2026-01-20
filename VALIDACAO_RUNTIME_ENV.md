# ✅ Validação Runtime Env (Pós-Deploy)

Este documento explica como validar que a solução de runtime env está funcionando corretamente após o deploy no Dokploy.

## 🎯 O que foi implementado

Mudamos de "substituir placeholders no bundle buildado" (instável) para **runtime env via endpoint dinâmico**:

1. **`/api/runtime-env`**: endpoint Next.js que retorna JavaScript com `window.__SUPABASE_ENV__` lendo env vars do servidor em **runtime** (sem cache)
2. **`app/layout.tsx`**: carrega `/api/runtime-env` via `<Script src>` antes de qualquer código
3. **`entrypoint.sh`**: apenas valida env e exporta `SUPABASE_URL`/`SUPABASE_ANON_KEY` (sem mais `sed` no bundle)

## 📋 Checklist de Validação

### 1. Confirmar env vars no Dokploy

No Dokploy, **Environment Variables** do serviço, você deve ter:

```env
SUPABASE_URL=https://<seu-project-ref>.supabase.co
SUPABASE_ANON_KEY=<sua-anon-key>
```

**Ou** (fallback):

```env
NEXT_PUBLIC_SUPABASE_URL=https://<seu-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<sua-anon-key>
```

### 2. Rebuild + Redeploy

- Rebuildar a imagem (precisa pegar as mudanças no código)
- Recreate/redeploy do container

### 3. Verificar logs do container

Deve aparecer:

```
🚀 AutovendaIA - Iniciando aplicação...
📊 Configuração detectada:
  - SUPABASE_URL: https://...
  - SUPABASE_ANON_KEY: eyJhbGci...
  - SITE_URL: ...
✅ Env vars validadas!
🎯 Iniciando servidor Next.js...
```

**NÃO** deve ter linhas de `🔄 Substituindo placeholders...` (não fazemos mais sed).

### 4. Validar no browser (console)

Abra o site → F12 (DevTools) → Console → execute:

```javascript
// 1. Verificar se window.__SUPABASE_ENV__ foi injetado
console.log(window.__SUPABASE_ENV__);

// Deve retornar:
// { url: "https://<seu-project-ref>.supabase.co", anonKey: "eyJhbGci..." }
```

**NÃO** deve ter `placeholder.supabase.co` nem `placeholder-anon-key`.

### 5. Verificar chamadas de rede (Network)

Na aba **Network** do DevTools:

1. Filtrar por "runtime-env"
2. Deve aparecer uma chamada para `/api/runtime-env` com:
   - Status: `200 OK`
   - Type: `script`
   - Headers: `Cache-Control: no-store`

3. Clicar na chamada → Response → deve mostrar JavaScript:
   ```javascript
   window.__SUPABASE_ENV__ = {"url":"https://...","anonKey":"eyJhbGci..."};
   ```

### 6. Testar login

1. Ir para `/login`
2. Preencher email/senha
3. Na aba **Network**, ao clicar "Entrar", **NÃO** deve aparecer nenhuma chamada para `placeholder.supabase.co`
4. Deve aparecer chamada para `https://<seu-project-ref>.supabase.co/auth/v1/token?grant_type=password`

## ❌ Troubleshooting

### Erro: `window.__SUPABASE_ENV__` é `undefined`

**Causa**: O endpoint `/api/runtime-env` não foi carregado ou falhou.

**Solução**:
1. Abrir DevTools → Network
2. Verificar se `/api/runtime-env` aparece e qual o status
3. Se 404: rebuild não pegou o arquivo `app/api/runtime-env/route.ts`
4. Se 500: verificar logs do servidor

### Erro: `window.__SUPABASE_ENV__` tem `url: ""` ou `anonKey: ""`

**Causa**: Env vars não estão setadas no Dokploy ou ainda com placeholder.

**Solução**:
1. Verificar no Dokploy → Environment Variables
2. Garantir que `SUPABASE_URL` ou `NEXT_PUBLIC_SUPABASE_URL` está correta
3. Redeploy/recreate do container

### Erro: Login ainda tenta chamar `placeholder.supabase.co`

**Causa**: Algum chunk buildado ainda tem placeholder embutido (cache agressivo).

**Solução**:
1. Hard refresh no browser: `Ctrl+Shift+R` (Windows/Linux) ou `Cmd+Shift+R` (Mac)
2. Limpar cache do site: DevTools → Application → Clear site data
3. Se persistir: verificar que `/api/runtime-env` retorna valores corretos

### Container não inicia (Bad Gateway)

**Causa**: Validação no entrypoint.sh detectou placeholder ou env vazia.

**Solução**:
1. Verificar logs do container (antes de crashar)
2. Se aparecer `❌ ERRO: SUPABASE_URL não configurada`, env vars não chegaram no container
3. Verificar configuração no Dokploy e recreate

## 🎉 Sucesso

Se todos os checks passaram:
- ✅ `window.__SUPABASE_ENV__` tem URL e anonKey reais
- ✅ Login chama `https://<seu-project-ref>.supabase.co`
- ✅ Não aparece `placeholder.supabase.co` em lugar nenhum

A autenticação deve funcionar normalmente!

---

**Data**: 2026-01-20
