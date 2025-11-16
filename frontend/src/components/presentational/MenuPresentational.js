import React from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box
} from '@mui/material';
import { BarChart, SmartToy, CalendarToday } from '@mui/icons-material';

const MenuPresentational = ({ menuItems, onMenuClick, user }) => {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'BarChart':
        return <BarChart sx={{ fontSize: 40 }} />;
      case 'SmartToy':
        return <SmartToy sx={{ fontSize: 40 }} />;
      case 'CalendarToday':
        return <CalendarToday sx={{ fontSize: 40 }} />;
      default:
        return <BarChart sx={{ fontSize: 40 }} />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard Principal
      </Typography>
      
      <Grid container spacing={3}>
        {menuItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box sx={{ mb: 2, color: 'primary.main' }}>
                  {getIcon(item.icon)}
                </Box>
                <Typography gutterBottom variant="h5" component="h2">
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button 
                  size="large" 
                  variant="contained"
                  onClick={() => onMenuClick(item.path)}
                >
                  Acessar
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MenuPresentational;