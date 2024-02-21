-- CreateTable
CREATE TABLE "PageTimeLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ip" TEXT NOT NULL,
    "post_id" INTEGER NOT NULL,
    "snapshot" TEXT NOT NULL,
    "page_time" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
);

-- CreateIndex
CREATE INDEX "PageTimeLog_post_id_idx" ON "PageTimeLog"("post_id");

-- CreateIndex
CREATE INDEX "PageTimeLog_ip_post_id_idx" ON "PageTimeLog"("ip", "post_id");

-- CreateIndex
CREATE UNIQUE INDEX "PageTimeLog_ip_post_id_key" ON "PageTimeLog"("ip", "post_id");
