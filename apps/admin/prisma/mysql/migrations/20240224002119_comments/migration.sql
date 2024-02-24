/*
  Warnings:

  - You are about to drop the column `graphcomment_id` on the `Setting` table. All the data in the column will be lost.
  - You are about to drop the column `subscribe_embed` on the `Setting` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Setting` DROP COLUMN `graphcomment_id`,
    DROP COLUMN `subscribe_embed`;

-- CreateTable
CREATE TABLE `Comment` (
    `id` VARCHAR(191) NOT NULL,
    `content` VARCHAR(300) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,
    `post_id` INTEGER NOT NULL,
    `parent_id` VARCHAR(191) NULL,
    `author_id` INTEGER NOT NULL,

    INDEX `Comment_post_id_idx`(`post_id`),
    INDEX `Comment_parent_id_idx`(`parent_id`),
    INDEX `Comment_author_id_idx`(`author_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
