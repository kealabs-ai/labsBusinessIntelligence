-- Tabela para armazenamento das instâncias do WhatsApp Evolution API
CREATE TABLE whatsapp_instances (
    id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    kea_client_id INT NULL,
    instance_name VARCHAR(100) NOT NULL UNIQUE,
    qr_code TEXT NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    status BIT DEFAULT 0,
    
    -- Índices para performance
    INDEX IX_whatsapp_instances_user_id (user_id),
    INDEX IX_whatsapp_instances_kea_client_id (kea_client_id),
    INDEX IX_whatsapp_instances_status (status),
    INDEX IX_whatsapp_instances_created_at (created_at)
);

-- Comentários das colunas
EXEC sp_addextendedproperty 
    @name = N'MS_Description', @value = N'ID único da instância',
    @level0type = N'Schema', @level0name = dbo,
    @level1type = N'Table', @level1name = whatsapp_instances,
    @level2type = N'Column', @level2name = id;

EXEC sp_addextendedproperty 
    @name = N'MS_Description', @value = N'ID do usuário proprietário da instância',
    @level0type = N'Schema', @level0name = dbo,
    @level1type = N'Table', @level1name = whatsapp_instances,
    @level2type = N'Column', @level2name = user_id;

EXEC sp_addextendedproperty 
    @name = N'MS_Description', @value = N'ID do cliente KEA associado (opcional)',
    @level0type = N'Schema', @level0name = dbo,
    @level1type = N'Table', @level1name = whatsapp_instances,
    @level2type = N'Column', @level2name = kea_client_id;

EXEC sp_addextendedproperty 
    @name = N'MS_Description', @value = N'Nome único da instância no Evolution API',
    @level0type = N'Schema', @level0name = dbo,
    @level1type = N'Table', @level1name = whatsapp_instances,
    @level2type = N'Column', @level2name = instance_name;

EXEC sp_addextendedproperty 
    @name = N'MS_Description', @value = N'QR Code em base64 para conexão',
    @level0type = N'Schema', @level0name = dbo,
    @level1type = N'Table', @level1name = whatsapp_instances,
    @level2type = N'Column', @level2name = qr_code;

EXEC sp_addextendedproperty 
    @name = N'MS_Description', @value = N'Data e hora de criação da instância',
    @level0type = N'Schema', @level0name = dbo,
    @level1type = N'Table', @level1name = whatsapp_instances,
    @level2type = N'Column', @level2name = created_at;

EXEC sp_addextendedproperty 
    @name = N'MS_Description', @value = N'Status da instância (0=desconectada, 1=conectada)',
    @level0type = N'Schema', @level0name = dbo,
    @level1type = N'Table', @level1name = whatsapp_instances,
    @level2type = N'Column', @level2name = status;