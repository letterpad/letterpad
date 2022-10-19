/*
  Warnings:

  - You are about to drop the column `social_facebook` on the `Setting` table. All the data in the column will be lost.
  - You are about to drop the column `social_github` on the `Setting` table. All the data in the column will be lost.
  - You are about to drop the column `social_instagram` on the `Setting` table. All the data in the column will be lost.
  - You are about to drop the column `social_twitter` on the `Setting` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Setting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "site_title" TEXT NOT NULL,
    "site_tagline" TEXT NOT NULL,
    "site_email" TEXT NOT NULL,
    "site_url" TEXT NOT NULL,
    "site_footer" TEXT NOT NULL,
    "site_description" TEXT NOT NULL,
    "subscribe_embed" TEXT NOT NULL,
    "display_author_info" BOOLEAN NOT NULL DEFAULT false,
    "cloudinary_key" TEXT NOT NULL,
    "cloudinary_name" TEXT NOT NULL,
    "cloudinary_secret" TEXT NOT NULL,
    "menu" TEXT NOT NULL DEFAULT '[]',
    "css" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "client_token" TEXT NOT NULL,
    "banner" TEXT NOT NULL DEFAULT '{}',
    "site_logo" TEXT NOT NULL DEFAULT '{}',
    "site_favicon" TEXT NOT NULL DEFAULT '{}',
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "graphcomment_id" TEXT NOT NULL DEFAULT '',
    "intro_dismissed" BOOLEAN NOT NULL,
    "show_about_page" BOOLEAN NOT NULL DEFAULT true,
    "show_tags_page" BOOLEAN NOT NULL DEFAULT false,
    "author_id" INTEGER NOT NULL,
    CONSTRAINT "Setting_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Author" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Setting" ("author_id", "banner", "client_token", "cloudinary_key", "cloudinary_name", "cloudinary_secret", "createdAt", "css", "display_author_info", "graphcomment_id", "id", "intro_dismissed", "menu", "show_about_page", "show_tags_page", "site_description", "site_email", "site_favicon", "site_footer", "site_logo", "site_tagline", "site_title", "site_url", "subscribe_embed", "theme", "updatedAt") SELECT "author_id", "banner", "client_token", "cloudinary_key", "cloudinary_name", "cloudinary_secret", "createdAt", "css", "display_author_info", "graphcomment_id", "id", "intro_dismissed", "menu", "show_about_page", "show_tags_page", "site_description", "site_email", "site_favicon", "site_footer", "site_logo", "site_tagline", "site_title", "site_url", "subscribe_embed", "theme", "updatedAt" FROM "Setting";
DROP TABLE "Setting";
ALTER TABLE "new_Setting" RENAME TO "Setting";
CREATE UNIQUE INDEX "Setting_author_id_key" ON "Setting"("author_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
