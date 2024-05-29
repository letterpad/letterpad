/*
  Warnings:

  - You are about to drop the column `login_type` on the `Author` table. All the data in the column will be lost.
  - The primary key for the `Session` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `domain` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the `PageTimeLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PageViews` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[session_token]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `session_token` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'Author' 
        AND column_name = 'login_type'
    ) THEN
        EXECUTE 'ALTER TABLE "Author" DROP COLUMN "login_type"';
    END IF;
END $$;

ALTER TABLE "Author"
ADD COLUMN "email_verified_at" TIMESTAMP(3),
ADD COLUMN "image" TEXT,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "username" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "bio" DROP NOT NULL,
ALTER COLUMN "occupation" DROP NOT NULL,
ALTER COLUMN "company_name" DROP NOT NULL,
ALTER COLUMN "avatar" DROP NOT NULL,
ALTER COLUMN "role_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Membership" ALTER COLUMN "status" SET DEFAULT 'inactive';


-- AlterTable
DROP TABLE "Session";

CREATE TABLE "Session" (
 "author_id" TEXT NOT NULL,
 "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
 "expires" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 "session_token" TEXT NOT NULL,
 "updatedAt" TIMESTAMP(3)
);

-- DropTable
DROP TABLE "PageTimeLog";

-- DropTable
DROP TABLE "PageViews";

-- CreateTable
CREATE TABLE IF NOT EXISTS "Trending" (
    "id" SERIAL NOT NULL,
    "post_id" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Trending_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "VerificationRequest" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationRequest_pkey" PRIMARY KEY ("identifier","token")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Account" (
    "author_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("provider","provider_account_id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Trending_post_id_idx" ON "Trending"("post_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS  "Account_author_id_idx" ON "Account"("author_id");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Session_session_token_key" ON "Session"("session_token");
