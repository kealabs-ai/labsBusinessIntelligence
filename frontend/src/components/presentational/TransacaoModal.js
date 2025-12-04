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
  Typography
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';

const TransacaoModal = ({ open, onClose, onSave, editingTransacao }) => {
  const [formData, setFormData] = useState({
    tipo: 'entrada',
    categoria: '',
    descricao: '',
    valor: '',
    data_transacao: '',
    metodo_pagamento: '',
    observacoes: '',
    status: true
  });

  const [errors, setErrors] = useState({});

  const categorias = [
    'Vendas', 'Serviços', 'Consultoria', 'Produtos', 'Comissões',
    'Aluguel', 'Salários', 'Fornecedores', 'Marketing', 'Equipamentos',
    'Impostos', 'Utilities', 'Manutenção', 'Outros'
  ];

  const metodosPagamento = [
    'Dinheiro', 'Cartão de Crédito', 'Cartão de Débito', 'PIX',
    'Transferência Bancária', 'Boleto', 'Cheque'
  ];

  useEffect(() => {
    if (editingTransacao) {
      setFormData({
        tipo: editingTransacao.transaction_type || editingTransacao.tipo || 'entrada',
        categoria: editingTransacao.category || editingTransacao.categoria || '',
        descricao: editingTransacao.description || editingTransacao.descricao || '',
        valor: editingTransacao.amount || editingTransacao.valor || '',
        data_transacao: editingTransacao.transaction_date || editingTransacao.data_transacao ? 
          new Date(editingTransacao.transaction_date || editingTransacao.data_transacao).toISOString().split('T')[0] : '',
        metodo_pagamento: editingTransacao.payment_method || editingTransacao.metodo_pagamento || '',
        observacoes: editingTransacao.observacoes || '',
        status: editingTransacao.status !== undefined ? editingTransacao.status : true
      });
    } else {
      setFormData({
        tipo: 'entrada',
        categoria: '',
        descricao: '',
        valor: '',
        data_transacao: new Date().toISOString().split('T')[0],
        metodo_pagamento: '',
        observacoes: '',
        status: true
      });
    }
    setErrors({});
  }, [editingTransacao, open]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.categoria.trim()) {
      newErrors.categoria = 'Categoria é obrigatória';
    }

    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    }

    if (!formData.valor || parseFloat(formData.valor) <= 0) {
      newErrors.valor = 'Valor deve ser maior que zero';
    }

    if (!formData.data_transacao) {
      newErrors.data_transacao = 'Data é obrigatória';
    }

    if (!formData.metodo_pagamento.trim()) {
      newErrors.metodo_pagamento = 'Método de pagamento é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;
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
        transaction_type: formData.tipo,
        amount: parseFloat(formData.valor),
        description: formData.descricao,
        transaction_date: new Date(formData.data_transacao).toISOString(),
        category: formData.categoria,
        payment_method: formData.metodo_pagamento
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
        {editingTransacao ? 'Editar Transação' : 'Nova Transação'}
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3} sx={{ mt: 0 }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.tipo}>
              <InputLabel>Tipo</InputLabel>
              <Select
                value={formData.tipo}
                onChange={handleChange('tipo')}
                label="Tipo"
              >
                <MenuItem value="entrada">Entrada</MenuItem>
                <MenuItem value="saida">Saída</MenuItem>
              </Select>
            </FormControl>
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
              {errors.categoria && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                  {errors.categoria}
                </Typography>
              )}
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descrição"
              value={formData.descricao}
              onChange={handleChange('descricao')}
              error={!!errors.descricao}
              helperText={errors.descricao}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Valor"
              type="number"
              value={formData.valor}
              onChange={handleChange('valor')}
              error={!!errors.valor}
              helperText={errors.valor}
              inputProps={{ min: 0, step: 0.01 }}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Data da Transação"
              type="date"
              value={formData.data_transacao}
              onChange={handleChange('data_transacao')}
              error={!!errors.data_transacao}
              helperText={errors.data_transacao}
              InputLabelProps={{
                shrink: true,
              }}
              required
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControl fullWidth error={!!errors.metodo_pagamento}>
              <InputLabel>Método de Pagamento</InputLabel>
              <Select
                value={formData.metodo_pagamento}
                onChange={handleChange('metodo_pagamento')}
                label="Método de Pagamento"
              >
                {metodosPagamento.map((metodo) => (
                  <MenuItem key={metodo} value={metodo}>
                    {metodo}
                  </MenuItem>
                ))}
              </Select>
              {errors.metodo_pagamento && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                  {errors.metodo_pagamento}
                </Typography>
              )}
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Observações"
              multiline
              rows={3}
              value={formData.observacoes}
              onChange={handleChange('observacoes')}
              placeholder="Informações adicionais sobre a transação..."
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
          {editingTransacao ? 'Atualizar' : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransacaoModal;