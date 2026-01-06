-- Verificar se a coluna evolution_api_key existe na tabela whatsapp_instances
DESCRIBE whatsapp_instances;

-- Se a coluna não existir, adicionar ela
-- ALTER TABLE whatsapp_instances ADD COLUMN evolution_api_key VARCHAR(255);