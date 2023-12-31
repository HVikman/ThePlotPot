-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema plotpot
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema plotpot
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `plotpot` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `plotpot` ;

-- -----------------------------------------------------
-- Table `plotpot`.`users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `plotpot`.`users` ;

CREATE TABLE IF NOT EXISTS `plotpot`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `createdAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `coffee` VARCHAR(255) NULL DEFAULT NULL,
  `is_activated` TINYINT(1) NOT NULL DEFAULT '0',
  `activation_token` VARCHAR(255) NULL DEFAULT NULL,
  `password_reset_token` VARCHAR(255) NULL DEFAULT NULL,
  `has_superpowers` TINYINT(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username` (`username` ASC) VISIBLE,
  UNIQUE INDEX `email` (`email` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 18
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `plotpot`.`stories`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `plotpot`.`stories` ;

CREATE TABLE IF NOT EXISTS `plotpot`.`stories` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `authorId` INT NULL DEFAULT NULL,
  `createdAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `genre` VARCHAR(50) NOT NULL,
  `description` TEXT NULL DEFAULT NULL,
  `deleted_at` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `authorId` (`authorId` ASC) VISIBLE,
  INDEX `idx_stories_deleted_at` (`deleted_at` ASC) VISIBLE,
  CONSTRAINT `stories_ibfk_1`
    FOREIGN KEY (`authorId`)
    REFERENCES `plotpot`.`users` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 52
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `plotpot`.`chapters`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `plotpot`.`chapters` ;

CREATE TABLE IF NOT EXISTS `plotpot`.`chapters` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `storyId` INT NULL DEFAULT NULL,
  `content` TEXT NOT NULL,
  `branch` INT NOT NULL,
  `parentChapterId` INT NULL DEFAULT NULL,
  `authorId` INT NULL DEFAULT NULL,
  `createdAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `title` VARCHAR(255) NULL DEFAULT NULL,
  `deleted_at` DATETIME NULL DEFAULT NULL,
  `reads_count` INT NULL DEFAULT '0',
  `votes_count` INT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  INDEX `storyId` (`storyId` ASC) VISIBLE,
  INDEX `parentChapterId` (`parentChapterId` ASC) VISIBLE,
  INDEX `authorId` (`authorId` ASC) VISIBLE,
  INDEX `idx_chapters_deleted_at` (`deleted_at` ASC) VISIBLE,
  CONSTRAINT `chapters_ibfk_1`
    FOREIGN KEY (`storyId`)
    REFERENCES `plotpot`.`stories` (`id`),
  CONSTRAINT `chapters_ibfk_2`
    FOREIGN KEY (`parentChapterId`)
    REFERENCES `plotpot`.`chapters` (`id`),
  CONSTRAINT `chapters_ibfk_3`
    FOREIGN KEY (`authorId`)
    REFERENCES `plotpot`.`users` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 125
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `plotpot`.`chapter_reads`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `plotpot`.`chapter_reads` ;

CREATE TABLE IF NOT EXISTS `plotpot`.`chapter_reads` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `chapterId` INT NULL DEFAULT NULL,
  `userId` INT NULL DEFAULT NULL,
  `IDorIP` VARCHAR(255) NULL DEFAULT NULL,
  `ipAddress` VARCHAR(45) NULL DEFAULT NULL,
  `viewedAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `unique_chapter_idorip` (`chapterId` ASC, `IDorIP` ASC) VISIBLE,
  INDEX `userId` (`userId` ASC) VISIBLE,
  CONSTRAINT `chapter_reads_ibfk_1`
    FOREIGN KEY (`chapterId`)
    REFERENCES `plotpot`.`chapters` (`id`),
  CONSTRAINT `chapter_reads_ibfk_2`
    FOREIGN KEY (`userId`)
    REFERENCES `plotpot`.`users` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 15
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `plotpot`.`comments`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `plotpot`.`comments` ;

CREATE TABLE IF NOT EXISTS `plotpot`.`comments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `chapterId` INT NULL DEFAULT NULL,
  `userId` INT NULL DEFAULT NULL,
  `content` TEXT NOT NULL,
  `createdAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `deletedAt` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `chapterId` (`chapterId` ASC) VISIBLE,
  INDEX `userId` (`userId` ASC) VISIBLE,
  CONSTRAINT `comments_ibfk_1`
    FOREIGN KEY (`chapterId`)
    REFERENCES `plotpot`.`chapters` (`id`),
  CONSTRAINT `comments_ibfk_2`
    FOREIGN KEY (`userId`)
    REFERENCES `plotpot`.`users` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 47
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `plotpot`.`votes`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `plotpot`.`votes` ;

CREATE TABLE IF NOT EXISTS `plotpot`.`votes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `chapterId` INT NULL DEFAULT NULL,
  `userId` INT NULL DEFAULT NULL,
  `createdAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `chapterId` (`chapterId` ASC) VISIBLE,
  INDEX `userId` (`userId` ASC) VISIBLE,
  CONSTRAINT `votes_ibfk_1`
    FOREIGN KEY (`chapterId`)
    REFERENCES `plotpot`.`chapters` (`id`),
  CONSTRAINT `votes_ibfk_2`
    FOREIGN KEY (`userId`)
    REFERENCES `plotpot`.`users` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 72
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

USE `plotpot` ;

-- -----------------------------------------------------
-- procedure DeleteComments
-- -----------------------------------------------------

USE `plotpot`;
DROP procedure IF EXISTS `plotpot`.`DeleteComments`;

DELIMITER $$
USE `plotpot`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `DeleteComments`(IN targetChapterId INT)
BEGIN
    UPDATE comments
    SET deletedAt = NOW()
    WHERE chapterId = targetChapterId AND deletedAt IS NULL;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure UpdateChapterCounts
-- -----------------------------------------------------

USE `plotpot`;
DROP procedure IF EXISTS `plotpot`.`UpdateChapterCounts`;

DELIMITER $$
USE `plotpot`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateChapterCounts`()
BEGIN
    UPDATE chapters c
    SET votes_count = (
        SELECT COUNT(*)
        FROM votes v
        WHERE v.chapterId = c.id
    );
    UPDATE chapters c
    SET reads_count = (
        SELECT COUNT(*)
        FROM chapter_reads r 
        WHERE r.chapterId = c.id
    );

END$$

DELIMITER ;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
