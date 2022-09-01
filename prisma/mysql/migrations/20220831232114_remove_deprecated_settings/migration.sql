/*
  Warnings:

  - You are about to drop the column `social_facebook` on the `Setting` table. All the data in the column will be lost.
  - You are about to drop the column `social_github` on the `Setting` table. All the data in the column will be lost.
  - You are about to drop the column `social_instagram` on the `Setting` table. All the data in the column will be lost.
  - You are about to drop the column `social_twitter` on the `Setting` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Setting` DROP COLUMN `social_facebook`,
    DROP COLUMN `social_github`,
    DROP COLUMN `social_instagram`,
    DROP COLUMN `social_twitter`;
