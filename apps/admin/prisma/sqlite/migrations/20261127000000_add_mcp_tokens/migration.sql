-- CreateTable
CREATE TABLE "McpToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "McpToken_token_hash_key" ON "McpToken"("token_hash");

-- CreateIndex
CREATE INDEX "McpToken_author_id_idx" ON "McpToken"("author_id");
