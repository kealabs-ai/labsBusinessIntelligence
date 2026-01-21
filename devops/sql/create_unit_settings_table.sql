-- MySQL version
CREATE TABLE IF NOT EXISTS unit_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    unit_name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    opening_time TIME DEFAULT '08:00:00',
    closing_time TIME DEFAULT '18:00:00',
    appointment_interval INT DEFAULT 30 COMMENT 'Interval in minutes',
    notifications_enabled BOOLEAN DEFAULT TRUE,
    notification_advance_hours INT DEFAULT 24,
    kea_client_id VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id)
);

-- SQL Server version
/*
CREATE TABLE unit_settings (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    unit_name NVARCHAR(255) NOT NULL,
    address NTEXT,
    phone NVARCHAR(20),
    email NVARCHAR(255),
    opening_time TIME DEFAULT '08:00:00',
    closing_time TIME DEFAULT '18:00:00',
    appointment_interval INT DEFAULT 30, -- Interval in minutes
    notifications_enabled BIT DEFAULT 1,
    notification_advance_hours INT DEFAULT 24,
    kea_client_id NVARCHAR(50) NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
);

CREATE INDEX idx_unit_settings_user_id ON unit_settings(user_id);
*/