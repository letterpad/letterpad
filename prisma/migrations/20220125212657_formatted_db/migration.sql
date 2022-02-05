/*
  Warnings:

  - You are about to drop the `authors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `emailDelivery` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `emails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `permissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `postTags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `posts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rolePermissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `settings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subscribers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `uploads` table. If the table is not empty, all the data it contains will be lost.
  - You are about to alter the column `delivered` on the `SubscribersDelivery` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("tinyint(1)")` to `Boolean`.
  - Made the column `delivered` on table `SubscribersDelivery` required. This step will fail if there are existing NULL values in that column.
  - Made the column `post_id` on table `SubscribersDelivery` required. This step will fail if there are existing NULL values in that column.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "authors";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "emailDelivery";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "emails";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "permissions";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "postTags";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "posts";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "rolePermissions";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "roles";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "settings";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "subscribers";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "tags";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "uploads";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Author" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "bio" TEXT,
    "avatar" TEXT,
    "social" TEXT DEFAULT '{}',
    "verified" BOOLEAN DEFAULT false,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME,
    "role_id" INTEGER,
    "setting_id" INTEGER,
    "verify_attempt_left" INTEGER,
    CONSTRAINT "Author_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmailDelivery" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "template_id" TEXT,
    "author_id" INTEGER,
    "post_id" INTEGER,
    "subscriber_id" INTEGER,
    "delivered" INTEGER,
    "last_delivery_attempt" DATETIME,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME
);

-- CreateTable
CREATE TABLE "Emails" (
    "template_id" TEXT PRIMARY KEY,
    "subject" TEXT,
    "body" TEXT,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME
);

-- CreateTable
CREATE TABLE "PostTags" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME,
    "tag_id" INTEGER NOT NULL,
    "post_id" INTEGER NOT NULL,
    CONSTRAINT "PostTags_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PostTags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT DEFAULT '',
    "html" TEXT,
    "html_draft" TEXT DEFAULT '',
    "excerpt" TEXT DEFAULT '',
    "cover_image" TEXT DEFAULT '',
    "cover_image_width" INTEGER DEFAULT 0,
    "cover_image_height" INTEGER DEFAULT 0,
    "type" TEXT DEFAULT '',
    "featured" INTEGER DEFAULT 0,
    "status" TEXT DEFAULT 'draft',
    "slug" TEXT DEFAULT '',
    "reading_time" TEXT DEFAULT '',
    "published_at" DATETIME,
    "scheduled_at" DATETIME,
    "updated_at" DATETIME,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "author_id" INTEGER,
    CONSTRAINT "Post_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Author" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RolePermissions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME,
    "role_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,
    CONSTRAINT "RolePermissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "Permission" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RolePermissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Role" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME
);

-- CreateTable
CREATE TABLE "Setting" (
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
    "display_author_info" BOOLEAN DEFAULT false,
    "cloudinary_key" TEXT DEFAULT '',
    "cloudinary_name" TEXT DEFAULT '',
    "cloudinary_secret" TEXT DEFAULT '',
    "menu" TEXT DEFAULT '{}',
    "css" TEXT DEFAULT '',
    "google_analytics" TEXT DEFAULT '',
    "theme" TEXT DEFAULT '',
    "client_token" TEXT DEFAULT '',
    "disqus_id" TEXT DEFAULT '',
    "banner" TEXT DEFAULT '{}',
    "site_logo" TEXT DEFAULT '{}',
    "site_favicon" TEXT DEFAULT '{}',
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME,
    "graphqlcommentId" TEXT,
    "graphcomment_id" TEXT,
    "intro_dismissed" INTEGER,
    "author_id" INTEGER NOT NULL,
    CONSTRAINT "Setting_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Author" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Subscriber" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT,
    "author_id" INTEGER,
    "verified" BOOLEAN,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME,
    "verify_attempt_left" INTEGER DEFAULT 3
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "desc" TEXT DEFAULT '',
    "slug" TEXT,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME,
    "author_id" INTEGER,
    CONSTRAINT "Tag_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Author" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Upload" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "url" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "description" TEXT,
    "updated_at" DATETIME,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "author_id" INTEGER NOT NULL,
    CONSTRAINT "Upload_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Author" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SubscribersDelivery" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "subscriber_id" TEXT,
    "post_id" INTEGER NOT NULL,
    "delivered" BOOLEAN NOT NULL,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME
);
INSERT INTO "new_SubscribersDelivery" ("created_at", "delivered", "id", "post_id", "subscriber_id", "updated_at") SELECT "created_at", "delivered", "id", "post_id", "subscriber_id", "updated_at" FROM "SubscribersDelivery";
DROP TABLE "SubscribersDelivery";
ALTER TABLE "new_SubscribersDelivery" RENAME TO "SubscribersDelivery";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Setting_author_id_key" ON "Setting"("author_id");
