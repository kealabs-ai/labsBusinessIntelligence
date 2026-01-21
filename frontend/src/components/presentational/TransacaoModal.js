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

const TransacaoModal = ({ open, onClose, onSave, editingTransacao, palette }) => {
  const [formData, setFormData] = useState({
    tipo: 'entrada',
    categoria: '',
    descricao: '',
    valor: '',
    data_transacao: '',
    metodo_pagamento: '',
    observacoes: '',
    status: true,
    unit_id: '',
    kea_client_id: ''
  });

  const [units, setUnits] = useState([]);
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
        status: editingTransacao.status !== undefined ? editingTransacao.status : true,
        unit_id: editingTransacao.unit_id || '',
        kea_client_id: editingTransacao.kea_client_id || ''
      });
    } else {
      const sessionKeaClientId = localStorage.getItem('kea_client_id');
      const sessionRoleId = localStorage.getItem('role_id');
      setFormData({
        tipo: 'entrada',
        categoria: '',
        descricao: '',
        valor: '',
        data_transacao: new Date().toISOString().split('T')[0],
        metodo_pagamento: '',
        observacoes: '',
        status: true,
        unit_id: '',
        kea_client_id: sessionKeaClientId || '',
        role_id: sessionRoleId || ''
      });
    }
    setErrors({});
  }, [editingTransacao, open]);

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

    if (!formData.categoria.trim()) newErrors.categoria = 'Categoria é obrigatória';
    if (!formData.descricao.trim()) newErrors.descricao = 'Descrição é obrigatória';
    if (!formData.valor || parseFloat(formData.valor) <= 0) newErrors.valor = 'Valor deve ser maior que zero';
    if (!formData.data_transacao) newErrors.data_transacao = 'Data é obrigatória';
    if (!formData.metodo_pagamento.trim()) newErrors.metodo_pagamento = 'Método de pagamento é obrigatório';
    if (!formData.unit_id) newErrors.unit_id = 'Unidade é obrigatória';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
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
        payment_method: formData.metodo_pagamento,
        unit_id: parseInt(formData.unit_id),
        kea_client_id: formData.kea_client_id,
        role_id: parseInt(formData.role_id) || 1
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
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          bgcolor: palette.surface
        }
      }}
    >
      <DialogTitle sx={{ background: palette.gradient, color: 'white', fontWeight: 600 }}>
        {editingTransacao ? 'Editar Transação' : 'Nova Transação'}
      </DialogTitle>
      
      <DialogContent sx={{ p: 3, backgroundColor: palette.surface }}>
        <Grid container spacing={3} sx={{ mt: 0 }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.tipo}>
              <InputLabel>Tipo</InputLabel>
              <Select value={formData.tipo} onChange={handleChange('tipo')} label="Tipo">
                <MenuItem value="entrada">Entrada</MenuItem>
                <MenuItem value="saida">Saída</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.categoria}>
              <InputLabel>Categoria</InputLabel>
              <Select value={formData.categoria} onChange={handleChange('categoria')} label="Categoria">
                {categorias.map((cat) => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
              </Select>
              {errors.categoria && <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>{errors.categoria}</Typography>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField fullWidth label="Descrição" value={formData.descricao} onChange={handleChange('descricao')} error={!!errors.descricao} helperText={errors.descricao} required />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Valor" type="number" value={formData.valor} onChange={handleChange('valor')} error={!!errors.valor} helperText={errors.valor} inputProps={{ min: 0, step: 0.01 }} required />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Data da Transação" type="date" value={formData.data_transacao} onChange={handleChange('data_transacao')} error={!!errors.data_transacao} helperText={errors.data_transacao} InputLabelProps={{ shrink: true }} required />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.metodo_pagamento}>
              <InputLabel>Método de Pagamento</InputLabel>
              <Select value={formData.metodo_pagamento} onChange={handleChange('metodo_pagamento')} label="Método de Pagamento">
                {metodosPagamento.map((metodo) => <MenuItem key={metodo} value={metodo}>{metodo}</MenuItem>)}
              </Select>
              {errors.metodo_pagamento && <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>{errors.metodo_pagamento}</Typography>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.unit_id}>
              <InputLabel>Unidade *</InputLabel>
              <Select value={formData.unit_id} onChange={handleChange('unit_id')} label="Unidade *" required>
                <MenuItem value=""><em>Selecione uma unidade</em></MenuItem>
                {units.map((unit) => <MenuItem key={unit.id} value={unit.id}>{unit.unit_name}</MenuItem>)}
              </Select>
              {errors.unit_id && <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>{errors.unit_id}</Typography>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField fullWidth label="Observações" multiline rows={3} value={formData.observacoes} onChange={handleChange('observacoes')} placeholder="Informações adicionais..." />
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, gap: 1, backgroundColor: palette.surface }}>
        <Button onClick={onClose} startIcon={<Cancel />} sx={{ color: palette.textSecondary }}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant="contained" startIcon={<Save />}>
          {editingTransacao ? 'Atualizar' : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransacaoModal;