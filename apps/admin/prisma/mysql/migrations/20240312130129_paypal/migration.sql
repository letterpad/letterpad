/*
  Warnings:

  - A unique constraint covering the columns `[post_id]` on the table `FeaturedWeek` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Setting` ADD COLUMN `paypal_email` VARCHAR(191) NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX `FeaturedWeek_post_id_key` ON `FeaturedWeek`(`post_id`);
