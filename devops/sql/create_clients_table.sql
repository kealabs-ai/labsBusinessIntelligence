-- MySQL version
CREATE TABLE IF NOT EXISTS clients (
    client_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone_whatsapp VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    birth_date DATE,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status BOOLEAN DEFAULT TRUE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- SQL Server version
/*
CREATE TABLE clients (
    client_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    full_name NVARCHAR(255) NOT NULL,
    phone_whatsapp NVARCHAR(20) NOT NULL,
    email NVARCHAR(255) NOT NULL,
    birth_date DATE,
    note NTEXT,
    created_at DATETIME2 DEFAULT GETDATE(),
    status BIT DEFAULT 1
);

CREATE INDEX idx_clients_user_id ON clients(user_id);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_created_at ON clients(created_at);
*/