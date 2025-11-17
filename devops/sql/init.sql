CREATE DATABASE IF NOT EXISTS labsbi_mysql_db;
USE labsbi_mysql_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE chart_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    category VARCHAR(100),
    label VARCHAR(100),
    value DECIMAL(10,2),
    percentage DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dados de exemplo (senha: admin123)
INSERT INTO users (username, email, password_hash) VALUES 
('admin', 'admin@labsbi.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9');

INSERT INTO chart_data (type, category, value) VALUES 
('bar', 'Vendas', 1500.00),
('bar', 'Marketing', 800.00),
('bar', 'Suporte', 600.00),
('bar', 'Desenvolvimento', 2000.00);

INSERT INTO chart_data (type, label, percentage) VALUES 
('pie', 'Produto A', 35.5),
('pie', 'Produto B', 28.3),
('pie', 'Produto C', 20.1),
('pie', 'Produto D', 16.1);