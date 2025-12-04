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
