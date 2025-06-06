/*
  Warnings:

  - You are about to drop the column `details` on the `leads` table. All the data in the column will be lost.
  - You are about to drop the column `marketing_tracking_id` on the `leads` table. All the data in the column will be lost.
  - You are about to drop the `bk_funnels` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `funnel_builder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lead_threads` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `marketing_tracking` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `messages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "leads" DROP CONSTRAINT "leads_marketing_tracking_id_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_lead_id_fkey";

-- AlterTable
ALTER TABLE "leads" DROP COLUMN "details",
DROP COLUMN "marketing_tracking_id";

-- DropTable
DROP TABLE "bk_funnels";

-- DropTable
DROP TABLE "funnel_builder";

-- DropTable
DROP TABLE "lead_threads";

-- DropTable
DROP TABLE "marketing_tracking";

-- DropTable
DROP TABLE "messages";

-- DropEnum
DROP TYPE "enum_messages_role";

-- AddForeignKey
ALTER TABLE "lead_messages" ADD CONSTRAINT "lead_messages_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("lead_id") ON DELETE CASCADE ON UPDATE CASCADE;
