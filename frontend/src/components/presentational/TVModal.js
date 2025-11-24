import React from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Grid
} from '@mui/material';
import {
  Close,
  Fullscreen,
  Person,
  Schedule,
  Build
} from '@mui/icons-material';

const TVModal = ({ open, onClose, events }) => {
  const today = new Date().toISOString().split('T')[0];
  const todayEvents = events.filter(event => event.date === today);

  const handleFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      PaperProps={{
        sx: {
          width: '95vw',
          height: '90vh',
          maxWidth: 'none',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }
      }}
    >
      <DialogContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: 'white' }}>
            Agendamentos de Hoje
          </Typography>
          <Box>
            <IconButton onClick={handleFullscreen} sx={{ color: 'white', mr: 1 }}>
              <Fullscreen fontSize="large" />
            </IconButton>
            <IconButton onClick={onClose} sx={{ color: 'white' }}>
              <Close fontSize="large" />
            </IconButton>
          </Box>
        </Box>

        <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
          {new Date().toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Typography>

        {todayEvents.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Typography variant="h4" sx={{ opacity: 0.7 }}>
              Nenhum agendamento para hoje
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {todayEvents.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event.id}>
                <Card sx={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)'
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Person sx={{ mr: 1, color: '#667eea' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
                        {event.cliente}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Build sx={{ mr: 1, color: '#764ba2' }} />
                      <Typography variant="body1" sx={{ color: '#555' }}>
                        {event.servico}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Schedule sx={{ mr: 1, color: '#25D366' }} />
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#333' }}>
                        {event.time}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TVModal;