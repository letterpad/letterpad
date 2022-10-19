/*
  Warnings:

  - Added the required column `page_data` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Post` ADD COLUMN `page_data` TEXT NOT NULL,
    ADD COLUMN `page_type` VARCHAR(191) NOT NULL DEFAULT 'default';
