import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControlLabel,
  Switch,
  Box,
  Typography
} from '@mui/material';
import { authService } from '../../services/authService';

const UnitModal = ({ open, onClose, onSave, unit, loading }) => {
  const [formData, setFormData] = useState({
    unit_name: '',
    address: '',
    phone: '',
    email: '',
    opening_time: '08:00',
    closing_time: '18:00',
    appointment_interval: 30,
    notifications_enabled: true,
    notification_advance_hours: 24
  });
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (open) {
      loadCurrentUser();
    }
  }, [open]);

  const loadCurrentUser = async () => {
    try {
      const user = await authService.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error('Erro ao carregar usuário atual:', error);
    }
  };

  useEffect(() => {
    if (unit) {
      setFormData({
        unit_name: unit.unit_name || '',
        address: unit.address || '',
        phone: unit.phone || '',
        email: unit.email || '',
        opening_time: unit.opening_time ? unit.opening_time.substring(0, 5) : '08:00',
        closing_time: unit.closing_time ? unit.closing_time.substring(0, 5) : '18:00',
        appointment_interval: unit.appointment_interval || 30,
        notifications_enabled: unit.notifications_enabled !== undefined ? unit.notifications_enabled : true,
        notification_advance_hours: unit.notification_advance_hours || 24
      });
    } else {
      setFormData({
        unit_name: '',
        address: '',
        phone: '',
        email: '',
        opening_time: '08:00',
        closing_time: '18:00',
        appointment_interval: 30,
        notifications_enabled: true,
        notification_advance_hours: 24
      });
    }
  }, [unit, open]);

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.unit_name || formData.unit_name.trim() === '') {
      return;
    }
    
    const submitData = {
      ...formData,
      unit_name: formData.unit_name.trim(),
      opening_time: formData.opening_time + ':00',
      closing_time: formData.closing_time + ':00',
      kea_client_id: currentUser?.kea_client_id || null,
      appointment_interval: parseInt(formData.appointment_interval) || 30,
      notification_advance_hours: parseInt(formData.notification_advance_hours) || 24
    };
    onSave(submitData);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }
      }}
    >
      <DialogTitle sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontWeight: 600
      }}>
        {unit ? 'Editar Unidade' : 'Nova Unidade'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome da Unidade *"
                value={formData.unit_name}
                onChange={handleChange('unit_name')}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Endereço"
                value={formData.address}
                onChange={handleChange('address')}
                multiline
                rows={2}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Telefone"
                value={formData.phone}
                onChange={handleChange('phone')}
                placeholder="+55 (99) 99999-9999"
                inputProps={{
                  maxLength: 19,
                  onInput: (e) => {
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.length > 0) {
                      if (value.length <= 2) {
                        value = `+${value}`;
                      } else if (value.length <= 4) {
                        value = `+${value.slice(0, 2)} (${value.slice(2)}`;
                      } else if (value.length <= 9) {
                        value = `+${value.slice(0, 2)} (${value.slice(2, 4)}) ${value.slice(4)}`;
                      } else {
                        value = `+${value.slice(0, 2)} (${value.slice(2, 4)}) ${value.slice(4, 9)}-${value.slice(9, 13)}`;
                      }
                    }
                    e.target.value = value;
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Horário de Funcionamento
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Horário de Abertura"
                type="time"
                value={formData.opening_time}
                onChange={handleChange('opening_time')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Horário de Fechamento"
                type="time"
                value={formData.closing_time}
                onChange={handleChange('closing_time')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Intervalo entre Agendamentos (minutos)"
                type="number"
                value={formData.appointment_interval}
                onChange={handleChange('appointment_interval')}
                inputProps={{ min: 15, max: 120, step: 15 }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Configurações de Notificação
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.notifications_enabled}
                    onChange={handleChange('notifications_enabled')}
                  />
                }
                label="Notificações Habilitadas"
              />
            </Grid>
            
            {formData.notifications_enabled && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Antecedência da Notificação (horas)"
                  type="number"
                  value={formData.notification_advance_hours}
                  onChange={handleChange('notification_advance_hours')}
                  inputProps={{ min: 1, max: 168 }}
                />
              </Grid>
            )}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={loading || !formData.unit_name.trim()}
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UnitModal;