-- Migração para sistema multiusuário
-- Adicionar coluna user_id nas tabelas existentes

-- Tabela agendamentos
ALTER TABLE agendamentos ADD COLUMN user_id INT;
ALTER TABLE agendamentos ADD CONSTRAINT fk_agendamentos_user 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
CREATE INDEX idx_agendamentos_user_id ON agendamentos(user_id);

-- Tabela contacts
ALTER TABLE contacts ADD COLUMN user_id INT;
ALTER TABLE contacts ADD CONSTRAINT fk_contacts_user 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
CREATE INDEX idx_contacts_user_id ON contacts(user_id);

-- Tabela chart_data (se existir)
ALTER TABLE chart_data ADD COLUMN user_id INT;
ALTER TABLE chart_data ADD CONSTRAINT fk_chart_data_user 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
CREATE INDEX idx_chart_data_user_id ON chart_data(user_id);

-- Tabela kpi_data (se existir)
ALTER TABLE kpi_data ADD COLUMN user_id INT;
ALTER TABLE kpi_data ADD CONSTRAINT fk_kpi_data_user 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
CREATE INDEX idx_kpi_data_user_id ON kpi_data(user_id);