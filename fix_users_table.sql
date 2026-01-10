-- Script para corrigir a tabela users e adicionar campos necessários

-- 1. Adicionar campo name (se não existir)
ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(255) DEFAULT NULL;

-- 2. Adicionar campos phone e mobile (se não existirem)
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20) DEFAULT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS mobile VARCHAR(20) DEFAULT NULL;

-- 3. Atualizar registros existentes que não têm name
UPDATE users SET name = username WHERE name IS NULL OR name = '';

-- 4. Criar índices (se não existirem)
CREATE INDEX IF NOT EXISTS idx_users_name ON users(name);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_mobile ON users(mobile);

-- 5. Verificar estrutura da tabela
DESCRIBE users;