-- Users tabel
CREATE TABLE IF NOT EXISTS Users (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin', 'webmaster') DEFAULT 'user',
  active BOOLEAN DEFAULT true,
  lastLogin DATETIME,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  INDEX idx_email (email),
  INDEX idx_role (role)
);

-- Events tabel
CREATE TABLE IF NOT EXISTS Events (
  id CHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  time VARCHAR(5) NOT NULL,
  location VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  imageUrl VARCHAR(255) NOT NULL,
  imagePublicId VARCHAR(255) NOT NULL,
  createdBy CHAR(36),
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (createdBy) REFERENCES Users(id),
  INDEX idx_date (date),
  INDEX idx_createdBy (createdBy)
); 