-- AlterTable
ALTER TABLE `Setting` ADD COLUMN `show_about_page` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `show_tags_page` BOOLEAN NOT NULL DEFAULT false;
