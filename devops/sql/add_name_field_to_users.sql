-- Adicionar campo name na tabela users
ALTER TABLE users ADD COLUMN name VARCHAR(255) NOT NULL DEFAULT '';

-- Atualizar registros existentes com o username como name temporário
UPDATE users SET name = username WHERE name = '';

-- Criar índice para o campo name
CREATE INDEX idx_users_name ON users(name);