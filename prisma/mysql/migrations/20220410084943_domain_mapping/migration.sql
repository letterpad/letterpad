-- CreateTable
CREATE TABLE `Domain` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `mapped` BOOLEAN NOT NULL DEFAULT false,
    `ssl` BOOLEAN NOT NULL,
    `updatedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `author_id` INTEGER NOT NULL,

    UNIQUE INDEX `Domain_author_id_key`(`author_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Domain` ADD CONSTRAINT `Domain_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `Author`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
