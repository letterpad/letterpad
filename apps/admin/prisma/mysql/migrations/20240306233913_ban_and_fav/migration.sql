/*
  Warnings:

  - You are about to drop the column `analytics_id` on the `Author` table. All the data in the column will be lost.
  - You are about to drop the column `analytics_uuid` on the `Author` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Author` DROP COLUMN `analytics_id`,
    DROP COLUMN `analytics_uuid`,
    ADD COLUMN `favourite` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Post` ADD COLUMN `banned` BOOLEAN NOT NULL DEFAULT false;
