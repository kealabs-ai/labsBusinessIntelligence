-- Complete migration script for caixa -> cash_register and transacoes -> transactions

-- Step 1: Create new cash_register table
CREATE TABLE cash_register (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    initial_balance DECIMAL(10,2) NOT NULL,
    current_balance DECIMAL(10,2) NOT NULL,
    opening_date DATETIME NOT NULL,
    closing_date DATETIME NULL,
    status VARCHAR(50) NOT NULL,
    user_id BIGINT NOT NULL,
    INDEX idx_user_id (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Step 2: Create new transactions table
CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cash_register_id INT NOT NULL,
    transaction_type VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description VARCHAR(255) NULL,
    transaction_date DATETIME NOT NULL,
    category VARCHAR(100) NULL,
    payment_method VARCHAR(100) NULL,
    INDEX idx_cash_register_id (cash_register_id),
    FOREIGN KEY (cash_register_id) REFERENCES cash_register(id)
);

-- Step 3: Migrate data from caixa to cash_register (if caixa table exists)
INSERT INTO cash_register (id, name, initial_balance, current_balance, opening_date, closing_date, status, user_id)
SELECT 
    id,
    nome as name,
    saldo_inicial as initial_balance,
    saldo_atual as current_balance,
    data_abertura as opening_date,
    data_fechamento as closing_date,
    status,
    usuario_id as user_id
FROM caixa
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'caixa');

-- Step 4: Migrate data from transacoes to transactions (if transacoes table exists)
INSERT INTO transactions (id, cash_register_id, transaction_type, amount, description, transaction_date, category, payment_method)
SELECT 
    id,
    caixa_id as cash_register_id,
    tipo as transaction_type,
    valor as amount,
    descricao as description,
    data as transaction_date,
    categoria as category,
    metodo_pagamento as payment_method
FROM transacoes
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'transacoes');

-- Step 5: Drop old tables (if they exist)
DROP TABLE IF EXISTS transacoes;
DROP TABLE IF EXISTS caixa;