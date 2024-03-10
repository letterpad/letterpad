/*
  Warnings:

  - The primary key for the `Post` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Setting` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Author` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "author_id" TEXT NOT NULL,
    "page_type" TEXT NOT NULL DEFAULT 'default',
    "page_data" TEXT NOT NULL DEFAULT '',
    "stats" TEXT NOT NULL DEFAULT '{}',
    "mail_status" TEXT NOT NULL DEFAULT 'INACTIVE',
    "exclude_from_home" BOOLEAN NOT NULL DEFAULT false,
    "banned" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Post" ("author_id", "banned", "cover_image", "cover_image_height", "cover_image_width", "createdAt", "excerpt", "exclude_from_home", "featured", "html", "html_draft", "id", "mail_status", "page_data", "page_type", "publishedAt", "reading_time", "scheduledAt", "slug", "stats", "status", "sub_title", "title", "type", "updatedAt") SELECT "author_id", "banned", "cover_image", "cover_image_height", "cover_image_width", "createdAt", "excerpt", "exclude_from_home", "featured", "html", "html_draft", "id", "mail_status", "page_data", "page_type", "publishedAt", "reading_time", "scheduledAt", "slug", "stats", "status", "sub_title", "title", "type", "updatedAt" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
CREATE INDEX "Post_author_id_idx" ON "Post"("author_id");
CREATE INDEX "Post_status_mail_status_idx" ON "Post"("status", "mail_status");
CREATE INDEX "Post_author_id_status_slug_idx" ON "Post"("author_id", "status", "slug");
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
CREATE TABLE "new_Likes" (
    "post_id" TEXT NOT NULL,
    "liked_by" TEXT NOT NULL,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "count" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" DATETIME
);
INSERT INTO "new_Likes" ("count", "createdAt", "liked_by", "post_id", "updatedAt") SELECT "count", "createdAt", "liked_by", "post_id", "updatedAt" FROM "Likes";
DROP TABLE "Likes";
ALTER TABLE "new_Likes" RENAME TO "Likes";
CREATE INDEX "Likes_liked_by_idx" ON "Likes"("liked_by");
CREATE INDEX "Likes_post_id_idx" ON "Likes"("post_id");
CREATE UNIQUE INDEX "Likes_post_id_liked_by_key" ON "Likes"("post_id", "liked_by");
CREATE TABLE "new_Follows" (
    "follower_id" TEXT NOT NULL,
    "following_id" TEXT NOT NULL,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
);
INSERT INTO "new_Follows" ("createdAt", "follower_id", "following_id", "updatedAt") SELECT "createdAt", "follower_id", "following_id", "updatedAt" FROM "Follows";
DROP TABLE "Follows";
ALTER TABLE "new_Follows" RENAME TO "Follows";
CREATE INDEX "Follows_following_id_idx" ON "Follows"("following_id");
CREATE UNIQUE INDEX "Follows_follower_id_following_id_key" ON "Follows"("follower_id", "following_id");
CREATE TABLE "new_PageTimeLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ip" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "snapshot" TEXT NOT NULL,
    "page_time" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
);
INSERT INTO "new_PageTimeLog" ("createdAt", "id", "ip", "page_time", "post_id", "snapshot", "updatedAt") SELECT "createdAt", "id", "ip", "page_time", "post_id", "snapshot", "updatedAt" FROM "PageTimeLog";
DROP TABLE "PageTimeLog";
ALTER TABLE "new_PageTimeLog" RENAME TO "PageTimeLog";
CREATE INDEX "PageTimeLog_post_id_idx" ON "PageTimeLog"("post_id");
CREATE INDEX "PageTimeLog_ip_post_id_idx" ON "PageTimeLog"("ip", "post_id");
CREATE UNIQUE INDEX "PageTimeLog_ip_post_id_key" ON "PageTimeLog"("ip", "post_id");
CREATE TABLE "new_Comment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "post_id" TEXT NOT NULL,
    "parent_id" TEXT,
    "author_id" TEXT NOT NULL
);
INSERT INTO "new_Comment" ("author_id", "content", "createdAt", "id", "parent_id", "post_id", "updatedAt") SELECT "author_id", "content", "createdAt", "id", "parent_id", "post_id", "updatedAt" FROM "Comment";
DROP TABLE "Comment";
ALTER TABLE "new_Comment" RENAME TO "Comment";
CREATE INDEX "Comment_post_id_idx" ON "Comment"("post_id");
CREATE INDEX "Comment_parent_id_idx" ON "Comment"("parent_id");
CREATE INDEX "Comment_author_id_idx" ON "Comment"("author_id");
CREATE TABLE "new_Domain" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "mapped" BOOLEAN NOT NULL DEFAULT false,
    "ssl" BOOLEAN NOT NULL,
    "updatedAt" DATETIME,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "author_id" TEXT NOT NULL
);
INSERT INTO "new_Domain" ("author_id", "createdAt", "id", "mapped", "name", "ssl", "updatedAt") SELECT "author_id", "createdAt", "id", "mapped", "name", "ssl", "updatedAt" FROM "Domain";
DROP TABLE "Domain";
ALTER TABLE "new_Domain" RENAME TO "Domain";
CREATE UNIQUE INDEX "Domain_author_id_key" ON "Domain"("author_id");
CREATE TABLE "new_Subscriber" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
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
CREATE TABLE "new_FeaturedWeek" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "post_id" TEXT NOT NULL,
    "week_number" INTEGER NOT NULL
);
INSERT INTO "new_FeaturedWeek" ("id", "post_id", "week_number") SELECT "id", "post_id", "week_number" FROM "FeaturedWeek";
DROP TABLE "FeaturedWeek";
ALTER TABLE "new_FeaturedWeek" RENAME TO "FeaturedWeek";
CREATE INDEX "FeaturedWeek_post_id_idx" ON "FeaturedWeek"("post_id");
CREATE TABLE "new_Membership" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "author_id" TEXT NOT NULL,
    "stripe_customer_id" TEXT,
    "stripe_subscription_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
);
INSERT INTO "new_Membership" ("author_id", "createdAt", "id", "status", "stripe_customer_id", "stripe_subscription_id", "updatedAt") SELECT "author_id", "createdAt", "id", "status", "stripe_customer_id", "stripe_subscription_id", "updatedAt" FROM "Membership";
DROP TABLE "Membership";
ALTER TABLE "new_Membership" RENAME TO "Membership";
CREATE UNIQUE INDEX "Membership_author_id_key" ON "Membership"("author_id");
CREATE INDEX "Membership_author_id_idx" ON "Membership"("author_id");
CREATE INDEX "Membership_status_idx" ON "Membership"("status");
CREATE TABLE "new_Session" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "domain" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" DATETIME,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Session" ("author_id", "createdAt", "domain", "expiresAt", "id", "token") SELECT "author_id", "createdAt", "domain", "expiresAt", "id", "token" FROM "Session";
DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";
CREATE INDEX "Session_author_id_idx" ON "Session"("author_id");
CREATE TABLE "new_SubscribersDelivery" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "subscriber_id" TEXT,
    "post_id" TEXT NOT NULL,
    "delivered" BOOLEAN NOT NULL,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
);
INSERT INTO "new_SubscribersDelivery" ("createdAt", "delivered", "id", "post_id", "subscriber_id", "updatedAt") SELECT "createdAt", "delivered", "id", "post_id", "subscriber_id", "updatedAt" FROM "SubscribersDelivery";
DROP TABLE "SubscribersDelivery";
ALTER TABLE "new_SubscribersDelivery" RENAME TO "SubscribersDelivery";
CREATE TABLE "new__PostToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);
INSERT INTO "new__PostToTag" ("A", "B") SELECT "A", "B" FROM "_PostToTag";
DROP TABLE "_PostToTag";
ALTER TABLE "new__PostToTag" RENAME TO "_PostToTag";
CREATE UNIQUE INDEX "_PostToTag_AB_unique" ON "_PostToTag"("A", "B");
CREATE INDEX "_PostToTag_B_index" ON "_PostToTag"("B");
CREATE TABLE "new_PageViews" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "post_id" TEXT,
    "author_id" TEXT,
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
CREATE TABLE "new_Upload" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "updatedAt" DATETIME,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "author_id" TEXT NOT NULL
);
INSERT INTO "new_Upload" ("author_id", "createdAt", "description", "height", "id", "name", "updatedAt", "url", "width") SELECT "author_id", "createdAt", "description", "height", "id", "name", "updatedAt", "url", "width" FROM "Upload";
DROP TABLE "Upload";
ALTER TABLE "new_Upload" RENAME TO "Upload";
CREATE INDEX "Upload_author_id_idx" ON "Upload"("author_id");
CREATE TABLE "new_Author" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "register_step" TEXT DEFAULT '',
    "role_id" INTEGER NOT NULL,
    "login_type" TEXT NOT NULL DEFAULT 'credentials',
    "last_seen" DATETIME,
    "first_post_published" BOOLEAN NOT NULL DEFAULT false,
    "settings_updated" BOOLEAN NOT NULL DEFAULT false,
    "profile_updated" BOOLEAN NOT NULL DEFAULT false,
    "favourite" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Author" ("avatar", "bio", "company_name", "createdAt", "email", "favourite", "first_post_published", "id", "last_seen", "login_type", "name", "occupation", "password", "profile_updated", "register_step", "role_id", "settings_updated", "signature", "social", "updatedAt", "username", "verified", "verify_attempt_left") SELECT "avatar", "bio", "company_name", "createdAt", "email", "favourite", "first_post_published", "id", "last_seen", "login_type", "name", "occupation", "password", "profile_updated", "register_step", "role_id", "settings_updated", "signature", "social", "updatedAt", "username", "verified", "verify_attempt_left" FROM "Author";
DROP TABLE "Author";
ALTER TABLE "new_Author" RENAME TO "Author";
CREATE UNIQUE INDEX "Author_username_key" ON "Author"("username");
CREATE UNIQUE INDEX "Author_email_key" ON "Author"("email");
CREATE INDEX "Author_role_id_idx" ON "Author"("role_id");
CREATE INDEX "Author_username_idx" ON "Author"("username");
CREATE INDEX "Author_email_idx" ON "Author"("email");
CREATE INDEX "Author_username_password_idx" ON "Author"("username", "password");
CREATE TABLE "new_Notifications" (
    "notification_id" TEXT NOT NULL PRIMARY KEY,
    "author_id" TEXT NOT NULL,
    "meta" TEXT NOT NULL DEFAULT '{}',
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "mail_sent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
);
INSERT INTO "new_Notifications" ("author_id", "createdAt", "is_read", "mail_sent", "meta", "notification_id", "updatedAt") SELECT "author_id", "createdAt", "is_read", "mail_sent", "meta", "notification_id", "updatedAt" FROM "Notifications";
DROP TABLE "Notifications";
ALTER TABLE "new_Notifications" RENAME TO "Notifications";
CREATE INDEX "Notifications_author_id_idx" ON "Notifications"("author_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
