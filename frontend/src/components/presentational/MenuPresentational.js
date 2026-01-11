import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Button,
  Typography,
  Box
} from '@mui/material';
import { BarChart, SmartToy, CalendarToday, AdminPanelSettings, Business } from '@mui/icons-material';
import { useTheme } from '../../services/ThemeContext';

const MenuPresentational = ({ menuItems, onMenuClick, user }) => {
  const { palette } = useTheme();
  
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
      case 'Business':
        return <Business sx={{ fontSize: 32 }} />;
      default:
        return <BarChart sx={{ fontSize: 32 }} />;
    }
  };

  const menuStyles = {
    container: {
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${palette.background} 0%, ${palette.surface} 100%)`,
      pt: 0
    },
    content: {
      maxWidth: 'lg',
      mx: 'auto',
      px: 3,
      py: 4
    },
    header: {
      mb: 4,
      textAlign: 'center'
    },
    title: {
      fontWeight: 700,
      background: palette.gradient,
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      mb: 1
    },
    subtitle: {
      color: palette.textSecondary,
      fontWeight: 300
    },
    menuCard: {
      height: '100%',
      borderRadius: 3,
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      background: palette.surface,
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 16px 48px rgba(0,0,0,0.15)'
      }
    },
    cardContent: {
      textAlign: 'center',
      p: 3
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: '50%',
      background: palette.gradient,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      mx: 'auto',
      mb: 2,
      color: 'white'
    },
    cardTitle: {
      fontWeight: 600,
      mb: 1,
      color: palette.text
    },
    cardDescription: {
      color: palette.textSecondary,
      lineHeight: 1.6
    },
    accessButton: {
      mt: 2,
      borderRadius: 2,
      background: palette.gradient,
      fontWeight: 600,
      px: 4,
      py: 1.5,
      '&:hover': {
        background: palette.primary,
        transform: 'translateY(-1px)'
      },
      transition: 'all 0.3s ease'
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
          {menuItems.filter(item => !item.adminOnly || (user && user.role_id === 1)).map((item, index) => (
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