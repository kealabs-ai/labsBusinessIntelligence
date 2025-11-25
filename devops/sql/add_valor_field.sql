-- Adicionar campo valor na tabela agendamentos
ALTER TABLE agendamentos ADD COLUMN valor DECIMAL(10,2) NULL;
CREATE INDEX idx_agendamentos_valor ON agendamentos(valor);