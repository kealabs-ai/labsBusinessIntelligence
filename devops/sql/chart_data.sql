-- Inserir dados para gráfico de linha
INSERT INTO chart_data (type, month, value) VALUES
('line', 'Jan', 120),
('line', 'Fev', 190),
('line', 'Mar', 300),
('line', 'Abr', 500),
('line', 'Mai', 200),
('line', 'Jun', 300);

-- Inserir dados para gráfico de área
INSERT INTO chart_data (type, month, value) VALUES
('area', 'Jan', 400),
('area', 'Fev', 300),
('area', 'Mar', 200),
('area', 'Abr', 278),
('area', 'Mai', 189),
('area', 'Jun', 239);

-- Inserir dados para gráfico de dispersão
INSERT INTO chart_data (type, x, y) VALUES
('scatter', 100, 200),
('scatter', 120, 100),
('scatter', 170, 300),
('scatter', 140, 250),
('scatter', 150, 400),
('scatter', 110, 280);

-- Criar tabela para KPIs
CREATE TABLE IF NOT EXISTS kpi_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    metric_name VARCHAR(50) NOT NULL,
    metric_value DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir dados de KPI
INSERT INTO kpi_data (metric_name, metric_value) VALUES
('revenue', 125000.00),
('growth', 15.5),
('performance', 87.3);