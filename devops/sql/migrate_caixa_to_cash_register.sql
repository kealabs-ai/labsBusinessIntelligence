-- Migration script to rename caixa table to cash_register and update column names

-- Step 1: Create new cash_register table with updated structure
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

-- Step 2: Migrate data from caixa to cash_register
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
FROM caixa;

-- Step 3: Update transacoes table to reference cash_register
ALTER TABLE transacoes 
DROP FOREIGN KEY transacoes_ibfk_1;

ALTER TABLE transacoes 
ADD CONSTRAINT fk_transacoes_cash_register 
FOREIGN KEY (caixa_id) REFERENCES cash_register(id);

-- Step 4: Drop old caixa table
DROP TABLE caixa;