-- CreateTable
CREATE TABLE `PageTimeLog` (
    `id` VARCHAR(191) NOT NULL,
    `ip` VARCHAR(20) NOT NULL,
    `post_id` INTEGER NOT NULL,
    `snapshot` VARCHAR(500) NOT NULL,
    `page_time` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    INDEX `PageTimeLog_post_id_idx`(`post_id`),
    INDEX `PageTimeLog_ip_post_id_idx`(`ip`, `post_id`),
    UNIQUE INDEX `PageTimeLog_ip_post_id_key`(`ip`, `post_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
