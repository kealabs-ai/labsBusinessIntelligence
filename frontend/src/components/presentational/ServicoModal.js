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

const ServicoModal = ({ open, onClose, onSave, editingServico }) => {
  const [formData, setFormData] = useState({
    nome: '',
    categoria: '',
    descricao: '',
    preco: '',
    duracao: '',
    status: true
  });

  const [errors, setErrors] = useState({});

  const categorias = [
    'Consulta', 'Exame', 'Procedimento', 'Cirurgia', 'Terapia',
    'Diagnóstico', 'Tratamento', 'Emergência', 'Outros'
  ];

  useEffect(() => {
    if (editingServico) {
      setFormData({
        nome: editingServico.name || editingServico.nome || '',
        categoria: editingServico.category || editingServico.categoria || '',
        descricao: editingServico.description || editingServico.descricao || '',
        preco: editingServico.price || editingServico.preco || '',
        duracao: editingServico.duration || editingServico.duracao || '',
        status: editingServico.status !== undefined ? editingServico.status : true
      });
    } else {
      setFormData({
        nome: '',
        categoria: '',
        descricao: '',
        preco: '',
        duracao: '',
        status: true
      });
    }
    setErrors({});
  }, [editingServico, open]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.categoria.trim()) {
      newErrors.categoria = 'Categoria é obrigatória';
    }

    if (!formData.preco || parseFloat(formData.preco) <= 0) {
      newErrors.preco = 'Preço deve ser maior que zero';
    }

    if (!formData.duracao || parseInt(formData.duracao) <= 0) {
      newErrors.duracao = 'Duração deve ser maior que zero';
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
      const submitData = {
        name: formData.nome,
        category: formData.categoria,
        description: formData.descricao,
        price: parseFloat(formData.preco),
        duration: parseInt(formData.duracao),
        status: formData.status
      };
      onSave(submitData);
      onClose();
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
        {editingServico ? 'Editar Serviço' : 'Novo Serviço'}
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3} sx={{ mt: 0 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nome do Serviço"
              value={formData.nome}
              onChange={handleChange('nome')}
              error={!!errors.nome}
              helperText={errors.nome}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.categoria}>
              <InputLabel>Categoria</InputLabel>
              <Select
                value={formData.categoria}
                onChange={handleChange('categoria')}
                label="Categoria"
              >
                {categorias.map((categoria) => (
                  <MenuItem key={categoria} value={categoria}>
                    {categoria}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descrição"
              multiline
              rows={3}
              value={formData.descricao}
              onChange={handleChange('descricao')}
              placeholder="Descrição detalhada do serviço..."
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Preço (R$)"
              type="number"
              value={formData.preco}
              onChange={handleChange('preco')}
              error={!!errors.preco}
              helperText={errors.preco}
              inputProps={{ min: 0, step: 0.01 }}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Duração (minutos)"
              type="number"
              value={formData.duracao}
              onChange={handleChange('duracao')}
              error={!!errors.duracao}
              helperText={errors.duracao}
              inputProps={{ min: 15, step: 15 }}
              required
            />
          </Grid>
          
          <Grid item xs={12}>
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
          {editingServico ? 'Atualizar' : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ServicoModal;