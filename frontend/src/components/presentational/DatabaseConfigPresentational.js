import React from 'react';
import {
  Box,
  Tabs,
  Tab,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  Switch,
  FormControlLabel,
  Alert,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Storage, Cloud, Settings, VpnKey, Visibility, VisibilityOff } from '@mui/icons-material';
import { ConfigContainer, ConfigCard, TabContainer } from './DatabaseConfigPresentational.styles';


const DatabaseConfigPresentational = ({
  activeTab,
  setActiveTab,
  mysqlConfig,
  sqlServerConfig,
  envConfig,
  openVpnConfig,
  showMysqlPassword,
  showSqlServerPassword,
  onMysqlChange,
  onSqlServerChange,
  onEnvChange,
  onOpenVpnChange,
  onToggleMysqlPassword,
  onToggleSqlServerPassword,
  onSave,
  onTest,
  loading,
  testResult
}) => {
  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );

  return (
    <ConfigContainer>
      <TabContainer>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
        >
        <Tab
          icon={<Storage />}
          label="MySQL"
        />
        <Tab
          icon={<Cloud />}
          label="SQL Server"
        />
        <Tab
          icon={<Settings />}
          label="Variáveis de Ambiente"
        />
        <Tab
          icon={<VpnKey />}
          label="OpenVPN"
        />
        </Tabs>
      </TabContainer>

      <TabPanel value={activeTab} index={0}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Configuração MySQL</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Host"
                  value={mysqlConfig.host}
                  onChange={(e) => onMysqlChange('host', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Porta"
                  type="number"
                  value={mysqlConfig.port}
                  onChange={(e) => onMysqlChange('port', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Usuário"
                  value={mysqlConfig.user}
                  onChange={(e) => onMysqlChange('user', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Senha"
                  type={showMysqlPassword ? 'text' : 'password'}
                  value={mysqlConfig.password}
                  onChange={(e) => onMysqlChange('password', e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={onToggleMysqlPassword}
                          edge="end"
                        >
                          {showMysqlPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Database"
                  value={mysqlConfig.database}
                  onChange={(e) => onMysqlChange('database', e.target.value)}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Configuração SQL Server</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Host"
                  value={sqlServerConfig.host}
                  onChange={(e) => onSqlServerChange('host', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Porta"
                  type="number"
                  value={sqlServerConfig.port}
                  onChange={(e) => onSqlServerChange('port', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Usuário"
                  value={sqlServerConfig.user}
                  onChange={(e) => onSqlServerChange('user', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Senha"
                  type={showSqlServerPassword ? 'text' : 'password'}
                  value={sqlServerConfig.password}
                  onChange={(e) => onSqlServerChange('password', e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={onToggleSqlServerPassword}
                          edge="end"
                        >
                          {showSqlServerPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Database"
                  value={sqlServerConfig.database}
                  onChange={(e) => onSqlServerChange('database', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Driver"
                  value={sqlServerConfig.driver}
                  onChange={(e) => onSqlServerChange('driver', e.target.value)}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Variáveis de Ambiente</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={envConfig.dbEngine === 'mysql'}
                      onChange={(e) => onEnvChange('dbEngine', e.target.checked ? 'mysql' : 'sqlserver')}
                    />
                  }
                  label={`Banco Ativo: ${envConfig.dbEngine === 'mysql' ? 'MySQL' : 'SQL Server'}`}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Ambiente"
                  value={envConfig.environment}
                  onChange={(e) => onEnvChange('environment', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Porta da API"
                  type="number"
                  value={envConfig.port}
                  onChange={(e) => onEnvChange('port', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Chave Secreta JWT"
                  type="password"
                  value={envConfig.secretKey}
                  onChange={(e) => onEnvChange('secretKey', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="URL Evolution API"
                  value={envConfig.evolutionApiUrl}
                  onChange={(e) => onEnvChange('evolutionApiUrl', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Instância Evolution"
                  value={envConfig.evolutionInstance}
                  onChange={(e) => onEnvChange('evolutionInstance', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="API Key Evolution"
                  type="password"
                  value={envConfig.evolutionApiKey}
                  onChange={(e) => onEnvChange('evolutionApiKey', e.target.value)}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={activeTab} index={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Configuração OpenVPN</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Servidor VPN"
                  value={openVpnConfig.server}
                  onChange={(e) => onOpenVpnChange('server', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Porta"
                  type="number"
                  value={openVpnConfig.port}
                  onChange={(e) => onOpenVpnChange('port', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Protocolo"
                  value={openVpnConfig.protocol}
                  onChange={(e) => onOpenVpnChange('protocol', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Usuário"
                  value={openVpnConfig.username}
                  onChange={(e) => onOpenVpnChange('username', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Senha"
                  type="password"
                  value={openVpnConfig.password}
                  onChange={(e) => onOpenVpnChange('password', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Certificado CA"
                  value={openVpnConfig.caCert}
                  onChange={(e) => onOpenVpnChange('caCert', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Configuração Adicional"
                  value={openVpnConfig.additionalConfig}
                  onChange={(e) => onOpenVpnChange('additionalConfig', e.target.value)}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      {testResult && (
        <Alert severity={testResult.success ? 'success' : 'error'} sx={{ mt: 2 }}>
          {testResult.message}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2, mt: 3, mb: 4, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          onClick={() => onTest(activeTab)}
          disabled={loading}
        >
          Testar Conexão
        </Button>
        <Button
          variant="contained"
          onClick={() => onSave(activeTab)}
          disabled={loading}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': { background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)' }
          }}
        >
          Salvar Configurações
        </Button>
      </Box>
    </ConfigContainer>
  );
};

export default DatabaseConfigPresentational;