-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PageViews" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "post_id" INTEGER,
    "author_id" INTEGER,
    "view_type" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
);
INSERT INTO "new_PageViews" ("author_id", "count", "createdAt", "id", "post_id", "updatedAt", "view_type") SELECT "author_id", "count", "createdAt", "id", "post_id", "updatedAt", "view_type" FROM "PageViews";
DROP TABLE "PageViews";
ALTER TABLE "new_PageViews" RENAME TO "PageViews";
CREATE INDEX "PageViews_author_id_idx" ON "PageViews"("author_id");
CREATE INDEX "PageViews_post_id_idx" ON "PageViews"("post_id");
CREATE INDEX "PageViews_view_type_idx" ON "PageViews"("view_type");
CREATE INDEX "PageViews_author_id_post_id_idx" ON "PageViews"("author_id", "post_id");
CREATE UNIQUE INDEX "PageViews_post_id_view_type_key" ON "PageViews"("post_id", "view_type");
CREATE UNIQUE INDEX "PageViews_author_id_view_type_key" ON "PageViews"("author_id", "view_type");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
