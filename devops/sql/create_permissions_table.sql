-- Tabela de módulos do sistema
CREATE TABLE IF NOT EXISTS modules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255),
    route VARCHAR(100),
    icon VARCHAR(50),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de permissões por usuário e módulo
CREATE TABLE IF NOT EXISTS user_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    module_id INT NOT NULL,
    can_view BOOLEAN DEFAULT FALSE,
    can_create BOOLEAN DEFAULT FALSE,
    can_edit BOOLEAN DEFAULT FALSE,
    can_delete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_module (user_id, module_id)
);

-- Inserir módulos padrão
INSERT INTO modules (name, description, route, icon) VALUES
('dashboards', 'Visualização de Dashboards', '/charts', 'BarChart'),
('ai_assistant', 'Assistente de IA', '/ai-prompt', 'SmartToy'),
('agenda', 'Gerenciamento de Agenda', '/agenda', 'CalendarToday'),
('units', 'Gerenciamento de Unidades', '/units', 'Business'),
('admin', 'Painel Administrativo', '/admin', 'AdminPanelSettings');