-- MySQL version - Add kea_client_id column as VARCHAR
ALTER TABLE unit_settings 
ADD COLUMN kea_client_id VARCHAR(50) NULL;

-- SQL Server version
/*
ALTER TABLE unit_settings 
ADD kea_client_id NVARCHAR(50) NULL;
*/