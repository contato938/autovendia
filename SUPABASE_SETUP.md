# Configuração do Ambiente

## Variáveis de Ambiente Necessárias

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://hzsuzblmuxyjiyfkqpci.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6c3V6YmxtdXh5aml5ZmtxcGNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3NzAwODcsImV4cCI6MjA4NDM0NjA4N30.8L0D2EyllQdzNBuBA7TVSHYtLLW3_Occ4_v8zue2qNk
```

## Extensões Supabase Instaladas

O projeto usa as seguintes extensões PostgreSQL:
- **pgcrypto**: funções criptográficas
- **uuid-ossp**: geração de UUIDs
- **pg_stat_statements**: monitoramento de queries
- **supabase_vault**: armazenamento seguro de secrets
- **pg_graphql**: suporte GraphQL (opcional)

## Próximos Passos

1. Copie as variáveis acima para `.env.local`
2. Execute `npm install` para instalar dependências
3. Execute `npm run dev` para iniciar o servidor de desenvolvimento
