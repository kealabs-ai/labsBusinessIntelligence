-- Adicionar campos phone e mobile na tabela users
ALTER TABLE users ADD COLUMN phone VARCHAR(20) DEFAULT NULL;
ALTER TABLE users ADD COLUMN mobile VARCHAR(20) DEFAULT NULL;

-- Criar índices para os campos de telefone
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_mobile ON users(mobile);