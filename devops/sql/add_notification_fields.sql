-- Adicionar campos de configuração de notificação na tabela agendamentos
ALTER TABLE agendamentos ADD COLUMN notification_quantity INT DEFAULT 1;
ALTER TABLE agendamentos ADD COLUMN notification_unit ENUM('dias', 'semanas', 'meses') DEFAULT 'dias';
ALTER TABLE agendamentos ADD COLUMN notification_date DATETIME NULL;