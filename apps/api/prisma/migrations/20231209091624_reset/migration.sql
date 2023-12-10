/*
  Warnings:

  - You are about to drop the `File` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_video_id_fkey";

-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "audio_file" TEXT,
ADD COLUMN     "credits" JSONB,
ADD COLUMN     "finished_file" TEXT;

-- DropTable
DROP TABLE "File";
