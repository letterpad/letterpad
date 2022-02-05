-- CreateTable
CREATE TABLE "SequelizeMeta" (
    "name" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "SubscribersDelivery" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "subscriber_id" INTEGER,
    "post_id" INTEGER,
    "delivered" TINYINT(1),
    "updated_at" DATETIME,
    "created_at" DATETIME,
    CONSTRAINT "SubscribersDelivery_subscriber_id_fkey" FOREIGN KEY ("subscriber_id") REFERENCES "subscribers" ("id") ON DELETE NO ACTION ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "authors" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "bio" TEXT,
    "avatar" TEXT,
    "social" JSON DEFAULT '{}',
    "verified" TINYINT(1) DEFAULT 0,
    "verify_attempt_left" INTEGER DEFAULT 3,
    "created_at" DATETIME NOT NULL,
    "updated_at" DATETIME NOT NULL,
    "role_id" INTEGER,
    "setting_id" INTEGER,
    CONSTRAINT "authors_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "authors_setting_id_fkey" FOREIGN KEY ("setting_id") REFERENCES "settings" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "emailDelivery" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "template_id" TEXT,
    "subscriber_id" INTEGER,
    "post_id" INTEGER,
    "author_id" INTEGER,
    "delivered" TINYINT(1) DEFAULT 0,
    "updated_at" DATETIME,
    "last_delivery_attempt" DATETIME,
    "created_at" DATETIME,
    CONSTRAINT "emailDelivery_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "authors" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "emails" (
    "template_id" TEXT PRIMARY KEY,
    "subject" TEXT,
    "body" TEXT,
    "created_at" DATETIME NOT NULL,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "created_at" DATETIME NOT NULL,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "postTags" (
    "created_at" DATETIME NOT NULL,
    "updated_at" DATETIME NOT NULL,
    "tag_id" INTEGER NOT NULL,
    "post_id" INTEGER NOT NULL,

    PRIMARY KEY ("tag_id", "post_id"),
    CONSTRAINT "postTags_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "postTags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "posts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT DEFAULT '',
    "html" TEXT,
    "html_draft" TEXT DEFAULT '',
    "excerpt" TEXT DEFAULT '',
    "cover_image" TEXT DEFAULT '',
    "cover_image_width" INTEGER DEFAULT 0,
    "cover_image_height" INTEGER DEFAULT 0,
    "type" TEXT DEFAULT '',
    "featured" TINYINT(1) DEFAULT 0,
    "status" TEXT DEFAULT 'draft',
    "slug" TEXT NOT NULL DEFAULT '',
    "reading_time" TEXT DEFAULT '',
    "published_at" DATETIME,
    "scheduled_at" DATETIME,
    "updated_at" DATETIME,
    "created_at" DATETIME,
    "author_id" INTEGER,
    CONSTRAINT "posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "authors" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "rolePermissions" (
    "created_at" DATETIME NOT NULL,
    "updated_at" DATETIME NOT NULL,
    "role_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,

    PRIMARY KEY ("role_id", "permission_id"),
    CONSTRAINT "rolePermissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "rolePermissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "roles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "created_at" DATETIME NOT NULL,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "site_title" TEXT DEFAULT '',
    "site_tagline" TEXT DEFAULT '',
    "site_email" TEXT DEFAULT '',
    "site_url" TEXT DEFAULT '',
    "site_footer" TEXT DEFAULT '',
    "site_description" TEXT DEFAULT '',
    "subscribe_embed" TEXT DEFAULT '',
    "social_twitter" TEXT DEFAULT '',
    "social_facebook" TEXT DEFAULT '',
    "social_instagram" TEXT DEFAULT '',
    "social_github" TEXT DEFAULT '',
    "display_author_info" TINYINT(1) DEFAULT 1,
    "intro_dismissed" TINYINT(1) DEFAULT 1,
    "cloudinary_key" TEXT DEFAULT '',
    "cloudinary_name" TEXT DEFAULT '',
    "cloudinary_secret" TEXT DEFAULT '',
    "menu" JSON,
    "css" TEXT DEFAULT '',
    "google_analytics" TEXT DEFAULT '',
    "theme" TEXT DEFAULT '',
    "client_token" TEXT DEFAULT '',
    "banner" JSON DEFAULT '{}',
    "site_logo" JSON DEFAULT '{}',
    "site_favicon" JSON DEFAULT '{}',
    "created_at" DATETIME NOT NULL,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "subscribers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT,
    "author_id" INTEGER,
    "verified" TINYINT(1),
    "verify_attempt_left" INTEGER DEFAULT 3,
    "created_at" DATETIME NOT NULL,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "subscribers_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "authors" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tags" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "desc" TEXT DEFAULT '',
    "slug" TEXT,
    "created_at" DATETIME NOT NULL,
    "updated_at" DATETIME NOT NULL,
    "author_id" INTEGER,
    CONSTRAINT "tags_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "authors" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "uploads" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "url" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "description" TEXT,
    "updated_at" DATETIME,
    "created_at" DATETIME,
    "author_id" INTEGER,
    CONSTRAINT "uploads_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "authors" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
