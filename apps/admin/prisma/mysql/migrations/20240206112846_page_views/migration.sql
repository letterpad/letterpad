-- CreateTable
CREATE TABLE `PageViews` (
    `id` VARCHAR(191) NOT NULL,
    `post_id` INTEGER NULL,
    `author_id` INTEGER NOT NULL,
    `view_type` VARCHAR(191) NOT NULL,
    `count` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    INDEX `PageViews_author_id_idx`(`author_id`),
    INDEX `PageViews_post_id_idx`(`post_id`),
    INDEX `PageViews_view_type_idx`(`view_type`),
    INDEX `PageViews_author_id_post_id_idx`(`author_id`, `post_id`),
    UNIQUE INDEX `PageViews_post_id_view_type_key`(`post_id`, `view_type`),
    UNIQUE INDEX `PageViews_author_id_view_type_key`(`author_id`, `view_type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
