import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Button } from '@mui/material';
import { People, Security, Settings } from '@mui/icons-material';
import ToolbarContainer from '../toolbar/ToolbarContainer';

const AdminContainer = () => {
  const adminModules = [
    {
      title: 'Gerenciar Usuários',
      description: 'Criar, editar e gerenciar usuários do sistema',
      icon: <People sx={{ fontSize: 48, color: '#667eea' }} />,
      action: () => console.log('Gerenciar Usuários')
    },
    {
      title: 'Permissões',
      description: 'Configurar permissões e níveis de acesso',
      icon: <Security sx={{ fontSize: 48, color: '#764ba2' }} />,
      action: () => console.log('Permissões')
    },
    {
      title: 'Configurações',
      description: 'Configurações gerais do sistema',
      icon: <Settings sx={{ fontSize: 48, color: '#25D366' }} />,
      action: () => console.log('Configurações')
    }
  ];

  return (
    <>
      <ToolbarContainer />
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', pt: 0, pb: 4 }}>
        <Box sx={{ maxWidth: 'xl', mx: 'auto', px: 3, py: 4 }}>
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, color: '#333' }}>
            Painel Administrativo
          </Typography>
          
          <Grid container spacing={3}>
            {adminModules.map((module, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'translateY(-5px)' }
                }}>
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                    <Box sx={{ mb: 2 }}>
                      {module.icon}
                    </Box>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      {module.title}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                      {module.description}
                    </Typography>
                    <Button 
                      variant="contained" 
                      onClick={module.action}
                      sx={{ 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': { background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)' }
                      }}
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
    </>
  );
};

export default AdminContainer;