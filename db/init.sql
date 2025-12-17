-- Ensure you are using a database named 'murmur_db' or similar
-- This file should be placed in your 'db' directory and executed by docker-compose

-- 1. USERS Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL, -- Stores the secure hash of the password
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. MURMURS Table
CREATE TABLE murmurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    text VARCHAR(280) NOT NULL, -- Max length similar to a tweet
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. FOLLOWS Table (A user can follow many, and be followed by many)
CREATE TABLE follows (
    follower_id INT NOT NULL,
    followed_id INT NOT NULL,
    PRIMARY KEY (follower_id, followed_id),
    FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (followed_id) REFERENCES users(id) ON DELETE CASCADE,
    CHECK (follower_id != followed_id) -- A user cannot follow themselves
);

-- 4. LIKES Table (A user can like many murmurs)
CREATE TABLE likes (
    user_id INT NOT NULL,
    murmur_id INT NOT NULL,
    liked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, murmur_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (murmur_id) REFERENCES murmurs(id) ON DELETE CASCADE
);

-- 5. SESSIONS Table (Optional for authentication)
CREATE TABLE sessions (
    token VARCHAR(255) PRIMARY KEY, -- Use as the session token
    user_id INT NOT NULL,
    expires_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Optional: Create indexes for faster lookups
CREATE INDEX idx_murmur_user ON murmurs (user_id);
CREATE INDEX idx_follows_followed ON follows (followed_id);