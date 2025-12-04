-- MySQL version
CREATE TABLE IF NOT EXISTS transacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    tipo ENUM('entrada', 'saida') NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    data_transacao DATETIME NOT NULL,
    metodo_pagamento VARCHAR(50) NOT NULL,
    observacoes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status BOOLEAN DEFAULT TRUE,
    INDEX idx_user_id (user_id),
    INDEX idx_tipo (tipo),
    INDEX idx_data_transacao (data_transacao),
    INDEX idx_status (status)
);

-- SQL Server version
/*
CREATE TABLE transacoes (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    tipo NVARCHAR(10) NOT NULL CHECK (tipo IN ('entrada', 'saida')),
    categoria NVARCHAR(100) NOT NULL,
    descricao NVARCHAR(255) NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    data_transacao DATETIME2 NOT NULL,
    metodo_pagamento NVARCHAR(50) NOT NULL,
    observacoes NTEXT,
    created_at DATETIME2 DEFAULT GETDATE(),
    status BIT DEFAULT 1
);

CREATE INDEX idx_transacoes_user_id ON transacoes(user_id);
CREATE INDEX idx_transacoes_tipo ON transacoes(tipo);
CREATE INDEX idx_transacoes_data ON transacoes(data_transacao);
CREATE INDEX idx_transacoes_status ON transacoes(status);
*/