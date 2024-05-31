-- AlterTable
ALTER TABLE `Author` ADD COLUMN `first_post_published` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `profile_updated` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `settings_updated` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable Badge
CREATE TABLE `Badge` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `author_id` INT NOT NULL,
    `createdAt` DATETIME NOT NULL,
    `updatedAt` DATETIME NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`author_id`) REFERENCES `Author`(`id`)
);
