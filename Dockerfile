FROM node:22.4.0

# 1) Cria um diretório para a aplicação e define o usuário node como dono do diretório
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app

# 2) Copia o package.json e o package-lock.json para o diretório de trabalho e instala as dependências
COPY package*.json ./
RUN npm install

# 3) Copia o restante dos arquivos da aplicação para o diretório de trabalho
COPY --chown=node:node . .

# 4) Gera o prisma client
RUN npm run prisma:generate

# 5) Comando para iniciar a aplicação
CMD [ "npm", "run", "start" ]