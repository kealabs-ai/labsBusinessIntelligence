-- Adicionar coluna de paleta de cores na tabela kea_clients
ALTER TABLE kea_clients ADD COLUMN color_palette VARCHAR(50) DEFAULT 'KEA_LABS';

-- Criar índice para performance
CREATE INDEX idx_kea_clients_color_palette ON kea_clients(color_palette);