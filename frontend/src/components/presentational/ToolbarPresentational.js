import React from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Typography
} from '@mui/material';
import { 
  AccountCircle, 
  Settings, 
  ExitToApp,
  Person
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getToolbarStyles } from './ToolbarPresentational.styles';
import logoKea from '../../assets/logotipo_kea.png';

const ToolbarPresentational = ({ user, onLogout, colorPalette = 'KEA_LABS' }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const toolbarStyles = getToolbarStyles(colorPalette);

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
          {user && (
            <Typography 
              variant="body2" 
              sx={toolbarStyles.userName}
            >
              {user.username || user.email || 'Usuário'}
            </Typography>
          )}
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
              <Person sx={toolbarStyles.menuItemIcon} />
              <Typography sx={toolbarStyles.menuItemText}>Conta</Typography>
            </MenuItem>
            <MenuItem onClick={handleClose} sx={toolbarStyles.menuItem}>
              <Settings sx={toolbarStyles.menuItemIcon} />
              <Typography sx={toolbarStyles.menuItemText}>Configurações</Typography>
            </MenuItem>
            <Divider sx={toolbarStyles.divider} />
            <MenuItem onClick={handleLogout} sx={toolbarStyles.menuItem}>
              <ExitToApp sx={toolbarStyles.menuItemIcon} />
              <Typography sx={toolbarStyles.menuItemText}>Sair</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default ToolbarPresentational;