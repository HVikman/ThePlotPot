const db = require('./mysql')

function createDatabase() {
  return new Promise((resolve, reject) => {
    db.query(`SHOW TABLES LIKE 'users';`, (checkErr, checkResult) => {
      if (checkErr) {
        console.error('Error checking database:', checkErr)
        return reject(checkErr)
      }

      if (checkResult.length > 0) {
        console.log('Database ok.')
        return resolve()
      }

      const sql = `
      CREATE DATABASE IF NOT EXISTS theplotpot CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
      USE theplotpot;

      CREATE TABLE IF NOT EXISTS users (
        id INT NOT NULL AUTO_INCREMENT,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        coffee VARCHAR(255) DEFAULT NULL,
        is_activated TINYINT(1) NOT NULL DEFAULT 0,
        activation_token VARCHAR(255) DEFAULT NULL,
        password_reset_token VARCHAR(255) DEFAULT NULL,
        has_superpowers TINYINT(1) NOT NULL DEFAULT 0,
        bannedAt DATETIME DEFAULT NULL,
        deletedAt DATETIME DEFAULT NULL,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

      CREATE TABLE IF NOT EXISTS stories (
        id INT NOT NULL AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        authorId INT DEFAULT NULL,
        createdAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        genre VARCHAR(50) NOT NULL,
        description TEXT,
        deleted_at DATETIME DEFAULT NULL,
        read_count INT NOT NULL DEFAULT 0,
        PRIMARY KEY (id),
        KEY authorId (authorId),
        KEY idx_stories_deleted_at (deleted_at),
        CONSTRAINT stories_ibfk_1 FOREIGN KEY (authorId) REFERENCES users (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

      CREATE TABLE IF NOT EXISTS chapters (
        id INT NOT NULL AUTO_INCREMENT,
        storyId INT DEFAULT NULL,
        content TEXT NOT NULL,
        branch INT NOT NULL,
        parentChapterId INT DEFAULT NULL,
        authorId INT DEFAULT NULL,
        createdAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        title VARCHAR(255) DEFAULT NULL,
        deleted_at DATETIME DEFAULT NULL,
        reads_count INT DEFAULT 0,
        votes_count INT DEFAULT 0,
        PRIMARY KEY (id),
        KEY storyId (storyId),
        KEY parentChapterId (parentChapterId),
        KEY authorId (authorId),
        KEY idx_chapters_deleted_at (deleted_at),
        CONSTRAINT chapters_ibfk_1 FOREIGN KEY (storyId) REFERENCES stories (id),
        CONSTRAINT chapters_ibfk_2 FOREIGN KEY (parentChapterId) REFERENCES chapters (id),
        CONSTRAINT chapters_ibfk_3 FOREIGN KEY (authorId) REFERENCES users (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

      CREATE TABLE IF NOT EXISTS comments (
        id INT NOT NULL AUTO_INCREMENT,
        chapterId INT DEFAULT NULL,
        userId INT DEFAULT NULL,
        content TEXT NOT NULL,
        createdAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        deletedAt TIMESTAMP DEFAULT NULL,
        PRIMARY KEY (id),
        KEY chapterId (chapterId),
        KEY userId (userId),
        CONSTRAINT comments_ibfk_1 FOREIGN KEY (chapterId) REFERENCES chapters (id),
        CONSTRAINT comments_ibfk_2 FOREIGN KEY (userId) REFERENCES users (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

      CREATE TABLE IF NOT EXISTS chapter_reads (
        id INT NOT NULL AUTO_INCREMENT,
        chapterId INT DEFAULT NULL,
        userId INT DEFAULT NULL,
        IDorIP VARCHAR(255) DEFAULT NULL,
        ipAddress VARCHAR(45) DEFAULT NULL,
        viewedAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY unique_chapter_idorip (chapterId, IDorIP),
        KEY userId (userId),
        CONSTRAINT chapter_reads_ibfk_1 FOREIGN KEY (chapterId) REFERENCES chapters (id),
        CONSTRAINT chapter_reads_ibfk_2 FOREIGN KEY (userId) REFERENCES users (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

      CREATE TABLE IF NOT EXISTS votes (
        id INT NOT NULL AUTO_INCREMENT,
        chapterId INT DEFAULT NULL,
        userId INT DEFAULT NULL,
        createdAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY chapterId (chapterId),
        KEY userId (userId),
        CONSTRAINT votes_ibfk_1 FOREIGN KEY (chapterId) REFERENCES chapters (id),
        CONSTRAINT votes_ibfk_2 FOREIGN KEY (userId) REFERENCES users (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

      DROP PROCEDURE IF EXISTS DeleteComments;
      CREATE PROCEDURE DeleteComments(IN targetChapterId INT)
      BEGIN
        UPDATE comments
        SET deletedAt = NOW()
        WHERE chapterId = targetChapterId AND deletedAt IS NULL;
      END;

      DROP PROCEDURE IF EXISTS UpdateChapterCounts;
      CREATE PROCEDURE UpdateChapterCounts()
      BEGIN
        UPDATE chapters c
        SET votes_count = (SELECT COUNT(*) FROM votes v WHERE v.chapterId = c.id);
        UPDATE chapters c
        SET reads_count = (SELECT COUNT(*) FROM chapter_reads r WHERE r.chapterId = c.id);
      END;

      DROP PROCEDURE IF EXISTS UpdateCounts;
      CREATE PROCEDURE UpdateCounts()
      BEGIN
        START TRANSACTION;
        UPDATE chapters c
          SET votes_count = (SELECT COUNT(*) FROM votes v WHERE v.chapterId = c.id);
        UPDATE chapters c
          SET reads_count = (SELECT COUNT(*) FROM chapter_reads r WHERE r.chapterId = c.id AND r.IDorIP NOT LIKE '10.%');
        UPDATE stories s
          SET read_count = (SELECT SUM(c.reads_count) FROM chapters c WHERE c.storyId = s.id);
        COMMIT;
      END;
      `

      db.query(sql, (error) => {
        if (error) {
          console.error('Error creating database:', error)
          return reject(error)
        }
        console.log('Database initialized')
        resolve()
      })
    })
  })
}

module.exports = createDatabase
