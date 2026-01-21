#!/bin/bash

# Script para aplicar as permissões de unidades para gerentes
# Execute este script após fazer deploy das mudanças no código

echo "Aplicando permissões de unidades para gerentes..."

# Conectar ao banco de dados e executar os comandos SQL
mysql -h $MYSQL_HOST -P $MYSQL_PORT -u $MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE << EOF

-- Inserir o módulo de unidades se não existir
INSERT IGNORE INTO modules (name, description, route, icon) VALUES
('units', 'Gerenciamento de Unidades', '/units', 'Business');

-- Conceder permissões de unidades para todos os usuários com role de Gerente (role_id = 2)
INSERT IGNORE INTO user_permissions (user_id, module_id, can_view, can_create, can_edit, can_delete)
SELECT 
    u.id as user_id,
    m.id as module_id,
    TRUE as can_view,
    TRUE as can_create,
    TRUE as can_edit,
    FALSE as can_delete
FROM users u
CROSS JOIN modules m
WHERE u.role = 2 -- Gerente
AND m.name = 'units'
AND NOT EXISTS (
    SELECT 1 FROM user_permissions up 
    WHERE up.user_id = u.id AND up.module_id = m.id
);

-- Conceder permissões de agenda para gerentes também (se não tiverem)
INSERT IGNORE INTO user_permissions (user_id, module_id, can_view, can_create, can_edit, can_delete)
SELECT 
    u.id as user_id,
    m.id as module_id,
    TRUE as can_view,
    TRUE as can_create,
    TRUE as can_edit,
    TRUE as can_delete
FROM users u
CROSS JOIN modules m
WHERE u.role = 2 -- Gerente
AND m.name = 'agenda'
AND NOT EXISTS (
    SELECT 1 FROM user_permissions up 
    WHERE up.user_id = u.id AND up.module_id = m.id
);

EOF

echo "Permissões aplicadas com sucesso!"
echo "Gerentes agora podem:"
echo "- Visualizar, criar e editar unidades"
echo "- Acessar todas as funcionalidades da agenda"
echo "- Cadastrar novas unidades no módulo de agenda"