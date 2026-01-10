-- Criar tabela roles se não existir
CREATE TABLE IF NOT EXISTS roles (
    role_id INT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir roles padrão se a tabela estiver vazia
INSERT IGNORE INTO roles (role_id, name, description) VALUES
(1, 'Administrador', 'Acesso total ao sistema'),
(2, 'Gerente', 'Acesso gerencial e relatórios'),
(3, 'Operador', 'Acesso operacional limitado'),
(4, 'Usuário', 'Acesso básico ao sistema');