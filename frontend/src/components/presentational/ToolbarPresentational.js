import React from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import { 
  AccountCircle, 
  Settings, 
  ExitToApp,
  Person
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toolbarStyles } from './ToolbarPresentational.styles';
import logoKea from '../../assets/logotipo_kea.png';

const ToolbarPresentational = ({ user, onLogout }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    onLogout();
  };

  const getUserInitials = (username) => {
    if (!username) return 'U';
    return username.charAt(0).toUpperCase();
  };

  return (
    <AppBar position="static" elevation={0} sx={toolbarStyles.toolbar}>
      <Toolbar sx={toolbarStyles.container}>
        <Box sx={toolbarStyles.logo}>
          <img 
            src={logoKea} 
            alt="Kea Labs" 
            style={{ ...toolbarStyles.logoImage, cursor: 'pointer' }}
            onClick={() => navigate('/menu')}
          />
        </Box>
        
        <Box sx={toolbarStyles.userSection}>
          
          <IconButton
            size="large"
            onClick={handleMenu}
            sx={toolbarStyles.menuButton}
          >
            <AccountCircle />
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            sx={toolbarStyles.menu}
          >
            <MenuItem onClick={handleClose} sx={toolbarStyles.menuItem}>
              <Person sx={{ mr: 1 }} />
              Conta
            </MenuItem>
            <MenuItem onClick={handleClose} sx={toolbarStyles.menuItem}>
              <Settings sx={{ mr: 1 }} />
              Configurações
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={toolbarStyles.menuItem}>
              <ExitToApp sx={{ mr: 1 }} />
              Sair
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default ToolbarPresentational;