-- CreateTable
CREATE TABLE `FeaturedWeek` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `post_id` INTEGER NOT NULL,
    `week_number` INTEGER NOT NULL,

    INDEX `FeaturedWeek_post_id_idx`(`post_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
