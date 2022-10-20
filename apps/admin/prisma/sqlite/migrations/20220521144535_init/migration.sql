-- CreateTable
CREATE TABLE "Author" (
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
    "role_id" INTEGER NOT NULL,
    "login_type" TEXT NOT NULL DEFAULT 'credentials',
    "last_seen" DATETIME,
    CONSTRAINT "Author_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
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
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
);

-- CreateTable
CREATE TABLE "Email" (
    "template_id" TEXT NOT NULL PRIMARY KEY,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
);

-- CreateTable
CREATE TABLE "Post" (
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
    CONSTRAINT "Post_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Author" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RolePermissions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "role_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,
    CONSTRAINT "RolePermissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "Permission" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RolePermissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Role" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
);

-- CreateTable
CREATE TABLE "Setting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "site_title" TEXT NOT NULL,
    "site_tagline" TEXT NOT NULL,
    "site_email" TEXT NOT NULL,
    "site_url" TEXT NOT NULL,
    "site_footer" TEXT NOT NULL,
    "site_description" TEXT NOT NULL,
    "subscribe_embed" TEXT NOT NULL,
    "social_twitter" TEXT NOT NULL,
    "social_facebook" TEXT NOT NULL,
    "social_instagram" TEXT NOT NULL,
    "social_github" TEXT NOT NULL,
    "display_author_info" BOOLEAN NOT NULL DEFAULT false,
    "cloudinary_key" TEXT NOT NULL,
    "cloudinary_name" TEXT NOT NULL,
    "cloudinary_secret" TEXT NOT NULL,
    "menu" TEXT NOT NULL DEFAULT '[]',
    "css" TEXT NOT NULL,
    "google_analytics" TEXT NOT NULL,
    "analytics" TEXT NOT NULL DEFAULT '{}',
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

-- CreateTable
CREATE TABLE "Subscriber" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "author_id" INTEGER NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "verify_attempt_left" INTEGER DEFAULT 3,
    CONSTRAINT "Subscriber_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Author" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tag" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "desc" TEXT DEFAULT '',
    "slug" TEXT,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
);

-- CreateTable
CREATE TABLE "Upload" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "updatedAt" DATETIME,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "author_id" INTEGER NOT NULL,
    CONSTRAINT "Upload_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Author" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Domain" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "mapped" BOOLEAN NOT NULL DEFAULT false,
    "ssl" BOOLEAN NOT NULL,
    "updatedAt" DATETIME,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "author_id" INTEGER NOT NULL,
    CONSTRAINT "Domain_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Author" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SubscribersDelivery" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "subscriber_id" TEXT,
    "post_id" INTEGER NOT NULL,
    "delivered" BOOLEAN NOT NULL,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
);

-- CreateTable
CREATE TABLE "_PostToTag" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,
    FOREIGN KEY ("A") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "Tag" ("name") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Author_username_key" ON "Author"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Author_email_key" ON "Author"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Email_template_id_key" ON "Email"("template_id");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_name_key" ON "Permission"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Setting_author_id_key" ON "Setting"("author_id");

-- CreateIndex
CREATE UNIQUE INDEX "Subscriber_email_author_id_key" ON "Subscriber"("email", "author_id");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Domain_author_id_key" ON "Domain"("author_id");

-- CreateIndex
CREATE UNIQUE INDEX "_PostToTag_AB_unique" ON "_PostToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_PostToTag_B_index" ON "_PostToTag"("B");
