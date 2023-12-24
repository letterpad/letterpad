-- AlterTable
ALTER TABLE `Setting` ADD COLUMN `openai_key` VARCHAR(300) NOT NULL DEFAULT '';

-- CreateIndex
CREATE INDEX `Setting_author_id_idx` ON `Setting`(`author_id`);
