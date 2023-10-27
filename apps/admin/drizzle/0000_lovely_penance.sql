-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `Author` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(191) NOT NULL,
	`username` varchar(191) NOT NULL,
	`email` varchar(191) NOT NULL,
	`password` varchar(191) NOT NULL,
	`bio` text NOT NULL,
	`occupation` varchar(100) NOT NULL,
	`company_name` varchar(100) NOT NULL,
	`avatar` varchar(300) NOT NULL,
	`social` varchar(500) NOT NULL DEFAULT '{}',
	`verified` tinyint NOT NULL DEFAULT 0,
	`createdAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` datetime(3),
	`verify_attempt_left` int DEFAULT 3,
	`role_id` int NOT NULL,
	`last_seen` datetime(3),
	`login_type` varchar(191) NOT NULL DEFAULT 'credentials',
	`analytics_id` int,
	`analytics_uuid` varchar(191),
	`first_post_published` tinyint NOT NULL DEFAULT 0,
	`profile_updated` tinyint NOT NULL DEFAULT 0,
	`settings_updated` tinyint NOT NULL DEFAULT 0,
	`stripe_customer_id` varchar(191),
	`stripe_subscription_id` varchar(191),
	`register_step` varchar(50) DEFAULT '',
	CONSTRAINT `Author_id` PRIMARY KEY(`id`),
	CONSTRAINT `Author_username_key` UNIQUE(`username`),
	CONSTRAINT `Author_email_key` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `Domain` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(191) NOT NULL,
	`mapped` tinyint NOT NULL DEFAULT 0,
	`ssl` tinyint NOT NULL,
	`updatedAt` datetime(3),
	`createdAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
	`author_id` int NOT NULL,
	CONSTRAINT `Domain_id` PRIMARY KEY(`id`),
	CONSTRAINT `Domain_author_id_key` UNIQUE(`author_id`)
);
--> statement-breakpoint
CREATE TABLE `Email` (
	`template_id` varchar(191) NOT NULL,
	`subject` varchar(191) NOT NULL,
	`body` varchar(4000) NOT NULL,
	`createdAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` datetime(3),
	CONSTRAINT `Email_id` PRIMARY KEY(`id`),
	CONSTRAINT `Email_template_id_key` UNIQUE(`template_id`)
);
--> statement-breakpoint
CREATE TABLE `EmailDelivery` (
	`id` int AUTO_INCREMENT NOT NULL,
	`template_id` varchar(191),
	`author_id` int,
	`post_id` int,
	`subscriber_id` int,
	`delivered` int,
	`last_delivery_attempt` datetime(3),
	`createdAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` datetime(3),
	CONSTRAINT `EmailDelivery_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Permission` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(191),
	`createdAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` datetime(3),
	CONSTRAINT `Permission_id` PRIMARY KEY(`id`),
	CONSTRAINT `Permission_name_key` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `Post` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(191) NOT NULL DEFAULT '',
	`html` text NOT NULL,
	`html_draft` text,
	`excerpt` varchar(191) NOT NULL DEFAULT '',
	`cover_image` varchar(255) NOT NULL DEFAULT '',
	`cover_image_width` int NOT NULL DEFAULT 0,
	`cover_image_height` int NOT NULL DEFAULT 0,
	`type` varchar(191) NOT NULL DEFAULT 'post',
	`featured` tinyint NOT NULL DEFAULT 0,
	`status` varchar(191) NOT NULL DEFAULT 'draft',
	`slug` varchar(191) NOT NULL DEFAULT '',
	`reading_time` varchar(191) NOT NULL DEFAULT '',
	`publishedAt` datetime(3),
	`scheduledAt` datetime(3),
	`updatedAt` datetime(3),
	`createdAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
	`author_id` int NOT NULL,
	`page_data` text NOT NULL,
	`page_type` varchar(191) NOT NULL DEFAULT 'default',
	`stats` varchar(191) NOT NULL DEFAULT '{}',
	`sub_title` varchar(190) NOT NULL DEFAULT '',
	CONSTRAINT `Post_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Role` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(191),
	`createdAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` datetime(3),
	CONSTRAINT `Role_id` PRIMARY KEY(`id`),
	CONSTRAINT `Role_name_key` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `RolePermissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`createdAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` datetime(3),
	`role_id` int NOT NULL,
	`permission_id` int NOT NULL,
	CONSTRAINT `RolePermissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Setting` (
	`id` int AUTO_INCREMENT NOT NULL,
	`site_title` varchar(191) NOT NULL,
	`site_tagline` varchar(191) NOT NULL,
	`site_email` varchar(191) NOT NULL,
	`site_url` varchar(191) NOT NULL,
	`site_footer` varchar(191) NOT NULL,
	`site_description` varchar(191) NOT NULL,
	`subscribe_embed` varchar(191) NOT NULL,
	`display_author_info` tinyint NOT NULL DEFAULT 0,
	`cloudinary_key` varchar(191) NOT NULL,
	`cloudinary_name` varchar(191) NOT NULL,
	`cloudinary_secret` varchar(191) NOT NULL,
	`menu` varchar(500) NOT NULL DEFAULT '[]',
	`css` varchar(500) NOT NULL,
	`theme` varchar(191) NOT NULL,
	`client_token` varchar(191) NOT NULL,
	`banner` varchar(300) NOT NULL DEFAULT '{}',
	`site_logo` varchar(300) NOT NULL DEFAULT '{}',
	`site_favicon` varchar(300) NOT NULL DEFAULT '{}',
	`createdAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` datetime(3),
	`graphcomment_id` varchar(191) NOT NULL DEFAULT '',
	`intro_dismissed` tinyint NOT NULL,
	`author_id` int NOT NULL,
	`show_about_page` tinyint NOT NULL DEFAULT 1,
	`show_tags_page` tinyint NOT NULL DEFAULT 0,
	`scripts` text,
	`design` varchar(300) NOT NULL DEFAULT '{}',
	CONSTRAINT `Setting_id` PRIMARY KEY(`id`),
	CONSTRAINT `Setting_author_id_key` UNIQUE(`author_id`)
);
--> statement-breakpoint
CREATE TABLE `Subscriber` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(191) NOT NULL,
	`author_id` int NOT NULL,
	`verified` tinyint NOT NULL DEFAULT 0,
	`createdAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` datetime(3),
	`verify_attempt_left` int DEFAULT 3,
	CONSTRAINT `Subscriber_id` PRIMARY KEY(`id`),
	CONSTRAINT `Subscriber_email_author_id_key` UNIQUE(`email`,`author_id`)
);
--> statement-breakpoint
CREATE TABLE `SubscribersDelivery` (
	`id` int AUTO_INCREMENT NOT NULL,
	`subscriber_id` varchar(191),
	`post_id` int NOT NULL,
	`delivered` tinyint NOT NULL,
	`createdAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` datetime(3),
	CONSTRAINT `SubscribersDelivery_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Tag` (
	`name` varchar(191) NOT NULL,
	`desc` varchar(191) DEFAULT '',
	`slug` varchar(191),
	`createdAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` datetime(3),
	CONSTRAINT `Tag_id` PRIMARY KEY(`id`),
	CONSTRAINT `Tag_name_key` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `Upload` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(191) NOT NULL,
	`url` varchar(191) NOT NULL,
	`width` int NOT NULL,
	`height` int NOT NULL,
	`description` varchar(191) NOT NULL DEFAULT '',
	`updatedAt` datetime(3),
	`createdAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
	`author_id` int NOT NULL,
	CONSTRAINT `Upload_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `_PostToTag` (
	`A` int NOT NULL,
	`B` varchar(191) NOT NULL,
	CONSTRAINT `_PostToTag_AB_unique` UNIQUE(`A`,`B`)
);
--> statement-breakpoint
CREATE TABLE `_prisma_migrations` (
	`id` varchar(36) NOT NULL,
	`checksum` varchar(64) NOT NULL,
	`finished_at` datetime(3),
	`migration_name` varchar(255) NOT NULL,
	`logs` text,
	`rolled_back_at` datetime(3),
	`started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`applied_steps_count` int unsigned NOT NULL DEFAULT 0,
	CONSTRAINT `_prisma_migrations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `Author_role_id_idx` ON `Author` (`role_id`);--> statement-breakpoint
CREATE INDEX `Post_author_id_idx` ON `Post` (`author_id`);--> statement-breakpoint
CREATE INDEX `idx_post_id` ON `Post` (`id`);--> statement-breakpoint
CREATE INDEX `idx_post_slug` ON `Post` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_post_createdAt` ON `Post` (`createdAt`);--> statement-breakpoint
CREATE INDEX `RolePermissions_permission_id_idx` ON `RolePermissions` (`permission_id`);--> statement-breakpoint
CREATE INDEX `RolePermissions_role_id_idx` ON `RolePermissions` (`role_id`);--> statement-breakpoint
CREATE INDEX `Subscriber_author_id_idx` ON `Subscriber` (`author_id`);--> statement-breakpoint
CREATE INDEX `Upload_author_id_idx` ON `Upload` (`author_id`);--> statement-breakpoint
CREATE INDEX `_PostToTag_B_index` ON `_PostToTag` (`B`);
*/