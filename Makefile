.PHONY: help build start stop restart logs status clean rebuild shell dev prod

# Variáveis
COMPOSE = docker-compose
COMPOSE_DEV = docker-compose -f docker-compose.dev.yml
APP_NAME = autovendia

help: ## Exibir esta ajuda
	@echo "🐳 AutoVendia - Comandos Docker Disponíveis"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'
	@echo ""

build: ## Construir a imagem Docker
	@echo "🔨 Construindo imagem..."
	$(COMPOSE) build

start: ## Iniciar a aplicação (produção)
	@echo "🚀 Iniciando aplicação em modo produção..."
	$(COMPOSE) up -d
	@echo "✅ Aplicação rodando em http://localhost:3000"

stop: ## Parar a aplicação
	@echo "⏸️  Parando aplicação..."
	$(COMPOSE) down

restart: ## Reiniciar a aplicação
	@echo "🔄 Reiniciando aplicação..."
	$(COMPOSE) restart

logs: ## Ver logs da aplicação
	@echo "📋 Exibindo logs (Ctrl+C para sair)..."
	$(COMPOSE) logs -f

status: ## Ver status dos containers
	@echo "📊 Status dos containers:"
	$(COMPOSE) ps

clean: ## Limpar containers, volumes e imagens
	@echo "🧹 Limpando recursos Docker..."
	$(COMPOSE) down -v
	docker rmi $(APP_NAME):latest 2>/dev/null || true
	@echo "✅ Limpeza concluída"

rebuild: ## Reconstruir e reiniciar
	@echo "🔨 Reconstruindo e reiniciando..."
	$(COMPOSE) down
	$(COMPOSE) build --no-cache
	$(COMPOSE) up -d
	@echo "✅ Aplicação reconstruída e rodando em http://localhost:3000"

shell: ## Abrir shell no container
	@echo "💻 Abrindo shell..."
	$(COMPOSE) exec $(APP_NAME) sh

dev: ## Iniciar em modo desenvolvimento (com hot reload)
	@echo "🔧 Iniciando em modo desenvolvimento..."
	$(COMPOSE_DEV) up
	@echo "✅ Aplicação dev rodando em http://localhost:3000"

prod: build start ## Build e start em produção

test-build: ## Testar build sem iniciar
	@echo "🧪 Testando build..."
	docker build -t $(APP_NAME):test .
	@echo "✅ Build testado com sucesso"

prune: ## Limpar todo o sistema Docker (cuidado!)
	@echo "⚠️  Isso vai limpar TODOS os recursos Docker não utilizados"
	@echo "Pressione Ctrl+C para cancelar ou Enter para continuar..."
	@read
	docker system prune -a --volumes
	@echo "✅ Sistema limpo"
