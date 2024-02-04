-- RedefineTables
PRAGMA foreign_keys=OFF;
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
    "stats" TEXT NOT NULL DEFAULT '{}',
    "mail_status" TEXT NOT NULL DEFAULT 'INACTIVE',
    "exclude_from_home" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Post" ("author_id", "cover_image", "cover_image_height", "cover_image_width", "createdAt", "excerpt", "featured", "html", "html_draft", "id", "mail_status", "page_data", "page_type", "publishedAt", "reading_time", "scheduledAt", "slug", "stats", "status", "sub_title", "title", "type", "updatedAt") SELECT "author_id", "cover_image", "cover_image_height", "cover_image_width", "createdAt", "excerpt", "featured", "html", "html_draft", "id", "mail_status", "page_data", "page_type", "publishedAt", "reading_time", "scheduledAt", "slug", "stats", "status", "sub_title", "title", "type", "updatedAt" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
CREATE INDEX "Post_author_id_idx" ON "Post"("author_id");
CREATE INDEX "Post_status_mail_status_idx" ON "Post"("status", "mail_status");
CREATE INDEX "Post_author_id_status_slug_idx" ON "Post"("author_id", "status", "slug");
CREATE TABLE "new_Author" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,
    "signature" TEXT DEFAULT '',
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
INSERT INTO "new_Author" ("analytics_id", "analytics_uuid", "avatar", "bio", "company_name", "createdAt", "email", "first_post_published", "id", "last_seen", "login_type", "name", "occupation", "password", "profile_updated", "register_step", "role_id", "settings_updated", "signature", "social", "stripe_customer_id", "stripe_subscription_id", "updatedAt", "username", "verified", "verify_attempt_left") SELECT "analytics_id", "analytics_uuid", "avatar", "bio", "company_name", "createdAt", "email", "first_post_published", "id", "last_seen", "login_type", "name", "occupation", "password", "profile_updated", "register_step", "role_id", "settings_updated", "signature", "social", "stripe_customer_id", "stripe_subscription_id", "updatedAt", "username", "verified", "verify_attempt_left" FROM "Author";
DROP TABLE "Author";
ALTER TABLE "new_Author" RENAME TO "Author";
CREATE UNIQUE INDEX "Author_username_key" ON "Author"("username");
CREATE UNIQUE INDEX "Author_email_key" ON "Author"("email");
CREATE INDEX "Author_role_id_idx" ON "Author"("role_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
