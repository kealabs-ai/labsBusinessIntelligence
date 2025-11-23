-- Tabela de contatos para WhatsApp Manager
CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    last_message TEXT,
    last_message_time DATETIME,
    is_online BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    active BOOLEAN DEFAULT TRUE
);

-- Índices para otimização
CREATE INDEX idx_contacts_phone ON contacts(phone);
CREATE INDEX idx_contacts_active ON contacts(active);