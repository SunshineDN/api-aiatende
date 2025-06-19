/*
  Warnings:

  - A unique constraint covering the columns `[lead_id,assistant]` on the table `thread` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "thread_assistant_key";

-- CreateIndex
CREATE UNIQUE INDEX "thread_lead_id_assistant_key" ON "thread"("lead_id", "assistant");
