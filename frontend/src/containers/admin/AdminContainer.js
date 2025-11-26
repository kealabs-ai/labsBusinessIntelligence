import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Button } from '@mui/material';
import { People, Security, Settings } from '@mui/icons-material';
import ToolbarContainer from '../toolbar/ToolbarContainer';
import UserManagement from './UserManagement';
import PermissionManagement from './PermissionManagement';
import DatabaseConfigContainer from './DatabaseConfigContainer';

const AdminContainer = () => {
  const [currentModule, setCurrentModule] = useState(null);
  const adminModules = [
    {
      title: 'Gerenciar Usuários',
      description: 'Criar, editar e gerenciar usuários do sistema',
      icon: <People sx={{ fontSize: 48, color: '#667eea' }} />,
      action: () => setCurrentModule('users')
    },
    {
      title: 'Permissões',
      description: 'Configurar permissões e níveis de acesso',
      icon: <Security sx={{ fontSize: 48, color: '#764ba2' }} />,
      action: () => setCurrentModule('permissions')
    },
    {
      title: 'Configurações',
      description: 'Configurações gerais do sistema',
      icon: <Settings sx={{ fontSize: 48, color: '#25D366' }} />,
      action: () => setCurrentModule('settings')
    }
  ];

  return (
    <>
      <ToolbarContainer />
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', pt: 0, pb: 4 }}>
        <Box sx={{ maxWidth: 'xl', mx: 'auto', px: 3, py: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 4, 
            p: 3, 
            borderRadius: 3, 
            background: 'rgba(255, 255, 255, 0.9)', 
            backdropFilter: 'blur(10px)', 
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)' 
          }}>
            <Typography variant="h4" sx={{ 
              fontWeight: 700, 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
              backgroundClip: 'text', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent' 
            }}>
              Painel Administrativo
            </Typography>
          </Box>
          
          <Grid container spacing={3}>
            {adminModules.map((module, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'transform 0.3s ease',
                  '&:hover': { 
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                  }
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
      
      {currentModule === 'users' && (
        <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, bgcolor: 'white', zIndex: 1300 }}>
          <ToolbarContainer />
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            p: 3, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>Gestão de Usuários</Typography>
            <Button 
              onClick={() => setCurrentModule(null)}
              sx={{ 
                color: 'white', 
                borderColor: 'white',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
              }}
              variant="outlined"
            >
              Voltar
            </Button>
          </Box>
          <UserManagement />
        </Box>
      )}
      
      {currentModule === 'permissions' && (
        <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, bgcolor: 'white', zIndex: 1300 }}>
          <ToolbarContainer />
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            p: 3, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>Gestão de Permissões</Typography>
            <Button 
              onClick={() => setCurrentModule(null)}
              sx={{ 
                color: 'white', 
                borderColor: 'white',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
              }}
              variant="outlined"
            >
              Voltar
            </Button>
          </Box>
          <PermissionManagement />
        </Box>
      )}
      
      {currentModule === 'settings' && (
        <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, bgcolor: 'white', zIndex: 1300 }}>
          <ToolbarContainer />
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            p: 3, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>Configurações de Banco de Dados</Typography>
            <Button 
              onClick={() => setCurrentModule(null)}
              sx={{ 
                color: 'white', 
                borderColor: 'white',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
              }}
              variant="outlined"
            >
              Voltar
            </Button>
          </Box>
          <DatabaseConfigContainer />
        </Box>
      )}
    </>
  );
};

export default AdminContainer;