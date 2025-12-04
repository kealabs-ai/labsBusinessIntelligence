CREATE TABLE caixa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    saldo_inicial DECIMAL(10, 2) NOT NULL,
    saldo_atual DECIMAL(10, 2) NOT NULL,
    data_abertura DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_fechamento DATETIME,
    status VARCHAR(50) NOT NULL,
    usuario_id INT,
    FOREIGN KEY (usuario_id) REFERENCES users(id)
);

CREATE TABLE transacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    caixa_id INT NOT NULL,
    tipo VARCHAR(50) NOT NULL, -- 'entrada' ou 'saida'
    valor DECIMAL(10, 2) NOT NULL,
    descricao VARCHAR(255),
    data DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    categoria VARCHAR(100),
    metodo_pagamento VARCHAR(100),
    FOREIGN KEY (caixa_id) REFERENCES caixa(id)
);
