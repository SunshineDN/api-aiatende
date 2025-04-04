#!/bin/bash

# Nome do container Docker
CONTAINER_NAME="nome_do_seu_container"

# Diretório onde o backup será salvo
BACKUP_DIR="/apps/nome_da_aplicacao/backup_logs"

# Data atual (formato: AAAA-MM-DD_HH-MM-SS)
DATA=$(date +"%Y-%m-%d_%H-%M-%S")

# Nome do arquivo de log
LOG_FILE="${CONTAINER_NAME}_log_${DATA}.log"

# Cria o diretório de backup, se não existir
mkdir -p "$BACKUP_DIR"

# Salva o log do container no arquivo
docker logs "$CONTAINER_NAME" > "${BACKUP_DIR}/${LOG_FILE}"

# Confirmação
echo "Backup do log do container '${CONTAINER_NAME}' salvo em: ${BACKUP_DIR}/${LOG_FILE}"