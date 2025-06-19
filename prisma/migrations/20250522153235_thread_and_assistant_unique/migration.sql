/*
  Warnings:

  - A unique constraint covering the columns `[thread_id]` on the table `thread` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[assistant]` on the table `thread` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "thread_thread_id_key" ON "thread"("thread_id");

-- CreateIndex
CREATE UNIQUE INDEX "thread_assistant_key" ON "thread"("assistant");
