-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL DEFAULT '',
    "html" TEXT NOT NULL DEFAULT '',
    "html_draft" TEXT NOT NULL DEFAULT '',
    "excerpt" TEXT NOT NULL DEFAULT '',
    "cover_image" TEXT NOT NULL DEFAULT '',
    "cover_image_width" INTEGER NOT NULL DEFAULT 0,
    "cover_image_height" INTEGER NOT NULL DEFAULT 0,
    "type" TEXT NOT NULL DEFAULT 'post',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "slug" TEXT NOT NULL DEFAULT '',
    "reading_time" TEXT NOT NULL DEFAULT '',
    "publishedAt" DATETIME,
    "scheduledAt" DATETIME,
    "updatedAt" DATETIME,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "author_id" INTEGER NOT NULL,
    "page_type" TEXT NOT NULL DEFAULT 'default',
    "page_data" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "Post_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Author" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Post" ("author_id", "cover_image", "cover_image_height", "cover_image_width", "createdAt", "excerpt", "featured", "html", "html_draft", "id", "publishedAt", "reading_time", "scheduledAt", "slug", "status", "title", "type", "updatedAt") SELECT "author_id", "cover_image", "cover_image_height", "cover_image_width", "createdAt", "excerpt", "featured", "html", "html_draft", "id", "publishedAt", "reading_time", "scheduledAt", "slug", "status", "title", "type", "updatedAt" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
