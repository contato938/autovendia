# 🐳 AutoVendia - Guia de Deploy com Docker

Este guia explica como executar o AutoVendia usando Docker e Docker Compose.

## 📋 Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) instalado (versão 20.10 ou superior)
- [Docker Compose](https://docs.docker.com/compose/install/) instalado (versão 2.0 ou superior)

## 🚀 Como Usar

### Opção 1: Usar Docker Compose (Recomendado)

1. **Configurar variáveis de ambiente** (se necessário):

   Crie um arquivo `.env.production` na raiz do projeto com suas variáveis:

   ```env
   NODE_ENV=production
   # Adicione outras variáveis conforme necessário
   ```

2. **Construir e iniciar a aplicação**:

   ```bash
   docker-compose up --build
   ```

3. **Executar em modo detached (background)**:

   ```bash
   docker-compose up -d
   ```

4. **Ver logs**:

   ```bash
   docker-compose logs -f
   ```

5. **Parar a aplicação**:
   ```bash
   docker-compose down
   ```

### Opção 2: Usar Docker diretamente

1. **Construir a imagem**:

   ```bash
   docker build -t autovendia:latest .
   ```

2. **Executar o container**:

   ```bash
   docker run -p 3000:3000 --name autovendia-app autovendia:latest
   ```

3. **Executar com variáveis de ambiente**:
   ```bash
   docker run -p 3000:3000 \
     -e NODE_ENV=production \
     --name autovendia-app \
     autovendia:latest
   ```

## 🌐 Acessar a Aplicação

Após iniciar o container, acesse a aplicação em:

```
http://localhost:3000
```

## 🔧 Comandos Úteis

### Verificar containers em execução

```bash
docker ps
```

### Ver logs do container

```bash
docker logs -f autovendia-app
```

### Parar o container

```bash
docker stop autovendia-app
```

### Remover o container

```bash
docker rm autovendia-app
```

### Remover a imagem

```bash
docker rmi autovendia:latest
```

### Limpar recursos não utilizados

```bash
docker system prune -a
```

## 📊 Healthcheck

O container inclui um healthcheck configurado que verifica a saúde da aplicação a cada 30 segundos.

Verificar status do healthcheck:

```bash
docker inspect --format='{{json .State.Health}}' autovendia-app
```

## 🔐 Variáveis de Ambiente

Configure as seguintes variáveis no arquivo `docker-compose.yml` ou `.env.production`:

- `NODE_ENV`: Define o ambiente (production/development)
- Adicione outras variáveis específicas da sua aplicação conforme necessário

## 📝 Notas Importantes

1. **Standalone Output**: O Dockerfile utiliza o output standalone do Next.js para otimizar o tamanho da imagem. Certifique-se de que `next.config.ts` está configurado corretamente.

2. **Portas**: A aplicação roda na porta 3000 por padrão. Você pode alterar isso no `docker-compose.yml`.

3. **Volumes**: Se precisar persistir dados, adicione volumes no `docker-compose.yml`.

4. **Rebuild**: Quando fizer alterações no código, reconstrua a imagem:
   ```bash
   docker-compose up --build
   ```

## 🚀 Deploy em Produção

### Deploy com Docker Hub

1. **Fazer login no Docker Hub**:

   ```bash
   docker login
   ```

2. **Tag da imagem**:

   ```bash
   docker tag autovendia:latest your-username/autovendia:latest
   ```

3. **Push para Docker Hub**:

   ```bash
   docker push your-username/autovendia:latest
   ```

4. **Pull no servidor de produção**:
   ```bash
   docker pull your-username/autovendia:latest
   docker run -p 3000:3000 -d your-username/autovendia:latest
   ```

## 🐛 Troubleshooting

### Container não inicia

- Verifique os logs: `docker logs autovendia-app`
- Certifique-se de que a porta 3000 não está em uso

### Build lento

- Verifique se o `.dockerignore` está configurado corretamente
- Limpe o cache do Docker: `docker builder prune`

### Problemas com variáveis de ambiente

- Verifique se o arquivo `.env.production` existe
- Confirme se as variáveis estão declaradas no `docker-compose.yml`

## 📚 Recursos Adicionais

- [Documentação Next.js - Docker](https://nextjs.org/docs/deployment#docker-image)
- [Documentação Docker](https://docs.docker.com/)
- [Documentação Docker Compose](https://docs.docker.com/compose/)
