import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Grid,
  CircularProgress,
  TextField
} from '@mui/material';
import {
  Close,
  Fullscreen,
  Person,
  Schedule,
  Build,
  Refresh
} from '@mui/icons-material';

const TVModal = ({ open, onClose, events, onRefresh, loading }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);
  
  const filteredEvents = events.filter(event => event.date === selectedDate);
  
  const handleDateChange = async (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    setIsLoading(true);
    
    // Simular carregamento
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    if (onRefresh) {
      onRefresh();
    }
  };

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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: 'white' }}>
            📅 Agendamentos
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              sx={{
                '& .MuiInputBase-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: 2,
                  minWidth: '150px'
                },
                '& .MuiInputBase-input': {
                  color: '#333',
                  fontWeight: 500
                }
              }}
            />
            <IconButton onClick={onRefresh} sx={{ color: 'white' }}>
              <Refresh fontSize="large" />
            </IconButton>
            <IconButton onClick={handleFullscreen} sx={{ color: 'white' }}>
              <Fullscreen fontSize="large" />
            </IconButton>
            <IconButton onClick={onClose} sx={{ color: 'white' }}>
              <Close fontSize="large" />
            </IconButton>
          </Box>
        </Box>

        <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
          {new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })} - {filteredEvents.length} agendamentos
        </Typography>

        {(loading || isLoading) ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
            <CircularProgress size={60} sx={{ color: 'white' }} />
          </Box>
        ) : filteredEvents.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Typography variant="h4" sx={{ opacity: 0.7 }}>
              {selectedDate === new Date().toISOString().split('T')[0] 
                ? 'Nenhum agendamento para hoje' 
                : 'Nenhum agendamento para esta data'
              }
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredEvents.map((event) => (
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
                        {event.cliente || event.title?.split(' - ')[0] || 'Cliente'}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Build sx={{ mr: 1, color: '#764ba2' }} />
                      <Typography variant="body1" sx={{ color: '#555' }}>
                        {event.servico || event.description || event.title?.split(' - ')[1] || 'Serviço'}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Schedule sx={{ mr: 1, color: '#25D366' }} />
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#333' }}>
                        {(event.time || event.hora || '00:00').substring(0, 5)}
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