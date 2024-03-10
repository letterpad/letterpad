/*
  Warnings:

  - The primary key for the `Author` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Post` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Setting` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `Author` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Comment` MODIFY `post_id` VARCHAR(191) NOT NULL,
    MODIFY `author_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Domain` MODIFY `author_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `EmailDelivery` MODIFY `author_id` VARCHAR(191) NULL,
    MODIFY `post_id` VARCHAR(191) NULL,
    MODIFY `follower_id` VARCHAR(191) NULL,
    MODIFY `following_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `FeaturedWeek` MODIFY `post_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Follows` MODIFY `follower_id` VARCHAR(191) NOT NULL,
    MODIFY `following_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Likes` MODIFY `post_id` VARCHAR(191) NOT NULL,
    MODIFY `liked_by` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Membership` MODIFY `author_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Notifications` MODIFY `author_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `PageTimeLog` MODIFY `post_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `PageViews` MODIFY `post_id` VARCHAR(191) NULL,
    MODIFY `author_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Post` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `author_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Session` MODIFY `author_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Setting` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `author_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Subscriber` MODIFY `author_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `SubscribersDelivery` MODIFY `post_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Upload` MODIFY `author_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `_PostToTag` MODIFY `A` VARCHAR(191) NOT NULL;
