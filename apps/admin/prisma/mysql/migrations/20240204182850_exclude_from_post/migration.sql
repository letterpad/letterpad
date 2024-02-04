-- AlterTable
ALTER TABLE `Author` MODIFY `signature` VARCHAR(400) NULL;

-- AlterTable
ALTER TABLE `Post` ADD COLUMN `exclude_from_home` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Session` MODIFY `token` VARCHAR(500) NOT NULL;
