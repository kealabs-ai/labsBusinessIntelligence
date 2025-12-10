import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  FormControlLabel,
  Switch
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';

const RecursoModal = ({ open, onClose, onSave, editingRecurso }) => {
  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'profissional',
    especialidade: '',
    email: '',
    telefone: '',
    observacoes: '',
    status: true,
    kea_client_id: ''
  });

  const [units, setUnits] = useState([]);

  const [errors, setErrors] = useState({});

  const tipos = [
    { value: 'profissional', label: 'Profissional' },
    { value: 'equipamento', label: 'Equipamento' },
    { value: 'sala', label: 'Sala/Ambiente' }
  ];

  useEffect(() => {
    if (editingRecurso) {
      setFormData({
        nome: editingRecurso.nome || '',
        tipo: editingRecurso.tipo || 'profissional',
        especialidade: editingRecurso.especialidade || '',
        email: editingRecurso.email || '',
        telefone: editingRecurso.telefone || '',
        observacoes: editingRecurso.observacoes || '',
        status: editingRecurso.status !== undefined ? editingRecurso.status : true,
        kea_client_id: editingRecurso.kea_client_id || ''
      });
    } else {
      setFormData({
        nome: '',
        tipo: 'profissional',
        especialidade: '',
        email: '',
        telefone: '',
        observacoes: '',
        status: true,
        kea_client_id: ''
      });
    }
    setErrors({});
  }, [editingRecurso, open]);

  useEffect(() => {
    const loadUnits = async () => {
      try {
        const response = await fetch('http://72.60.140.128:6002/api/v1/units', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUnits(data);
        }
      } catch (error) {
        console.error('Erro ao carregar unidades:', error);
      }
    };
    
    if (open) {
      loadUnits();
    }
  }, [open]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.kea_client_id) {
      newErrors.kea_client_id = 'Unidade é obrigatória';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
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
    const digits = value.replace(/\D/g, '');
    
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
      telefone: formatted
    }));
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
        {editingRecurso ? 'Editar Recurso' : 'Novo Recurso'}
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3} sx={{ mt: 0 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nome"
              value={formData.nome}
              onChange={handleChange('nome')}
              error={!!errors.nome}
              helperText={errors.nome}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Tipo</InputLabel>
              <Select
                value={formData.tipo}
                onChange={handleChange('tipo')}
                label="Tipo"
              >
                {tipos.map((tipo) => (
                  <MenuItem key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Especialidade"
              value={formData.especialidade}
              onChange={handleChange('especialidade')}
              placeholder={formData.tipo === 'profissional' ? 'Ex: Cardiologia' : 'Ex: Marca/Modelo'}
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
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Telefone"
              value={formData.telefone}
              onChange={handlePhoneChange}
              placeholder="(11) 99999-9999"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.kea_client_id}>
              <InputLabel>Unidade *</InputLabel>
              <Select
                value={formData.kea_client_id}
                onChange={(event) => {
                  setFormData(prev => ({
                    ...prev,
                    kea_client_id: event.target.value
                  }));
                  if (errors.kea_client_id) {
                    setErrors(prev => ({ ...prev, kea_client_id: '' }));
                  }
                }}
                label="Unidade *"
                required
              >
                <MenuItem value="">
                  <em>Selecione uma unidade</em>
                </MenuItem>
                {units.map((unit) => (
                  <MenuItem key={unit.id} value={unit.id}>
                    {unit.unit_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.status}
                  onChange={handleChange('status')}
                  color="primary"
                />
              }
              label={`Status: ${formData.status ? 'Ativo' : 'Inativo'}`}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Observações"
              multiline
              rows={3}
              value={formData.observacoes}
              onChange={handleChange('observacoes')}
              placeholder="Informações adicionais..."
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
          {editingRecurso ? 'Atualizar' : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RecursoModal;