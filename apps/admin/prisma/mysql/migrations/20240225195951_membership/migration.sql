/*
  Warnings:

  - You are about to drop the column `stripe_customer_id` on the `Author` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_subscription_id` on the `Author` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Author` DROP COLUMN `stripe_customer_id`,
    DROP COLUMN `stripe_subscription_id`;

-- CreateTable
CREATE TABLE `Membership` (
    `id` VARCHAR(191) NOT NULL,
    `author_id` INTEGER NOT NULL,
    `stripe_customer_id` VARCHAR(191) NULL,
    `stripe_subscription_id` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Membership_author_id_key`(`author_id`),
    INDEX `Membership_author_id_idx`(`author_id`),
    INDEX `Membership_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Author_username_idx` ON `Author`(`username`);

-- CreateIndex
CREATE INDEX `Author_email_idx` ON `Author`(`email`);

-- CreateIndex
CREATE INDEX `Author_username_password_idx` ON `Author`(`username`, `password`);
