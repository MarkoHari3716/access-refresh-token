-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(250) NOT NULL,
    `last_name` VARCHAR(250) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(512) NOT NULL,
    `hashed_rt` VARCHAR(512) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
