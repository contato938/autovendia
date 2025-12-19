# ✅ Checklist de Testes - Docker Setup

## Antes de Começar

1. **Verificar se Docker está instalado e rodando**

   ```bash
   docker --version
   docker-compose --version
   # ou
   docker compose version
   ```

2. **Iniciar Docker Desktop** (macOS)
   - Abrir Docker Desktop app
   - Aguardar inicialização completa

## Testes Básicos

### 1. Testar Build da Imagem

```bash
cd /Users/macbook/Documents/GitHub/new_clinica-ia-conecta/autovendia
docker build -t autovendia:test .
```

**Resultado esperado**:

- ✅ Build completo sem erros
- ✅ Imagem criada com ~150-200MB

### 2. Executar Container de Teste

```bash
docker run -p 3000:3000 --name autovendia-test autovendia:test
```

**Resultado esperado**:

- ✅ Container inicia sem erros
- ✅ Aplicação acessível em http://localhost:3000
- ✅ Login funciona normalmente

### 3. Testar Docker Compose (Produção)

```bash
docker-compose up --build
```

**Resultado esperado**:

- ✅ Build automático
- ✅ Container iniciado
- ✅ Health check passando
- ✅ Aplicação acessível

### 4. Testar Docker Compose (Desenvolvimento)

```bash
docker-compose -f docker-compose.dev.yml up
```

**Resultado esperado**:

- ✅ Container inicia em modo dev
- ✅ Hot reload funcionando
- ✅ Alterações de código refletem automaticamente

### 5. Testar Script Auxiliar

```bash
./docker.sh help
./docker.sh build
./docker.sh start
./docker.sh logs
./docker.sh status
./docker.sh stop
```

**Resultado esperado**:

- ✅ Todos os comandos funcionam
- ✅ Feedback claro e colorido
- ✅ Operações executadas corretamente

### 6. Testar Makefile

```bash
make help
make build
make start
make logs
make stop
```

**Resultado esperado**:

- ✅ Comandos executam corretamente
- ✅ Saída formatada e clara

## Testes Avançados

### 7. Testar Health Check

```bash
docker-compose up -d
sleep 40  # Aguardar health check
docker inspect --format='{{json .State.Health}}' autovendia-app | jq
```

**Resultado esperado**:

- ✅ Status: "healthy"
- ✅ Sem falhas

### 8. Testar Variáveis de Ambiente

```bash
# Criar arquivo .env.production
echo "NODE_ENV=production" > .env.production

# Descomentar env_file no docker-compose.yml
docker-compose up -d
docker-compose logs | grep "NODE_ENV"
```

**Resultado esperado**:

- ✅ Variáveis carregadas corretamente
- ✅ Aplicação em modo produção

### 9. Testar Rebuild sem Cache

```bash
docker-compose build --no-cache
docker-compose up -d
```

**Resultado esperado**:

- ✅ Build limpo sem erros
- ✅ Aplicação funciona normalmente

### 10. Testar Limpeza

```bash
./docker.sh clean
# ou
make clean
```

**Resultado esperado**:

- ✅ Containers removidos
- ✅ Imagens removidas
- ✅ Sistema limpo

## Testes de Funcionalidade

### 11. Testar Aplicação no Container

```bash
docker-compose up -d
```

Acessar http://localhost:3000 e testar:

- [ ] Página de login carrega
- [ ] Login funciona (carlos@autovend.ia)
- [ ] Dashboard exibe KPIs
- [ ] Leads page exibe lista
- [ ] Pipeline drag-and-drop funciona
- [ ] Drawer de detalhes abre
- [ ] Navegação entre páginas funciona
- [ ] Logout funciona

### 12. Testar Performance

```bash
docker stats autovendia-app
```

**Verificar**:

- CPU: < 10% em idle
- Memória: < 200MB
- Network: normal

## Troubleshooting

### Container não inicia

```bash
# Ver logs detalhados
docker-compose logs -f

# Ver eventos do container
docker events --filter container=autovendia-app
```

### Build falha

```bash
# Limpar cache do Docker
docker builder prune -a

# Verificar .dockerignore
cat .dockerignore

# Rebuild sem cache
docker-compose build --no-cache
```

### Porta 3000 em uso

```bash
# Verificar processo na porta
lsof -i :3000

# Matar processo
kill -9 $(lsof -t -i:3000)

# Ou usar porta diferente no docker-compose.yml
# ports:
#   - "3001:3000"
```

### Permissões negadas

```bash
# Adicionar permissão de execução
chmod +x docker.sh

# Verificar permissões Docker
docker ps
```

## Checklist Final

Antes de considerar o setup completo:

- [ ] Build da imagem funciona
- [ ] Container inicia sem erros
- [ ] Aplicação acessível no navegador
- [ ] Todas as páginas carregam
- [ ] Funcionalidades principais funcionam
- [ ] Health check passa
- [ ] Logs não mostram erros
- [ ] Script auxiliar funciona
- [ ] Makefile funciona
- [ ] Documentação está clara

## Próximos Passos

Após validar localmente:

1. **Commit e Push**

   ```bash
   git add .
   git commit -m "feat: add Docker support"
   git push
   ```

2. **Configurar CI/CD** (opcional)

   - Adicionar secrets no GitHub
   - Testar workflow de build

3. **Deploy em Produção**

   - Escolher plataforma (AWS, GCP, Azure, etc.)
   - Seguir guia de deploy específico
   - Configurar variáveis de ambiente

4. **Monitoramento** (opcional)
   - Configurar logs centralizados
   - Adicionar métricas
   - Configurar alertas

---

**Última atualização**: 2025-12-19
