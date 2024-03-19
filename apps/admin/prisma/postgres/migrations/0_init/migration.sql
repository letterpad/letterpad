-- CreateTable
CREATE TABLE "Notifications" (
    "notification_id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "meta" JSONB NOT NULL DEFAULT '{}',
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "mail_sent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("notification_id")
);

-- CreateTable
CREATE TABLE "Author" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "occupation" VARCHAR(100) NOT NULL,
    "company_name" VARCHAR(100) NOT NULL,
    "avatar" VARCHAR(300) NOT NULL,
    "signature" VARCHAR(400),
    "social" VARCHAR(500) NOT NULL DEFAULT '{}',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "verify_attempt_left" INTEGER DEFAULT 3,
    "role_id" INTEGER NOT NULL,
    "login_type" TEXT NOT NULL DEFAULT 'credentials',
    "last_seen" TIMESTAMP(3),
    "register_step" VARCHAR(50) DEFAULT '',
    "first_post_published" BOOLEAN NOT NULL DEFAULT false,
    "settings_updated" BOOLEAN NOT NULL DEFAULT false,
    "profile_updated" BOOLEAN NOT NULL DEFAULT false,
    "favourite" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membership" (
    "id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "stripe_customer_id" TEXT,
    "stripe_subscription_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Follows" (
    "follower_id" TEXT NOT NULL,
    "following_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3)
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "content" VARCHAR(300) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "post_id" TEXT NOT NULL,
    "parent_id" TEXT,
    "author_id" TEXT NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Likes" (
    "post_id" TEXT NOT NULL,
    "liked_by" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "count" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3)
);

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "domain" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "token" VARCHAR(500) NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailDelivery" (
    "id" SERIAL NOT NULL,
    "template_id" TEXT,
    "author_id" TEXT,
    "post_id" TEXT,
    "subscriber_id" INTEGER,
    "follower_id" TEXT,
    "following_id" TEXT,
    "delivered" INTEGER,
    "last_delivery_attempt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "EmailDelivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Email" (
    "template_id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" VARCHAR(4000) NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Email_pkey" PRIMARY KEY ("template_id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "sub_title" VARCHAR(190) NOT NULL DEFAULT '',
    "html" TEXT NOT NULL,
    "html_draft" TEXT,
    "excerpt" TEXT NOT NULL DEFAULT '',
    "cover_image" VARCHAR(255) NOT NULL DEFAULT '',
    "cover_image_width" INTEGER NOT NULL DEFAULT 0,
    "cover_image_height" INTEGER NOT NULL DEFAULT 0,
    "type" TEXT NOT NULL DEFAULT 'post',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "slug" TEXT NOT NULL DEFAULT '',
    "reading_time" TEXT NOT NULL DEFAULT '',
    "publishedAt" TIMESTAMP(3),
    "scheduledAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "author_id" TEXT NOT NULL,
    "page_type" TEXT NOT NULL DEFAULT 'default',
    "page_data" TEXT NOT NULL,
    "stats" TEXT NOT NULL DEFAULT '{}',
    "mail_status" TEXT NOT NULL DEFAULT 'INACTIVE',
    "exclude_from_home" BOOLEAN NOT NULL DEFAULT false,
    "banned" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeaturedWeek" (
    "id" SERIAL NOT NULL,
    "post_id" TEXT NOT NULL,
    "week_number" INTEGER NOT NULL,

    CONSTRAINT "FeaturedWeek_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermissions" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "role_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,

    CONSTRAINT "RolePermissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageViews" (
    "id" TEXT NOT NULL,
    "post_id" TEXT,
    "author_id" TEXT,
    "view_type" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "PageViews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Setting" (
    "id" TEXT NOT NULL,
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
    "menu" VARCHAR(500) NOT NULL DEFAULT '[]',
    "css" VARCHAR(500) NOT NULL,
    "theme" TEXT NOT NULL,
    "client_token" TEXT NOT NULL,
    "banner" VARCHAR(300) NOT NULL DEFAULT '{}',
    "site_logo" VARCHAR(300) NOT NULL DEFAULT '{}',
    "site_favicon" VARCHAR(300) NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "intro_dismissed" BOOLEAN NOT NULL,
    "show_about_page" BOOLEAN NOT NULL DEFAULT true,
    "show_tags_page" BOOLEAN NOT NULL DEFAULT false,
    "design" VARCHAR(300) NOT NULL DEFAULT '{}',
    "scripts" TEXT,
    "author_id" TEXT NOT NULL,
    "openai_key" VARCHAR(300) NOT NULL DEFAULT '',

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscriber" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "verify_attempt_left" INTEGER DEFAULT 3,

    CONSTRAINT "Subscriber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "name" TEXT NOT NULL,
    "desc" TEXT DEFAULT '',
    "slug" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "likes" INTEGER NOT NULL DEFAULT 0,
    "views" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "Upload" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "author_id" TEXT NOT NULL,

    CONSTRAINT "Upload_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Domain" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "mapped" BOOLEAN NOT NULL DEFAULT false,
    "ssl" BOOLEAN NOT NULL,
    "updatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "author_id" TEXT NOT NULL,

    CONSTRAINT "Domain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscribersDelivery" (
    "id" SERIAL NOT NULL,
    "subscriber_id" TEXT,
    "post_id" TEXT NOT NULL,
    "delivered" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "SubscribersDelivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailTemplates" (
    "template" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" VARCHAR(2000) NOT NULL
);

-- CreateTable
CREATE TABLE "PageTimeLog" (
    "id" TEXT NOT NULL,
    "ip" VARCHAR(20) NOT NULL,
    "post_id" TEXT NOT NULL,
    "snapshot" VARCHAR(500) NOT NULL,
    "page_time" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "PageTimeLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PostToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "Notifications_author_id_idx" ON "Notifications"("author_id");

-- CreateIndex
CREATE UNIQUE INDEX "Author_username_key" ON "Author"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Author_email_key" ON "Author"("email");

-- CreateIndex
CREATE INDEX "Author_role_id_idx" ON "Author"("role_id");

-- CreateIndex
CREATE INDEX "Author_username_idx" ON "Author"("username");

-- CreateIndex
CREATE INDEX "Author_email_idx" ON "Author"("email");

-- CreateIndex
CREATE INDEX "Author_username_password_idx" ON "Author"("username", "password");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_author_id_key" ON "Membership"("author_id");

-- CreateIndex
CREATE INDEX "Membership_author_id_idx" ON "Membership"("author_id");

-- CreateIndex
CREATE INDEX "Membership_status_idx" ON "Membership"("status");

-- CreateIndex
CREATE INDEX "Follows_following_id_idx" ON "Follows"("following_id");

-- CreateIndex
CREATE UNIQUE INDEX "Follows_follower_id_following_id_key" ON "Follows"("follower_id", "following_id");

-- CreateIndex
CREATE INDEX "Comment_post_id_idx" ON "Comment"("post_id");

-- CreateIndex
CREATE INDEX "Comment_parent_id_idx" ON "Comment"("parent_id");

-- CreateIndex
CREATE INDEX "Comment_author_id_idx" ON "Comment"("author_id");

-- CreateIndex
CREATE INDEX "Likes_liked_by_idx" ON "Likes"("liked_by");

-- CreateIndex
CREATE INDEX "Likes_post_id_idx" ON "Likes"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "Likes_post_id_liked_by_key" ON "Likes"("post_id", "liked_by");

-- CreateIndex
CREATE INDEX "Session_author_id_idx" ON "Session"("author_id");

-- CreateIndex
CREATE UNIQUE INDEX "Email_template_id_key" ON "Email"("template_id");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_name_key" ON "Permission"("name");

-- CreateIndex
CREATE INDEX "Post_author_id_idx" ON "Post"("author_id");

-- CreateIndex
CREATE INDEX "Post_author_id_status_slug_idx" ON "Post"("author_id", "status", "slug");

-- CreateIndex
CREATE INDEX "FeaturedWeek_post_id_idx" ON "FeaturedWeek"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "FeaturedWeek_post_id_key" ON "FeaturedWeek"("post_id");

-- CreateIndex
CREATE INDEX "RolePermissions_permission_id_idx" ON "RolePermissions"("permission_id");

-- CreateIndex
CREATE INDEX "RolePermissions_role_id_idx" ON "RolePermissions"("role_id");

-- CreateIndex
CREATE INDEX "PageViews_author_id_idx" ON "PageViews"("author_id");

-- CreateIndex
CREATE INDEX "PageViews_post_id_idx" ON "PageViews"("post_id");

-- CreateIndex
CREATE INDEX "PageViews_view_type_idx" ON "PageViews"("view_type");

-- CreateIndex
CREATE INDEX "PageViews_author_id_post_id_idx" ON "PageViews"("author_id", "post_id");

-- CreateIndex
CREATE UNIQUE INDEX "PageViews_post_id_view_type_key" ON "PageViews"("post_id", "view_type");

-- CreateIndex
CREATE UNIQUE INDEX "PageViews_author_id_view_type_key" ON "PageViews"("author_id", "view_type");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Setting_author_id_key" ON "Setting"("author_id");

-- CreateIndex
CREATE INDEX "Setting_author_id_idx" ON "Setting"("author_id");

-- CreateIndex
CREATE INDEX "Subscriber_author_id_idx" ON "Subscriber"("author_id");

-- CreateIndex
CREATE UNIQUE INDEX "Subscriber_email_author_id_key" ON "Subscriber"("email", "author_id");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE INDEX "Upload_author_id_idx" ON "Upload"("author_id");

-- CreateIndex
CREATE UNIQUE INDEX "Domain_author_id_key" ON "Domain"("author_id");

-- CreateIndex
CREATE UNIQUE INDEX "EmailTemplates_template_key" ON "EmailTemplates"("template");

-- CreateIndex
CREATE INDEX "PageTimeLog_post_id_idx" ON "PageTimeLog"("post_id");

-- CreateIndex
CREATE INDEX "PageTimeLog_ip_post_id_idx" ON "PageTimeLog"("ip", "post_id");

-- CreateIndex
CREATE UNIQUE INDEX "PageTimeLog_ip_post_id_key" ON "PageTimeLog"("ip", "post_id");

-- CreateIndex
CREATE UNIQUE INDEX "_PostToTag_AB_unique" ON "_PostToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_PostToTag_B_index" ON "_PostToTag"("B");

