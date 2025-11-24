import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Button,
  Typography,
  Box
} from '@mui/material';
import { BarChart, SmartToy, CalendarToday, AdminPanelSettings } from '@mui/icons-material';
import { menuStyles } from './MenuPresentational.styles';

const MenuPresentational = ({ menuItems, onMenuClick, user }) => {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'BarChart':
        return <BarChart sx={{ fontSize: 32 }} />;
      case 'SmartToy':
        return <SmartToy sx={{ fontSize: 32 }} />;
      case 'CalendarToday':
        return <CalendarToday sx={{ fontSize: 32 }} />;
      case 'AdminPanelSettings':
        return <AdminPanelSettings sx={{ fontSize: 32 }} />;
      default:
        return <BarChart sx={{ fontSize: 32 }} />;
    }
  };

  return (
    <Box sx={menuStyles.container}>
      <Box sx={menuStyles.content}>
        <Box sx={menuStyles.header}>
          <Typography variant="h3" component="h1" sx={menuStyles.title}>
            Dashboard Principal
          </Typography>
          <Typography variant="h6" sx={menuStyles.subtitle}>
            Escolha uma opção para começar
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          {menuItems.filter(item => !item.adminOnly || (user && user.role === 'admin')).map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={menuStyles.menuCard}>
                <CardContent sx={menuStyles.cardContent}>
                  <Box sx={menuStyles.iconContainer}>
                    {getIcon(item.icon)}
                  </Box>
                  <Typography variant="h5" component="h2" sx={menuStyles.cardTitle}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={menuStyles.cardDescription}>
                    {item.description}
                  </Typography>
                  <Button 
                    variant="contained"
                    sx={menuStyles.accessButton}
                    onClick={() => onMenuClick(item.path)}
                  >
                    Acessar
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default MenuPresentational;