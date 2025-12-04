-- Migration script to rename transacoes table to transactions and update column names

-- Step 1: Create new transactions table with updated structure
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

-- Step 2: Migrate data from transacoes to transactions
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
FROM transacoes;

-- Step 3: Drop old transacoes table
DROP TABLE transacoes;