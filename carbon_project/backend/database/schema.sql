-- Carbon Footprint Database Schema
-- MySQL Database Design for User Management, Authentication, and Carbon Footprint Tracking

-- Create database
CREATE DATABASE IF NOT EXISTS carbon_footprint_db;
USE carbon_footprint_db;

-- Simple users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_email (email)
);

-- Carbon footprint calculations table
CREATE TABLE carbon_footprints (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    calculation_uuid VARCHAR(36) UNIQUE NOT NULL,
    
    -- Input data (stored as JSON for flexibility)
    input_data JSON NOT NULL,
    
    -- Calculated results
    total_emissions DECIMAL(10, 2) NOT NULL,
    confidence_score DECIMAL(5, 4) NOT NULL, -- 0.0000 to 1.0000
    model_name VARCHAR(100) NOT NULL,
    model_version VARCHAR(50),
    
    -- Breakdown by category
    electricity_emissions DECIMAL(10, 2) DEFAULT 0,
    transportation_emissions DECIMAL(10, 2) DEFAULT 0,
    heating_emissions DECIMAL(10, 2) DEFAULT 0,
    waste_emissions DECIMAL(10, 2) DEFAULT 0,
    lifestyle_emissions DECIMAL(10, 2) DEFAULT 0,
    other_emissions DECIMAL(10, 2) DEFAULT 0,
    
    -- Metadata
    calculation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    is_anonymous BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_calculation_date (calculation_date),
    INDEX idx_total_emissions (total_emissions),
    INDEX idx_calculation_uuid (calculation_uuid)
);

-- Recommendations table for personalized suggestions
CREATE TABLE recommendations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    carbon_footprint_id INT NOT NULL,
    category VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    action_required TEXT NOT NULL,
    potential_savings VARCHAR(255) NOT NULL,
    priority ENUM('high', 'medium', 'low') NOT NULL,
    estimated_impact DECIMAL(5, 2), -- Percentage reduction
    is_implemented BOOLEAN DEFAULT FALSE,
    implemented_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (carbon_footprint_id) REFERENCES carbon_footprints(id) ON DELETE CASCADE,
    INDEX idx_carbon_footprint_id (carbon_footprint_id),
    INDEX idx_priority (priority),
    INDEX idx_category (category)
);

-- User goals and targets
CREATE TABLE user_goals (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    goal_type ENUM('emission_reduction', 'carbon_neutral', 'specific_target') NOT NULL,
    target_emissions DECIMAL(10, 2),
    reduction_percentage DECIMAL(5, 2),
    target_date DATE NOT NULL,
    description TEXT,
    is_achieved BOOLEAN DEFAULT FALSE,
    achieved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_target_date (target_date),
    INDEX idx_is_achieved (is_achieved)
);

-- Simple sessions table
CREATE TABLE user_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_session_token (session_token),
    INDEX idx_expires_at (expires_at)
);

-- Audit log for tracking changes
CREATE TABLE audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_table_name (table_name),
    INDEX idx_created_at (created_at)
);

-- System configuration
CREATE TABLE system_config (
    id INT PRIMARY KEY AUTO_INCREMENT,
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_config_key (config_key),
    INDEX idx_is_active (is_active)
);

-- Insert default system configuration
INSERT INTO system_config (config_key, config_value, description) VALUES
('app_version', '1.0.0', 'Current application version'),
('maintenance_mode', 'false', 'System maintenance mode'),
('max_calculations_per_day', '100', 'Maximum calculations per user per day'),
('session_timeout_hours', '24', 'User session timeout in hours'),
('password_min_length', '8', 'Minimum password length'),
('email_verification_required', 'true', 'Require email verification for new users');

