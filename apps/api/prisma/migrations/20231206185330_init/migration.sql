-- CreateTable
CREATE TABLE "Process" (
    "id" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "script" TEXT NOT NULL,
    "video_file" BYTEA,
    "mp3_file" BYTEA,
    "assets" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Process_pkey" PRIMARY KEY ("id")
);
