-- Tabela para armazenamento das instâncias do WhatsApp Evolution API (MySQL 9)
CREATE TABLE whatsapp_instances (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    kea_client_id INT NULL,
    instance_name VARCHAR(100) NOT NULL UNIQUE,
    qr_code TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status BOOLEAN DEFAULT FALSE,
    
    -- Índices para performance
    INDEX idx_user_id (user_id),
    INDEX idx_kea_client_id (kea_client_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Comentários das colunas
ALTER TABLE whatsapp_instances 
MODIFY COLUMN id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID único da instância',
MODIFY COLUMN user_id INT NOT NULL COMMENT 'ID do usuário proprietário da instância',
MODIFY COLUMN kea_client_id INT NULL COMMENT 'ID do cliente KEA associado (opcional)',
MODIFY COLUMN instance_name VARCHAR(100) NOT NULL UNIQUE COMMENT 'Nome único da instância no Evolution API',
MODIFY COLUMN qr_code TEXT NULL COMMENT 'QR Code em base64 para conexão',
MODIFY COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Data e hora de criação da instância',
MODIFY COLUMN status BOOLEAN DEFAULT FALSE COMMENT 'Status da instância (FALSE=desconectada, TRUE=conectada)';