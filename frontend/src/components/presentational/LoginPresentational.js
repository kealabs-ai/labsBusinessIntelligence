import React from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { loginStyles } from './LoginPresentational.styles';

const LoginPresentational = ({
  username,
  password,
  loading,
  error,
  onUsernameChange,
  onPasswordChange,
  onSubmit
}) => {
  return (
    <Box sx={loginStyles.container}>
      <Paper elevation={0} sx={loginStyles.loginCard}>
        <Box sx={loginStyles.logo}>
          <Box sx={loginStyles.logoIcon}>
            BI
          </Box>
          <Typography component="h1" variant="h4" sx={loginStyles.title}>
            Labs BI
          </Typography>
        </Box>
        
        <Typography component="h2" variant="body1" sx={loginStyles.subtitle}>
          Business Intelligence Platform
        </Typography>
        
        {error && (
          <Alert severity="error" sx={loginStyles.errorAlert}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={onSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Usuário"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            disabled={loading}
            sx={loginStyles.textField}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            disabled={loading}
            sx={loginStyles.textField}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={loginStyles.submitButton}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} sx={loginStyles.loadingSpinner} />
            ) : (
              'Entrar'
            )}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPresentational;