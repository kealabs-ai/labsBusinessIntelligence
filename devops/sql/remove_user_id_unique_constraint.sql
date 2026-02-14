-- MySQL version - Remove UNIQUE constraint from user_id
ALTER TABLE unit_settings DROP INDEX user_id;

-- SQL Server version
/*
ALTER TABLE unit_settings DROP CONSTRAINT UQ_unit_settings_user_id;
*/