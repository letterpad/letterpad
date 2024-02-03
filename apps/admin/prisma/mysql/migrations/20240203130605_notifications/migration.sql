-- AlterTable
ALTER TABLE `EmailDelivery` ADD COLUMN `follower_id` INTEGER NULL,
    ADD COLUMN `following_id` INTEGER NULL;

-- CreateTable
CREATE TABLE `Notifications` (
    `notification_id` VARCHAR(191) NOT NULL,
    `author_id` INTEGER NOT NULL,
    `meta` JSON NOT NULL,
    `is_read` BOOLEAN NOT NULL DEFAULT false,
    `mail_sent` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    INDEX `Notifications_author_id_idx`(`author_id`),
    PRIMARY KEY (`notification_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
