# API AI Atende

Esta é a documentação oficial da **API AI Atende**, uma solução backend em Node.js que oferece uma série de endpoints para:

- Gerenciamento e transformação de dados de *leads*.  
- Integração com o OpenAI (GPT) para geração de respostas e prompts.  
- Transcrição e síntese de áudio.  
- Agendamento e gerenciamento de eventos no Google Calendar.  
- Construção e automação de funis de vendas (*funnels*).  
- Processamento de webhooks e comunicação com plataformas externas.

---

## Índice
- [API AI Atende](#api-ai-atende)
  - [Índice](#índice)
  - [Características](#características)
  - [Tecnologias](#tecnologias)
  - [Pré-requisitos](#pré-requisitos)
  - [Instalação](#instalação)
  - [Configuração](#configuração)
  - [Execução](#execução)
  - [Estrutura de Rotas](#estrutura-de-rotas)
    - [Leads](#leads)
    - [OpenAI GPT](#openai-gpt)
    - [Google Calendar](#google-calendar)
    - [Conta \& Admin](#conta--admin)
    - [Funil \& Webhooks](#funil--webhooks)
    - [Outras](#outras)
  - [Documentação da API (Swagger)](#documentação-da-api-swagger)
  - [Testes](#testes)
  - [Docker](#docker)
  - [Contribuição](#contribuição)
  - [Licença](#licença)
  - [Contato](#contato)

---

## Características
- **Modularização**: cada responsabilidade isolada em *routers* e *controllers*.  
- **Banco de dados**: utiliza Sequelize ORM com suporte a migrações.  
- **Logging avançado**: console colorido e estruturado via módulo `styled`.  
- **Resiliência**: reconexão com backoff na inicialização do banco de dados.  
- **Documentação interativa**: via Swagger UI.  

## Tecnologias
- **Node.js** (v18+)  
- **Express**  
- **Sequelize** (PostgreSQL)  
- **OpenAI** (GPT-4)  
- **Google Calendar API**  
- **Docker & Docker Compose**  
- **Jest & Supertest** (Testes)  
- **Swagger UI** (Documentação)

## Pré-requisitos
- **Git**  
- **Node.js** instalado (recomendado v18+)  
- **PostgreSQL** (local ou via Docker)  
- Conta e credenciais no OpenAI e Google Cloud Console

## Instalação
1. Clone o repositório:
   ```bash
   git clone https://github.com/SunshineDN/api-aiatende.git
   cd api-aiatende
   ```  
2. Instale as dependências:
   ```bash
   npm install
   ```

## Configuração
1. Copie o arquivo de exemplo e preencha as variáveis de ambiente:
   ```bash
   cp .env.example .env
   ```  
2. Edite o `.env` com as suas credenciais:
   ```env
   DOMAIN=""                  # Domínio da aplicação
   GENERIC_TIMEZONE="America/Sao_Paulo"
   KOMMO_AUTH=""              # Token do Kommo
   KOMMO_URL=""
   DB_USER=""                 # Usuário Postgres
   DB_PASS=""                 # Senha Postgres
   DB_NAME=""                 # Nome do DB
   OPENAI_API_KEY=""          # Chave OpenAI
   OPENAI_ASSISTANT_ID=""
   EVOLUTION_API_BASE_URL=""
   EVOLUTION_API_INSTANCE_ID=""
   EVOLUTION_API_KEY=""
   WHATSAPP_NUMBER=""
   ```  
> As variáveis definidas neste exemplo foram retiradas de `.env.example` do projeto ([github.com](https://github.com/SunshineDN/api-aiatende/blob/main/.env.example))

## Execução
- **Modo produção**:
  ```bash
  npm run start
  ```  
- **Modo desenvolvimento** (com reinício automático):
  ```bash
  npm run dev
  ```

Ao iniciar, o servidor fará conexão ao banco com uma política de *exponential backoff* e sincronizará as modelos via `sequelize.sync()`.

## Estrutura de Rotas
A base das rotas está registrada em `app.js`. A seguir, as principais rotas disponibilizadas:

### Leads
- `POST /lead` – criação/atualização de *leads*.  
- `GET  /lead/data-hora` – registra data, hora e dia da semana no cartão.  
- `POST /lead/split-fields/data` – divide campos de registro por `;`.  
- `POST /lead/split-fields/scheduling` – mesma divisão para agendamentos.

### OpenAI GPT
- `POST /gpt/v1/` – entrada genérica ao OpenAI.  
- `POST /gpt/v1/prompt` – rota dedicada a *prompts* analíticos.  
- `POST /gpt/v1/:assistant_id/message` – envia mensagem ao assistente.  
- `POST /gpt/v1/audio-to-text` – transcrição de áudio.  
- `POST /gpt/v1/text-to-audio` – síntese de texto para áudio.

### Google Calendar
- `GET  /calendar/` – rota genérica de teste.  
- `GET  /calendar/listEvents` – lista eventos.  
- `POST /calendar/addEvent` – adiciona evento.  
- `PUT  /calendar/updateEvent` – atualiza evento.  
- `DELETE /calendar/removeEvent` – remove evento.

### Conta & Admin
- `POST /account` – gerenciamento de contas.  
- `GET  /admin` – funcionalidades restritas.

### Funil & Webhooks
- `POST /bkfunnels`       – integração com BuilderKit.  
- `POST /funnelbuilder`   – automação de funis próprios.  
- `POST /webhook`         – processamento de webhooks externos.

### Outras
- `GET  /api-docs`         – interface Swagger UI.  
- `GET  /wpp`              – endpoints WhatsApp.  
- `GET  /lead-threads`     – gestão de *threads* de leads.  
- `GET  /web/calendar`     – formulário React calendar.

## Documentação da API (Swagger)
Após iniciar o servidor, acesse:
```
http://<seu-dominio>/api-docs
```
para visualizar e testar interativamente todos os endpoints.

## Testes
- Execute o suite de testes com Jest e Supertest:
  ```bash
  npm test
  ```

## Docker
1. Ajuste as variáveis em `docker-compose.yml`.  
2. Suba os serviços:
   ```bash
   docker-compose up --build
   ```
3. A API estará disponível em `http://localhost:3000`.

## Contribuição
1. Faça um *fork* do projeto.  
2. Crie uma *branch* para a feature ou correção (`git checkout -b feat/minha-feature`).  
3. Faça commits claros e descritivos.  
4. Abra um *pull request* descrevendo as alterações.

## Licença
Este projeto está licenciado sob a **MIT License**. Consulte o arquivo `LICENSE` para mais detalhes.

## Contato
- Maintainer: **Equipe AI Atende**  
- E-mail: suporte@aiatende.com.br
