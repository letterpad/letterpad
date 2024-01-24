/*
  Warnings:

  - Added the required column `signature` to the `Author` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Author` ADD COLUMN `signature` VARCHAR(400) NOT NULL;
