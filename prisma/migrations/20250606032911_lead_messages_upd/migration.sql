/*
  Warnings:

  - The primary key for the `lead_messages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `author_id` on the `lead_messages` table. All the data in the column will be lost.
  - Changed the type of `id` on the `lead_messages` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "lead_messages" DROP CONSTRAINT "lead_messages_pkey",
DROP COLUMN "author_id",
ADD COLUMN     "contact_id" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lead_id" INTEGER,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "lead_messages_pkey" PRIMARY KEY ("id");
