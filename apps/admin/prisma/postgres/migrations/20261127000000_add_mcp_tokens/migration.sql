-- CreateTable
CREATE TABLE "McpToken" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "McpToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "McpToken_token_hash_key" ON "McpToken"("token_hash");

-- CreateIndex
CREATE INDEX "McpToken_author_id_idx" ON "McpToken"("author_id");
