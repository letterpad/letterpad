-- CreateTable
CREATE TABLE "PageViews" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "post_id" INTEGER,
    "author_id" INTEGER NOT NULL,
    "view_type" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
);

-- CreateIndex
CREATE INDEX "PageViews_author_id_idx" ON "PageViews"("author_id");

-- CreateIndex
CREATE INDEX "PageViews_post_id_idx" ON "PageViews"("post_id");

-- CreateIndex
CREATE INDEX "PageViews_view_type_idx" ON "PageViews"("view_type");

-- CreateIndex
CREATE INDEX "PageViews_author_id_post_id_idx" ON "PageViews"("author_id", "post_id");

-- CreateIndex
CREATE UNIQUE INDEX "PageViews_post_id_view_type_key" ON "PageViews"("post_id", "view_type");

-- CreateIndex
CREATE UNIQUE INDEX "PageViews_author_id_view_type_key" ON "PageViews"("author_id", "view_type");
