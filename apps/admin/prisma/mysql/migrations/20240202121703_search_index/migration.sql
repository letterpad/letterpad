-- AlterTable
ALTER TABLE `Post` ADD COLUMN `mail_status` ENUM('ACTIVE', 'SENT', 'INACTIVE') NOT NULL DEFAULT 'INACTIVE';

-- AlterTable
ALTER TABLE `Tag` ADD COLUMN `likes` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `views` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `Follows` (
    `follower_id` INTEGER NOT NULL,
    `following_id` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    INDEX `Follows_following_id_idx`(`following_id`),
    UNIQUE INDEX `Follows_follower_id_following_id_key`(`follower_id`, `following_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Likes` (
    `post_id` INTEGER NOT NULL,
    `liked_by` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `count` INTEGER NOT NULL DEFAULT 0,
    `updatedAt` DATETIME(3) NULL,

    INDEX `Likes_liked_by_idx`(`liked_by`),
    INDEX `Likes_post_id_idx`(`post_id`),
    UNIQUE INDEX `Likes_post_id_liked_by_key`(`post_id`, `liked_by`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Post_status_mail_status_idx` ON `Post`(`status`, `mail_status`);

-- CreateIndex
CREATE INDEX `Post_author_id_status_slug_idx` ON `Post`(`author_id`, `status`, `slug`);

-- CreateIndex
CREATE FULLTEXT INDEX `Post_html_idx` ON `Post`(`html`);
