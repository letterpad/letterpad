-- CreateTable
CREATE TABLE `EmailTemplates` (
    `template` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `body` VARCHAR(2000) NOT NULL,

    UNIQUE INDEX `EmailTemplates_template_key`(`template`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
