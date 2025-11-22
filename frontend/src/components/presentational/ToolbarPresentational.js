import React from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Avatar,
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
import { toolbarStyles } from './ToolbarPresentational.styles';

const ToolbarPresentational = ({ user, onLogout }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

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
          <Box sx={toolbarStyles.logoIcon}>
            BI
          </Box>
          <Typography variant="h6" sx={toolbarStyles.logoText}>
            Labs BI
          </Typography>
        </Box>
        
        <Box sx={toolbarStyles.userSection}>
          <Box sx={toolbarStyles.userInfo}>
            <Avatar sx={toolbarStyles.avatar}>
              {getUserInitials(user?.username)}
            </Avatar>
            <Typography variant="body1" sx={toolbarStyles.userName}>
              {user?.username || 'Usuário'}
            </Typography>
          </Box>
          
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