import React from 'react';
import {
  Box,
  TextField,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import { AccountCircle, FilterList } from '@mui/icons-material';

const ToolbarPresentational = ({ user, filters, onFilterChange, onLogout }) => {
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

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {onFilterChange && (
        <>
          <FilterList />
          <TextField
            size="small"
            label="Categoria"
            variant="outlined"
            value={filters.category || ''}
            onChange={(e) => onFilterChange('category', e.target.value)}
            sx={{ 
              '& .MuiOutlinedInput-root': { 
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
              },
              '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
              '& .MuiInputBase-input': { color: 'white' }
            }}
          />
          <TextField
            size="small"
            label="Período"
            variant="outlined"
            value={filters.period || ''}
            onChange={(e) => onFilterChange('period', e.target.value)}
            sx={{ 
              '& .MuiOutlinedInput-root': { 
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
              },
              '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
              '& .MuiInputBase-input': { color: 'white' }
            }}
          />
        </>
      )}
      
      <IconButton
        size="large"
        onClick={handleMenu}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleClose}>Perfil</MenuItem>
        <MenuItem onClick={handleLogout}>Sair</MenuItem>
      </Menu>
    </Box>
  );
};

export default ToolbarPresentational;