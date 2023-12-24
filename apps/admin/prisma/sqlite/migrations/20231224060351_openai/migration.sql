-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Domain" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "mapped" BOOLEAN NOT NULL DEFAULT false,
    "ssl" BOOLEAN NOT NULL,
    "updatedAt" DATETIME,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "author_id" INTEGER NOT NULL
);
INSERT INTO "new_Domain" ("author_id", "createdAt", "id", "mapped", "name", "ssl", "updatedAt") SELECT "author_id", "createdAt", "id", "mapped", "name", "ssl", "updatedAt" FROM "Domain";
DROP TABLE "Domain";
ALTER TABLE "new_Domain" RENAME TO "Domain";
CREATE UNIQUE INDEX "Domain_author_id_key" ON "Domain"("author_id");
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
    "design" TEXT NOT NULL DEFAULT '{}',
    "scripts" TEXT NOT NULL DEFAULT '',
    "openai_key" TEXT NOT NULL DEFAULT '',
    "author_id" INTEGER NOT NULL
);
INSERT INTO "new_Setting" ("author_id", "banner", "client_token", "cloudinary_key", "cloudinary_name", "cloudinary_secret", "createdAt", "css", "design", "display_author_info", "graphcomment_id", "id", "intro_dismissed", "menu", "scripts", "show_about_page", "show_tags_page", "site_description", "site_email", "site_favicon", "site_footer", "site_logo", "site_tagline", "site_title", "site_url", "subscribe_embed", "theme", "updatedAt") SELECT "author_id", "banner", "client_token", "cloudinary_key", "cloudinary_name", "cloudinary_secret", "createdAt", "css", "design", "display_author_info", "graphcomment_id", "id", "intro_dismissed", "menu", "scripts", "show_about_page", "show_tags_page", "site_description", "site_email", "site_favicon", "site_footer", "site_logo", "site_tagline", "site_title", "site_url", "subscribe_embed", "theme", "updatedAt" FROM "Setting";
DROP TABLE "Setting";
ALTER TABLE "new_Setting" RENAME TO "Setting";
CREATE UNIQUE INDEX "Setting_author_id_key" ON "Setting"("author_id");
CREATE TABLE "new_Subscriber" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "author_id" INTEGER NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "verify_attempt_left" INTEGER DEFAULT 3
);
INSERT INTO "new_Subscriber" ("author_id", "createdAt", "email", "id", "updatedAt", "verified", "verify_attempt_left") SELECT "author_id", "createdAt", "email", "id", "updatedAt", "verified", "verify_attempt_left" FROM "Subscriber";
DROP TABLE "Subscriber";
ALTER TABLE "new_Subscriber" RENAME TO "Subscriber";
CREATE INDEX "Subscriber_author_id_idx" ON "Subscriber"("author_id");
CREATE UNIQUE INDEX "Subscriber_email_author_id_key" ON "Subscriber"("email", "author_id");
CREATE TABLE "new_Upload" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "updatedAt" DATETIME,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "author_id" INTEGER NOT NULL
);
INSERT INTO "new_Upload" ("author_id", "createdAt", "description", "height", "id", "name", "updatedAt", "url", "width") SELECT "author_id", "createdAt", "description", "height", "id", "name", "updatedAt", "url", "width" FROM "Upload";
DROP TABLE "Upload";
ALTER TABLE "new_Upload" RENAME TO "Upload";
CREATE INDEX "Upload_author_id_idx" ON "Upload"("author_id");
CREATE TABLE "new_RolePermissions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "role_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL
);
INSERT INTO "new_RolePermissions" ("createdAt", "id", "permission_id", "role_id", "updatedAt") SELECT "createdAt", "id", "permission_id", "role_id", "updatedAt" FROM "RolePermissions";
DROP TABLE "RolePermissions";
ALTER TABLE "new_RolePermissions" RENAME TO "RolePermissions";
CREATE INDEX "RolePermissions_role_id_idx" ON "RolePermissions"("role_id");
CREATE INDEX "RolePermissions_permission_id_idx" ON "RolePermissions"("permission_id");
CREATE TABLE "new_Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL DEFAULT '',
    "sub_title" TEXT NOT NULL DEFAULT '',
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
    "stats" TEXT NOT NULL DEFAULT '{}'
);
INSERT INTO "new_Post" ("author_id", "cover_image", "cover_image_height", "cover_image_width", "createdAt", "excerpt", "featured", "html", "html_draft", "id", "page_data", "page_type", "publishedAt", "reading_time", "scheduledAt", "slug", "stats", "status", "sub_title", "title", "type", "updatedAt") SELECT "author_id", "cover_image", "cover_image_height", "cover_image_width", "createdAt", "excerpt", "featured", "html", "html_draft", "id", "page_data", "page_type", "publishedAt", "reading_time", "scheduledAt", "slug", "stats", "status", "sub_title", "title", "type", "updatedAt" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
CREATE INDEX "Post_author_id_idx" ON "Post"("author_id");
CREATE TABLE "new__PostToTag" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);
INSERT INTO "new__PostToTag" ("A", "B") SELECT "A", "B" FROM "_PostToTag";
DROP TABLE "_PostToTag";
ALTER TABLE "new__PostToTag" RENAME TO "_PostToTag";
CREATE UNIQUE INDEX "_PostToTag_AB_unique" ON "_PostToTag"("A", "B");
CREATE INDEX "_PostToTag_B_index" ON "_PostToTag"("B");
CREATE TABLE "new_Author" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "social" TEXT NOT NULL DEFAULT '{}',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "verify_attempt_left" INTEGER DEFAULT 3,
    "analytics_id" INTEGER,
    "analytics_uuid" TEXT,
    "register_step" TEXT DEFAULT '',
    "role_id" INTEGER NOT NULL,
    "login_type" TEXT NOT NULL DEFAULT 'credentials',
    "last_seen" DATETIME,
    "first_post_published" BOOLEAN NOT NULL DEFAULT false,
    "settings_updated" BOOLEAN NOT NULL DEFAULT false,
    "profile_updated" BOOLEAN NOT NULL DEFAULT false,
    "stripe_customer_id" TEXT,
    "stripe_subscription_id" TEXT
);
INSERT INTO "new_Author" ("analytics_id", "analytics_uuid", "avatar", "bio", "company_name", "createdAt", "email", "first_post_published", "id", "last_seen", "login_type", "name", "occupation", "password", "profile_updated", "register_step", "role_id", "settings_updated", "social", "stripe_customer_id", "stripe_subscription_id", "updatedAt", "username", "verified", "verify_attempt_left") SELECT "analytics_id", "analytics_uuid", "avatar", "bio", "company_name", "createdAt", "email", "first_post_published", "id", "last_seen", "login_type", "name", "occupation", "password", "profile_updated", "register_step", "role_id", "settings_updated", "social", "stripe_customer_id", "stripe_subscription_id", "updatedAt", "username", "verified", "verify_attempt_left" FROM "Author";
DROP TABLE "Author";
ALTER TABLE "new_Author" RENAME TO "Author";
CREATE UNIQUE INDEX "Author_username_key" ON "Author"("username");
CREATE UNIQUE INDEX "Author_email_key" ON "Author"("email");
CREATE INDEX "Author_role_id_idx" ON "Author"("role_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
