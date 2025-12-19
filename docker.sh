#!/bin/bash

# Script auxiliar para gerenciar o AutoVendia com Docker
# Uso: ./docker.sh [comando]

set -e

COMPOSE_FILE="docker-compose.yml"
APP_NAME="autovendia-app"
IMAGE_NAME="autovendia:latest"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para exibir mensagens coloridas
info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Função para verificar se Docker está instalado
check_docker() {
    if ! command -v docker &> /dev/null; then
        error "Docker não está instalado. Por favor, instale o Docker primeiro."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        error "Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro."
        exit 1
    fi
}

# Função para exibir ajuda
show_help() {
    echo "🐳 AutoVendia - Gerenciador Docker"
    echo ""
    echo "Uso: ./docker.sh [comando]"
    echo ""
    echo "Comandos disponíveis:"
    echo "  build       - Construir a imagem Docker"
    echo "  start       - Iniciar a aplicação"
    echo "  stop        - Parar a aplicação"
    echo "  restart     - Reiniciar a aplicação"
    echo "  logs        - Ver logs da aplicação"
    echo "  status      - Ver status dos containers"
    echo "  clean       - Limpar containers e imagens"
    echo "  rebuild     - Reconstruir e reiniciar"
    echo "  shell       - Abrir shell no container"
    echo "  help        - Exibir esta ajuda"
    echo ""
}

# Função para construir a imagem
build() {
    info "Construindo imagem Docker..."
    docker-compose build
    info "Imagem construída com sucesso!"
}

# Função para iniciar a aplicação
start() {
    info "Iniciando aplicação..."
    docker-compose up -d
    info "Aplicação iniciada!"
    info "Acesse: http://localhost:3000"
}

# Função para parar a aplicação
stop() {
    info "Parando aplicação..."
    docker-compose down
    info "Aplicação parada!"
}

# Função para reiniciar
restart() {
    info "Reiniciando aplicação..."
    docker-compose restart
    info "Aplicação reiniciada!"
}

# Função para ver logs
logs() {
    info "Exibindo logs (Ctrl+C para sair)..."
    docker-compose logs -f
}

# Função para ver status
status() {
    info "Status dos containers:"
    docker-compose ps
}

# Função para limpar
clean() {
    warn "Isso vai remover todos os containers e imagens. Deseja continuar? (s/N)"
    read -r response
    if [[ "$response" =~ ^([sS][iI][mM]|[sS])$ ]]; then
        info "Limpando containers e imagens..."
        docker-compose down -v
        docker rmi $IMAGE_NAME 2>/dev/null || true
        info "Limpeza concluída!"
    else
        info "Operação cancelada."
    fi
}

# Função para reconstruir
rebuild() {
    info "Reconstruindo e reiniciando..."
    docker-compose down
    docker-compose build
    docker-compose up -d
    info "Aplicação reconstruída e iniciada!"
    info "Acesse: http://localhost:3000"
}

# Função para abrir shell
shell() {
    info "Abrindo shell no container..."
    docker-compose exec autovendia sh
}

# Main
check_docker

case "${1:-help}" in
    build)
        build
        ;;
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    logs)
        logs
        ;;
    status)
        status
        ;;
    clean)
        clean
        ;;
    rebuild)
        rebuild
        ;;
    shell)
        shell
        ;;
    help|*)
        show_help
        ;;
esac
