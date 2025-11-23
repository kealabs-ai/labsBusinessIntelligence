-- MySQL
CREATE TABLE IF NOT EXISTS agendamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente VARCHAR(255) NOT NULL,
    servico VARCHAR(255) NOT NULL,
    data DATE NOT NULL,
    hora TIME NOT NULL,
    whatsapp_number VARCHAR(20),
    custom_message TEXT,
    enable_notification BOOLEAN DEFAULT FALSE,
    notification_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_data_hora (data, hora),
    INDEX idx_notification (enable_notification, notification_sent)
);

-- SQL Server
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='agendamentos' AND xtype='U')
CREATE TABLE agendamentos (
    id INT IDENTITY(1,1) PRIMARY KEY,
    cliente NVARCHAR(255) NOT NULL,
    servico NVARCHAR(255) NOT NULL,
    data DATE NOT NULL,
    hora TIME NOT NULL,
    whatsapp_number NVARCHAR(20),
    custom_message NTEXT,
    enable_notification BIT DEFAULT 0,
    notification_sent BIT DEFAULT 0,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
);

-- Índices para SQL Server
CREATE INDEX idx_data_hora ON agendamentos (data, hora);
CREATE INDEX idx_notification ON agendamentos (enable_notification, notification_sent);