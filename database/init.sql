-- Initialize database for Yackson's World
USE yacksons_world;

-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    content TEXT NOT NULL,
    pub_date DATETIME NOT NULL,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_pub_date (pub_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    text TEXT NOT NULL,
    timestamp DATETIME NOT NULL,
    sender ENUM('user', 'other') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create images table
CREATE TABLE IF NOT EXISTS images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size INT NOT NULL,
    url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_filename (filename)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    author VARCHAR(100) DEFAULT 'Anonymous',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_rating (rating),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample blog post (migrating from existing content)
INSERT INTO blogs (title, slug, content, pub_date, category) VALUES
(
    'Hello World',
    'hello-world',
    '# Welcome to my blog!\n\nThis is the first post on the new database-backed system.',
    '2026-01-24 00:00:00',
    'announcement'
) ON DUPLICATE KEY UPDATE title=title;

-- Insert sample message
INSERT INTO messages (text, sender, timestamp) VALUES
(
    'Welcome to the messaging system!',
    'other',
    NOW()
);

-- Insert sample review
INSERT INTO reviews (title, content, rating, author) VALUES
(
    'Great website!',
    'This is an amazing website with great content. Looking forward to more updates!',
    5,
    'Sample User'
);

-- Show tables
SHOW TABLES;

-- Display initial data
SELECT 'Blogs:' AS Info;
SELECT * FROM blogs;

SELECT 'Messages:' AS Info;
SELECT * FROM messages;

SELECT 'Reviews:' AS Info;
SELECT * FROM reviews;

SELECT 'Images:' AS Info;
SELECT * FROM images;
