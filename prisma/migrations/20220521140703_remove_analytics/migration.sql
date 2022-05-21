/*
  Warnings:

  - You are about to drop the column `analytics` on the `Setting` table. All the data in the column will be lost.
  - You are about to drop the column `google_analytics` on the `Setting` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Setting` DROP COLUMN `analytics`,
    DROP COLUMN `google_analytics`;
