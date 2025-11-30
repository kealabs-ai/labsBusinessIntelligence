import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Box,
  Divider
} from '@mui/material';
import { 
  CalendarToday, 
  People, 
  WhatsApp, 
  AccountBalance, 
  Assessment,
  Settings,
  ExpandLess,
  ExpandMore
} from '@mui/icons-material';

const AgendaMenuPresentational = ({ open, onClose, onMenuClick, currentView }) => {
  const [configOpen, setConfigOpen] = useState(false);

  const menuItems = [
    { title: 'Agendamentos', icon: <CalendarToday />, action: () => onMenuClick('agendamentos') },
    { title: 'Clientes', icon: <People />, action: () => onMenuClick('clientes') },
    { title: 'Comunicação', icon: <WhatsApp />, action: () => onMenuClick('comunicacao') },
    { title: 'Caixa e Transações', icon: <AccountBalance />, action: () => onMenuClick('caixa') },
    { title: 'Relatórios', icon: <Assessment />, action: () => onMenuClick('relatorios') }
  ];

  const configSubItems = [
    { title: 'Serviços', action: () => onMenuClick('config-servicos') },
    { title: 'Recursos e Profissionais', action: () => onMenuClick('config-recursos') },
    { title: 'Configurações da Unidade', action: () => onMenuClick('config-unidade') }
  ];



  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: 280,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          Sistema de Agendamentos
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          Gerencie sua agenda e negócios
        </Typography>
      </Box>
      
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
      
      <List>
        {menuItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton 
              onClick={item.action}
              selected={currentView === item.title.toLowerCase()}
              sx={{
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                '&.Mui-selected': { backgroundColor: 'rgba(255,255,255,0.2)' }
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
        
        <ListItem disablePadding>
          <ListItemButton onClick={() => setConfigOpen(!configOpen)}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Settings />
            </ListItemIcon>
            <ListItemText primary="Configurações" />
            {configOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        
        <Collapse in={configOpen} timeout="auto" unmountOnExit>
          {configSubItems.map((subItem, subIndex) => (
            <ListItem key={subIndex} disablePadding sx={{ pl: 4 }}>
              <ListItemButton 
                onClick={subItem.action}
                sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
              >
                <ListItemText 
                  primary={subItem.title}
                  sx={{ '& .MuiListItemText-primary': { fontSize: '0.9rem' } }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </Collapse>
      </List>
    </Drawer>
  );
};

export default AgendaMenuPresentational;