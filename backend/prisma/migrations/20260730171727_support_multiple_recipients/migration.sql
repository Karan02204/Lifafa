/*
  Warnings:

  - You are about to drop the column `recipient` on the `Email` table. All the data in the column will be lost.
  - The values [SENT,CANCELLED] on the enum `Email_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Email` DROP COLUMN `recipient`,
    MODIFY `subject` VARCHAR(255) NOT NULL,
    MODIFY `status` ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'PARTIAL_SUCCESS', 'FAILED') NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE `EmailRecipient` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `emailId` INTEGER NOT NULL,
    `emailAddress` VARCHAR(255) NOT NULL,
    `status` ENUM('PENDING', 'PROCESSING', 'SENT', 'FAILED') NOT NULL DEFAULT 'PENDING',
    `attempts` INTEGER NOT NULL DEFAULT 0,
    `sentAt` DATETIME(3) NULL,
    `error` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `EmailRecipient_emailId_idx`(`emailId`),
    INDEX `EmailRecipient_status_idx`(`status`),
    INDEX `EmailRecipient_emailAddress_idx`(`emailAddress`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `EmailRecipient` ADD CONSTRAINT `EmailRecipient_emailId_fkey` FOREIGN KEY (`emailId`) REFERENCES `Email`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `Email` RENAME INDEX `Email_senderId_fkey` TO `Email_senderId_idx`;
