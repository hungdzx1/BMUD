-- ==========================================================
-- SQL Injection Attack & Defense Lab Database Schema
-- Table: users (Hệ thống xác thực người dùng)
-- Table: phones (Hệ thống sản phẩm điện thoại)
-- ==========================================================

DROP TABLE IF EXISTS phones;
DROP TABLE IF EXISTS users;


CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE phones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    brand VARCHAR(50) NOT NULL,
    price DECIMAL(12,0) NOT NULL,
    storage VARCHAR(20),
    color VARCHAR(50),
    quantity INT NOT NULL DEFAULT 0,
    status ENUM('on', 'off') NOT NULL DEFAULT 'off',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
