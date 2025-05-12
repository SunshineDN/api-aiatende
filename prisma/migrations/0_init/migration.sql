-- CreateEnum
CREATE TYPE "enum_messages_role" AS ENUM ('user', 'assistant', 'system', 'tool', 'data');

-- CreateTable
CREATE TABLE "SequelizeMeta" (
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "bk_funnels" (
    "code" VARCHAR(255) NOT NULL,
    "quests" VARCHAR(255)[],
    "dentista" VARCHAR(255),
    "procedimento" VARCHAR(255),
    "periodo" VARCHAR(255),
    "turno" VARCHAR(255),
    "objects" JSON,
    "funnel_id" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "bk_funnels_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "funnel_builder" (
    "id" VARCHAR(255) NOT NULL,
    "professional" JSON,
    "service" JSON,
    "service_intro_page" JSON,
    "testimony" JSON,
    "register" JSON,
    "period" JSON,
    "shift" JSON,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "funnel_builder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_messages" (
    "id" SERIAL NOT NULL,
    "author_id" UUID,
    "messages" JSON[],
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "lead_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_threads" (
    "lead_id" INTEGER NOT NULL,
    "author_id" UUID,
    "thread_id" VARCHAR(255)[],
    "assistant_id" VARCHAR(255)[],
    "assistant_messages" JSON[],
    "last_timestamp" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "lead_threads_pkey" PRIMARY KEY ("lead_id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" UUID NOT NULL,
    "lead_id" INTEGER NOT NULL,
    "data" JSON,
    "details" JSON,
    "marketing_tracking_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketing_tracking" (
    "id" UUID NOT NULL,
    "hash" VARCHAR(8),
    "gclientid" VARCHAR(255),
    "gclid" VARCHAR(255),
    "fbclid" VARCHAR(255),
    "ga_utm" VARCHAR(255),
    "fbp" VARCHAR(255),
    "fbc" VARCHAR(255),
    "utm_content" VARCHAR(255),
    "utm_medium" VARCHAR(255),
    "utm_campaign" VARCHAR(255),
    "utm_source" VARCHAR(255),
    "utm_term" VARCHAR(255),
    "utm_referrer" VARCHAR(255),
    "referrer" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "marketing_tracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" UUID NOT NULL,
    "lead_id" INTEGER NOT NULL,
    "agent_name" VARCHAR(255) NOT NULL,
    "role" "enum_messages_role" NOT NULL,
    "content" JSON NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "leads_lead_id_key" ON "leads"("lead_id");

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_marketing_tracking_id_fkey" FOREIGN KEY ("marketing_tracking_id") REFERENCES "marketing_tracking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("lead_id") ON DELETE CASCADE ON UPDATE CASCADE;

