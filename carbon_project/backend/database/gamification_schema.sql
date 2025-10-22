-- Gamification tables for rewards, badges, and streaks

-- User rewards and badges
CREATE TABLE IF NOT EXISTS user_rewards (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    badge_name VARCHAR(100) NOT NULL,
    badge_type ENUM('eco_starter', 'green_hero', 'carbon_warrior', 'planet_saver', 'eco_champion') NOT NULL,
    level INT DEFAULT 1,
    points INT DEFAULT 0,
    streak_days INT DEFAULT 0,
    last_activity_date DATE,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
);

-- OCR shopping bill records
CREATE TABLE IF NOT EXISTS ocr_records (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    file_path VARCHAR(500),
    extracted_text TEXT,
    products_detected JSON,
    total_emissions DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
);

-- User offsets for carbon marketplace
CREATE TABLE IF NOT EXISTS user_offsets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    project_name VARCHAR(255),
    offset_amount DECIMAL(10, 2),
    cost DECIMAL(10, 2),
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
);

