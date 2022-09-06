-- AlterTable
ALTER TABLE `Author` ADD COLUMN `first_post_published` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `profile_updated` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `settings_updated` BOOLEAN NOT NULL DEFAULT false;
