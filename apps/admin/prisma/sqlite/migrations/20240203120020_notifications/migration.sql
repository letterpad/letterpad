-- CreateTable
CREATE TABLE "Notifications" (
    "notification_id" TEXT NOT NULL PRIMARY KEY,
    "author_id" INTEGER NOT NULL,
    "meta" TEXT NOT NULL DEFAULT '{}',
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "mail_sent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
);

-- CreateIndex
CREATE INDEX "Notifications_author_id_idx" ON "Notifications"("author_id");
