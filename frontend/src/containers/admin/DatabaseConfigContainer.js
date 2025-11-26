import React, { useState, useEffect } from 'react';
import DatabaseConfigPresentational from '../../components/presentational/DatabaseConfigPresentational';
import { databaseConfigService } from '../../services/databaseConfigService';

const DatabaseConfigContainer = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [showMysqlPassword, setShowMysqlPassword] = useState(false);
  const [showSqlServerPassword, setShowSqlServerPassword] = useState(false);

  const [mysqlConfig, setMysqlConfig] = useState({
    host: '',
    port: '3306',
    user: '',
    password: '',
    database: ''
  });

  const [sqlServerConfig, setSqlServerConfig] = useState({
    host: '',
    port: '1433',
    user: '',
    password: '',
    database: '',
    driver: '{ODBC Driver 18 for SQL Server}'
  });

  const [envConfig, setEnvConfig] = useState({
    dbEngine: 'mysql',
    environment: 'dev',
    port: '6002',
    secretKey: '',
    evolutionApiUrl: '',
    evolutionInstance: '',
    evolutionApiKey: ''
  });

  const [openVpnConfig, setOpenVpnConfig] = useState({
    server: '',
    port: '1194',
    protocol: 'udp',
    username: '',
    password: '',
    caCert: '',
    additionalConfig: ''
  });

  useEffect(() => {
    loadConfigurations();
  }, []);

  const loadConfigurations = async () => {
    try {
      setLoading(true);
      const configs = await databaseConfigService.getConfigurations();
      
      if (configs.mysql) setMysqlConfig(configs.mysql);
      if (configs.sqlserver) setSqlServerConfig(configs.sqlserver);
      if (configs.environment) setEnvConfig(configs.environment);
      if (configs.openvpn) setOpenVpnConfig(configs.openvpn);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMysqlChange = (field, value) => {
    setMysqlConfig(prev => ({ ...prev, [field]: value }));
    setTestResult(null);
  };

  const handleSqlServerChange = (field, value) => {
    setSqlServerConfig(prev => ({ ...prev, [field]: value }));
    setTestResult(null);
  };

  const handleEnvChange = (field, value) => {
    setEnvConfig(prev => ({ ...prev, [field]: value }));
    setTestResult(null);
  };

  const handleOpenVpnChange = (field, value) => {
    setOpenVpnConfig(prev => ({ ...prev, [field]: value }));
    setTestResult(null);
  };

  const handleTest = async (tabIndex) => {
    try {
      setLoading(true);
      setTestResult(null);

      let result;
      if (tabIndex === 0) {
        result = await databaseConfigService.testMysqlConnection(mysqlConfig);
      } else if (tabIndex === 1) {
        result = await databaseConfigService.testSqlServerConnection(sqlServerConfig);
      } else if (tabIndex === 2) {
        result = await databaseConfigService.testEnvironmentConfig(envConfig);
      } else {
        result = await databaseConfigService.testOpenVpnConnection(openVpnConfig);
      }

      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Erro ao testar conexão: ' + error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (tabIndex) => {
    try {
      setLoading(true);
      setTestResult(null);

      let result;
      if (tabIndex === 0) {
        result = await databaseConfigService.saveMysqlConfig(mysqlConfig);
      } else if (tabIndex === 1) {
        result = await databaseConfigService.saveSqlServerConfig(sqlServerConfig);
      } else if (tabIndex === 2) {
        result = await databaseConfigService.saveEnvironmentConfig(envConfig);
      } else {
        result = await databaseConfigService.saveOpenVpnConfig(openVpnConfig);
      }

      setTestResult({
        success: true,
        message: 'Configurações salvas com sucesso!'
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Erro ao salvar configurações: ' + error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DatabaseConfigPresentational
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      mysqlConfig={mysqlConfig}
      sqlServerConfig={sqlServerConfig}
      envConfig={envConfig}
      openVpnConfig={openVpnConfig}
      showMysqlPassword={showMysqlPassword}
      showSqlServerPassword={showSqlServerPassword}
      onMysqlChange={handleMysqlChange}
      onSqlServerChange={handleSqlServerChange}
      onEnvChange={handleEnvChange}
      onOpenVpnChange={handleOpenVpnChange}
      onToggleMysqlPassword={() => setShowMysqlPassword(!showMysqlPassword)}
      onToggleSqlServerPassword={() => setShowSqlServerPassword(!showSqlServerPassword)}
      onSave={handleSave}
      onTest={handleTest}
      loading={loading}
      testResult={testResult}
    />
  );
};

export default DatabaseConfigContainer;