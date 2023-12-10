/*
  Warnings:

  - You are about to drop the column `transpiled` on the `Video` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Video" DROP COLUMN "transpiled",
ADD COLUMN     "transcript" JSONB;
