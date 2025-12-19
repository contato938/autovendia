# 🐳 Configuração Docker - AutoVendia

## 📦 Arquivos Criados

Este documento resume todos os arquivos de configuração Docker criados para o projeto AutoVendia.

### Arquivos Principais

#### 1. `Dockerfile`

- **Propósito**: Build da imagem Docker otimizada para produção
- **Características**:
  - Multi-stage build (deps → builder → runner)
  - Output standalone do Next.js
  - Imagem final < 200MB
  - Execução como usuário não-root
  - Node.js 20 Alpine

#### 2. `docker-compose.yml`

- **Propósito**: Orquestração dos containers para produção
- **Características**:
  - Configuração de portas (3000)
  - Variáveis de ambiente
  - Health checks
  - Restart policy
  - Network isolation

#### 3. `docker-compose.dev.yml`

- **Propósito**: Ambiente de desenvolvimento com hot reload
- **Características**:
  - Volumes montados para live editing
  - Modo development
  - Sem rebuild necessário para mudanças de código

#### 4. `.dockerignore`

- **Propósito**: Otimizar build excluindo arquivos desnecessários
- **Exclui**: node_modules, .git, .next, logs, etc.

#### 5. `docker.sh`

- **Propósito**: Script auxiliar para comandos Docker comuns
- **Comandos disponíveis**:
  - `./docker.sh build` - Construir imagem
  - `./docker.sh start` - Iniciar aplicação
  - `./docker.sh stop` - Parar aplicação
  - `./docker.sh restart` - Reiniciar aplicação
  - `./docker.sh logs` - Ver logs
  - `./docker.sh status` - Status dos containers
  - `./docker.sh clean` - Limpar recursos
  - `./docker.sh rebuild` - Reconstruir e reiniciar
  - `./docker.sh shell` - Abrir shell no container
  - `./docker.sh help` - Ajuda

#### 6. `.env.example`

- **Propósito**: Template de variáveis de ambiente
- **Uso**: Copiar para `.env.production` e preencher valores

#### 7. `README_DOCKER.md`

- **Propósito**: Documentação completa sobre Docker
- **Conteúdo**:
  - Pré-requisitos
  - Como usar
  - Comandos úteis
  - Deploy em produção
  - Troubleshooting

#### 8. `.github/workflows/docker-build.yml`

- **Propósito**: CI/CD com GitHub Actions
- **Características**:
  - Build automático em push
  - Push para Docker Hub
  - Cache otimizado
  - Tags automáticos

### Arquivos Modificados

#### 9. `next.config.ts`

- **Mudança**: Adicionado `output: 'standalone'`
- **Motivo**: Necessário para Docker funcionar corretamente

#### 10. `.gitignore`

- **Mudanças**:
  - Adicionado `!.env.example` (para incluir no Git)
  - Adicionado `.env.production` (para ignorar)
  - Adicionado `docker-compose.override.yml`

#### 11. `README.md`

- **Mudança**: Adicionada seção "Como Executar" com Docker
- **Conteúdo**: Instruções rápidas e link para README_DOCKER.md

## 🚀 Início Rápido

### Produção

```bash
docker-compose up -d
```

### Desenvolvimento

```bash
docker-compose -f docker-compose.dev.yml up
```

### Com script auxiliar

```bash
chmod +x docker.sh
./docker.sh start
```

## 📊 Estrutura de Arquivos Docker

```
autovendia/
├── Dockerfile                          # Imagem de produção
├── docker-compose.yml                  # Orquestração produção
├── docker-compose.dev.yml              # Orquestração desenvolvimento
├── .dockerignore                       # Exclusões de build
├── docker.sh                           # Script auxiliar
├── .env.example                        # Template de env vars
├── README_DOCKER.md                    # Documentação Docker
├── .github/
│   └── workflows/
│       └── docker-build.yml            # CI/CD
└── next.config.ts                      # (modificado) output standalone
```

## ✅ Checklist de Deploy

- [ ] Copiar `.env.example` para `.env.production`
- [ ] Preencher variáveis de ambiente em `.env.production`
- [ ] Executar `docker-compose up --build`
- [ ] Verificar logs com `docker-compose logs -f`
- [ ] Acessar http://localhost:3000
- [ ] Configurar secrets no GitHub (para CI/CD)
  - [ ] `DOCKER_USERNAME`
  - [ ] `DOCKER_PASSWORD`

## 🔐 Configuração GitHub Actions (Opcional)

Para habilitar CI/CD automático:

1. Ir em Settings → Secrets → Actions
2. Adicionar secrets:
   - `DOCKER_USERNAME`: Seu usuário Docker Hub
   - `DOCKER_PASSWORD`: Seu token Docker Hub
3. Push para branch main/master
4. GitHub Actions fará build e push automaticamente

## 📈 Próximos Passos

1. Testar build local
2. Configurar variáveis de ambiente
3. Deploy em servidor de produção
4. Configurar CI/CD (opcional)
5. Monitoramento e logs (opcional)

## 🆘 Suporte

Para problemas ou dúvidas, consulte:

- [README_DOCKER.md](README_DOCKER.md) - Documentação completa
- [Documentação Next.js](https://nextjs.org/docs/deployment#docker-image)
- [Documentação Docker](https://docs.docker.com/)

---

**Última atualização**: 2025-12-19
