-- Verificar se a tabela whatsapp_instances existe
SHOW TABLES LIKE 'whatsapp_instances';

-- Se a tabela existir, verificar sua estrutura
DESCRIBE whatsapp_instances;

-- Verificar se há dados na tabela
SELECT COUNT(*) as total_records FROM whatsapp_instances;