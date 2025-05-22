-- CreateTable
CREATE TABLE "thread" (
    "id" UUID NOT NULL,
    "lead_id" INTEGER NOT NULL,
    "thread_id" VARCHAR(255) NOT NULL,
    "assistant" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "thread_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "thread" ADD CONSTRAINT "thread_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("lead_id") ON DELETE CASCADE ON UPDATE CASCADE;
