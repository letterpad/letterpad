-- AlterTable
ALTER TABLE `Author` ADD COLUMN `last_seen` DATETIME(3) NULL,
    ADD COLUMN `login_type` VARCHAR(191) NOT NULL DEFAULT 'credentials';
