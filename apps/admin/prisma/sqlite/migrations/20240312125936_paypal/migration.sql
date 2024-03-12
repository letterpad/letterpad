/*
  Warnings:

  - A unique constraint covering the columns `[post_id]` on the table `FeaturedWeek` will be added. If there are existing duplicate values, this will fail.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Setting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "site_title" TEXT NOT NULL,
    "site_tagline" TEXT NOT NULL,
    "site_email" TEXT NOT NULL,
    "site_url" TEXT NOT NULL,
    "site_footer" TEXT NOT NULL,
    "site_description" TEXT NOT NULL,
    "display_author_info" BOOLEAN NOT NULL DEFAULT false,
    "cloudinary_key" TEXT NOT NULL,
    "cloudinary_name" TEXT NOT NULL,
    "cloudinary_secret" TEXT NOT NULL,
    "paypal_email" TEXT NOT NULL DEFAULT '',
    "menu" TEXT NOT NULL DEFAULT '[]',
    "css" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "client_token" TEXT NOT NULL,
    "banner" TEXT NOT NULL DEFAULT '{}',
    "site_logo" TEXT NOT NULL DEFAULT '{}',
    "site_favicon" TEXT NOT NULL DEFAULT '{}',
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "intro_dismissed" BOOLEAN NOT NULL,
    "show_about_page" BOOLEAN NOT NULL DEFAULT true,
    "show_tags_page" BOOLEAN NOT NULL DEFAULT false,
    "design" TEXT NOT NULL DEFAULT '{}',
    "scripts" TEXT NOT NULL DEFAULT '',
    "openai_key" TEXT NOT NULL DEFAULT '',
    "author_id" TEXT NOT NULL
);
INSERT INTO "new_Setting" ("author_id", "banner", "client_token", "cloudinary_key", "cloudinary_name", "cloudinary_secret", "createdAt", "css", "design", "display_author_info", "id", "intro_dismissed", "menu", "openai_key", "scripts", "show_about_page", "show_tags_page", "site_description", "site_email", "site_favicon", "site_footer", "site_logo", "site_tagline", "site_title", "site_url", "theme", "updatedAt") SELECT "author_id", "banner", "client_token", "cloudinary_key", "cloudinary_name", "cloudinary_secret", "createdAt", "css", "design", "display_author_info", "id", "intro_dismissed", "menu", "openai_key", "scripts", "show_about_page", "show_tags_page", "site_description", "site_email", "site_favicon", "site_footer", "site_logo", "site_tagline", "site_title", "site_url", "theme", "updatedAt" FROM "Setting";
DROP TABLE "Setting";
ALTER TABLE "new_Setting" RENAME TO "Setting";
CREATE UNIQUE INDEX "Setting_author_id_key" ON "Setting"("author_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "FeaturedWeek_post_id_key" ON "FeaturedWeek"("post_id");
