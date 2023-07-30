-- DropForeignKey
ALTER TABLE `Author` DROP FOREIGN KEY `Author_role_id_fkey`;

-- DropForeignKey
ALTER TABLE `Domain` DROP FOREIGN KEY `Domain_author_id_fkey`;

-- DropForeignKey
ALTER TABLE `Post` DROP FOREIGN KEY `Post_author_id_fkey`;

-- DropForeignKey
ALTER TABLE `RolePermissions` DROP FOREIGN KEY `RolePermissions_permission_id_fkey`;

-- DropForeignKey
ALTER TABLE `RolePermissions` DROP FOREIGN KEY `RolePermissions_role_id_fkey`;

-- DropForeignKey
ALTER TABLE `Setting` DROP FOREIGN KEY `Setting_author_id_fkey`;

-- DropForeignKey
ALTER TABLE `Subscriber` DROP FOREIGN KEY `Subscriber_author_id_fkey`;

-- DropForeignKey
ALTER TABLE `Upload` DROP FOREIGN KEY `Upload_author_id_fkey`;

-- DropForeignKey
ALTER TABLE `_PostToTag` DROP FOREIGN KEY `_posttotag_ibfk_1`;

-- DropForeignKey
ALTER TABLE `_PostToTag` DROP FOREIGN KEY `_posttotag_ibfk_2`;

-- RenameIndex
ALTER TABLE `Author` RENAME INDEX `Author_role_id_fkey` TO `Author_role_id_idx`;

-- RenameIndex
ALTER TABLE `Post` RENAME INDEX `Post_author_id_fkey` TO `Post_author_id_idx`;

-- RenameIndex
ALTER TABLE `RolePermissions` RENAME INDEX `RolePermissions_permission_id_fkey` TO `RolePermissions_permission_id_idx`;

-- RenameIndex
ALTER TABLE `RolePermissions` RENAME INDEX `RolePermissions_role_id_fkey` TO `RolePermissions_role_id_idx`;

-- RenameIndex
ALTER TABLE `Subscriber` RENAME INDEX `Subscriber_author_id_fkey` TO `Subscriber_author_id_idx`;

-- RenameIndex
ALTER TABLE `Upload` RENAME INDEX `Upload_author_id_fkey` TO `Upload_author_id_idx`;
