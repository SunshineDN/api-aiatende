#!/bin/bash

# Verifica se os parâmetros foram fornecidos
if [ "$#" -ne 2 ]; then
  echo "Uso: $0 <nome_do_container> <diretorio_de_backup>"
  exit 1
fi

# Parâmetros
CONTAINER_NAME="$1"
APPLICATION_NAME="$2"

# Diretório de backup
BACKUP_DIR="/apps/${APPLICATION_NAME}/logs"

# Data atual (formato: AAAA-MM-DD_HH-MM-SS)
DATA=$(date +"%Y-%m-%d_%H-%M-%S")

# Nome do arquivo de log
LOG_FILE="${CONTAINER_NAME}_log_${DATA}.log"

# Cria o diretório de backup, se não existir
mkdir -p "$BACKUP_DIR"

# Salva o log do container no arquivo
docker logs "$CONTAINER_NAME" > "${BACKUP_DIR}/${LOG_FILE}"

# Confirmação do backup
echo "Backup do log do container '${CONTAINER_NAME}' salvo em: ${BACKUP_DIR}/${LOG_FILE}"

# Atualiza o repositório git
echo "Executando git pull..."
git pull

# Sobe os serviços com docker-compose
echo "Executando processo de build..."
docker compose up -d