-- Create views for common queries
CREATE VIEW user_carbon_summary AS
SELECT 
    u.id as user_id,
    u.name,
    u.email,
    COUNT(cf.id) as total_calculations,
    MAX(cf.calculation_date) as last_calculation,
    AVG(cf.total_emissions) as average_emissions,
    MIN(cf.total_emissions) as min_emissions,
    MAX(cf.total_emissions) as max_emissions,
    SUM(CASE WHEN cf.calculation_date >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as calculations_last_30_days
FROM users u
LEFT JOIN carbon_footprints cf ON u.id = cf.user_id
GROUP BY u.id, u.name, u.email;

CREATE VIEW recent_calculations AS
SELECT 
    cf.id,
    cf.user_id,
    u.name,
    cf.total_emissions,
    cf.confidence_score,
    cf.model_name,
    cf.calculation_date,
    cf.electricity_emissions,
    cf.transportation_emissions,
    cf.heating_emissions,
    cf.waste_emissions,
    cf.lifestyle_emissions
FROM carbon_footprints cf
JOIN users u ON cf.user_id = u.id
WHERE cf.calculation_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY cf.calculation_date DESC;

-- Create stored procedures for common operations
DELIMITER //

-- Procedure to get user's carbon footprint history
CREATE PROCEDURE GetUserCarbonHistory(IN p_user_id INT, IN p_limit INT DEFAULT 50)
BEGIN
    SELECT 
        cf.id,
        cf.calculation_uuid,
        cf.total_emissions,
        cf.confidence_score,
        cf.model_name,
        cf.electricity_emissions,
        cf.transportation_emissions,
        cf.heating_emissions,
        cf.waste_emissions,
        cf.lifestyle_emissions,
        cf.calculation_date,
        COUNT(r.id) as recommendation_count
    FROM carbon_footprints cf
    LEFT JOIN recommendations r ON cf.id = r.carbon_footprint_id
    WHERE cf.user_id = p_user_id
    GROUP BY cf.id
    ORDER BY cf.calculation_date DESC
    LIMIT p_limit;
END //

-- Procedure to calculate user statistics
CREATE PROCEDURE GetUserStats(IN p_user_id INT)
BEGIN
    SELECT 
        COUNT(cf.id) as total_calculations,
        AVG(cf.total_emissions) as average_emissions,
        MIN(cf.total_emissions) as min_emissions,
        MAX(cf.total_emissions) as max_emissions,
        STDDEV(cf.total_emissions) as emissions_stddev,
        COUNT(CASE WHEN cf.calculation_date >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as calculations_last_30_days,
        COUNT(CASE WHEN cf.calculation_date >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as calculations_last_7_days,
        MAX(cf.calculation_date) as last_calculation_date
    FROM carbon_footprints cf
    WHERE cf.user_id = p_user_id;
END //

-- Procedure to clean up expired sessions
CREATE PROCEDURE CleanupExpiredSessions()
BEGIN
    DELETE FROM user_sessions 
    WHERE expires_at < NOW();
END //

DELIMITER ;

-- Create triggers for audit logging
DELIMITER //

CREATE TRIGGER users_audit_insert
AFTER INSERT ON users
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (user_id, action, table_name, record_id, new_values, created_at)
    VALUES (NEW.id, 'INSERT', 'users', NEW.id, JSON_OBJECT('email', NEW.email, 'name', NEW.name), NOW());
END //

CREATE TRIGGER users_audit_update
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (user_id, action, table_name, record_id, old_values, new_values, created_at)
    VALUES (NEW.id, 'UPDATE', 'users', NEW.id, 
            JSON_OBJECT('email', OLD.email, 'name', OLD.name),
            JSON_OBJECT('email', NEW.email, 'name', NEW.name),
            NOW());
END //

CREATE TRIGGER carbon_footprints_audit_insert
AFTER INSERT ON carbon_footprints
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (user_id, action, table_name, record_id, new_values, created_at)
    VALUES (NEW.user_id, 'INSERT', 'carbon_footprints', NEW.id, 
            JSON_OBJECT('total_emissions', NEW.total_emissions, 'calculation_date', NEW.calculation_date), NOW());
END //

DELIMITER ;

-- Create indexes for performance optimization
CREATE INDEX idx_carbon_footprints_user_date ON carbon_footprints(user_id, calculation_date);
CREATE INDEX idx_carbon_footprints_emissions ON carbon_footprints(total_emissions);
CREATE INDEX idx_recommendations_priority ON recommendations(priority, category);
CREATE INDEX idx_user_goals_target_date ON user_goals(user_id, target_date, is_achieved);
CREATE INDEX idx_audit_logs_user_action ON audit_logs(user_id, action, created_at);

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON carbon_footprint_db.* TO 'carbon_app_user'@'localhost' IDENTIFIED BY 'secure_password';
-- FLUSH PRIVILEGES;
