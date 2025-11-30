import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControlLabel,
  Switch,
  Grid,
  Typography
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';

const ClientModal = ({ open, onClose, onSave, editingClient }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    phone_whatsapp: '',
    email: '',
    birth_date: '',
    note: '',
    status: true
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingClient) {
      setFormData({
        full_name: editingClient.full_name || '',
        phone_whatsapp: editingClient.phone_whatsapp || '',
        email: editingClient.email || '',
        birth_date: editingClient.birth_date || '',
        note: editingClient.note || '',
        status: editingClient.status !== undefined ? editingClient.status : true
      });
    } else {
      setFormData({
        full_name: '',
        phone_whatsapp: '',
        email: '',
        birth_date: '',
        note: '',
        status: true
      });
    }
    setErrors({});
  }, [editingClient, open]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Nome completo é obrigatório';
    }

    if (!formData.phone_whatsapp.trim()) {
      newErrors.phone_whatsapp = 'Telefone WhatsApp é obrigatório';
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone_whatsapp.replace(/\s/g, ''))) {
      newErrors.phone_whatsapp = 'Formato de telefone inválido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Formato de email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field) => (event) => {
    const value = field === 'status' ? event.target.checked : event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  const formatPhoneInput = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as (XX) XXXXX-XXXX
    if (digits.length <= 2) {
      return digits;
    } else if (digits.length <= 7) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    } else if (digits.length <= 11) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    } else {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
    }
  };

  const handlePhoneChange = (event) => {
    const formatted = formatPhoneInput(event.target.value);
    setFormData(prev => ({
      ...prev,
      phone_whatsapp: formatted
    }));

    if (errors.phone_whatsapp) {
      setErrors(prev => ({
        ...prev,
        phone_whatsapp: ''
      }));
    }
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
        {editingClient ? 'Editar Cliente' : 'Novo Cliente'}
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3} sx={{ mt: 0 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nome Completo"
              value={formData.full_name}
              onChange={handleChange('full_name')}
              error={!!errors.full_name}
              helperText={errors.full_name}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Telefone WhatsApp"
              value={formData.phone_whatsapp}
              onChange={handlePhoneChange}
              error={!!errors.phone_whatsapp}
              helperText={errors.phone_whatsapp}
              placeholder="(11) 99999-9999"
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              error={!!errors.email}
              helperText={errors.email}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Data de Nascimento"
              type="date"
              value={formData.birth_date}
              onChange={handleChange('birth_date')}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.status}
                    onChange={handleChange('status')}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1">
                      Status: {formData.status ? 'Ativo' : 'Inativo'}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {formData.status ? 'Cliente ativo no sistema' : 'Cliente inativo no sistema'}
                    </Typography>
                  </Box>
                }
              />
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Observações"
              multiline
              rows={3}
              value={formData.note}
              onChange={handleChange('note')}
              placeholder="Informações adicionais sobre o cliente..."
            />
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          onClick={onClose}
          startIcon={<Cancel />}
          sx={{ color: '#666' }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={<Save />}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
            }
          }}
        >
          {editingClient ? 'Atualizar' : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClientModal;