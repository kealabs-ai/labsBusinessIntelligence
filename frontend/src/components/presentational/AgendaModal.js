import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Grid,
  Divider
} from '@mui/material';
import { Save, Close } from '@mui/icons-material';

const AgendaModal = ({ open, onClose, onSave, editingEvent }) => {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    cliente: '',
    servico: '',
    valor: '',
    whatsappNumber: '',
    customMessage: 'Olá {{nome_cliente}}, lembramos que você tem um agendamento em {{data_agenda}} às {{hora_agenda}} para {{servico}}.',
    enableNotification: true
  });

  React.useEffect(() => {
    if (editingEvent) {
      setFormData({
        title: editingEvent.title || '',
        date: editingEvent.date || '',
        time: editingEvent.time || '',
        cliente: editingEvent.cliente || '',
        servico: editingEvent.servico || '',
        valor: editingEvent.valor ? editingEvent.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '',
        whatsappNumber: editingEvent.whatsapp_number || '',
        customMessage: editingEvent.custom_message || 'Olá {{nome_cliente}}, lembramos que você tem um agendamento em {{data_agenda}} às {{hora_agenda}} para {{servico}}.',
        enableNotification: editingEvent.enable_notification !== undefined ? editingEvent.enable_notification : true
      });
    } else {
      setFormData({
        title: '',
        date: '',
        time: '',
        cliente: '',
        servico: '',
        valor: '',
        whatsappNumber: '',
        customMessage: 'Olá {{nome_cliente}}, lembramos que você tem um agendamento em {{data_agenda}} às {{hora_agenda}} para {{servico}}.',
        enableNotification: true
      });
    }
  }, [editingEvent, open]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (value) => {
    const numbers = value.replace(/\D/g, '');
    const amount = parseFloat(numbers) / 100;
    return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const parseCurrency = (value) => {
    const numbers = value.replace(/\D/g, '');
    return parseFloat(numbers) / 100;
  };

  const handleSave = () => {
    // Mapear campos do modal para formato esperado pelo backend
    const mappedData = {
      cliente: formData.cliente,
      servico: formData.servico,
      date: formData.date,
      time: formData.time,
      valor: formData.valor ? parseCurrency(formData.valor) : null,
      whatsappNumber: formData.whatsappNumber,
      customMessage: formData.customMessage,
      enableNotification: formData.enableNotification
    };
    onSave(mappedData);
    
    // Limpar campos após salvar
    setFormData({
      title: '',
      date: '',
      time: '',
      cliente: '',
      servico: '',
      valor: '',
      whatsappNumber: '',
      customMessage: 'Olá {{nome_cliente}}, lembramos que você tem um agendamento em {{data_agenda}} às {{hora_agenda}} para {{servico}}.',
      enableNotification: true
    });
    
    onClose();
  };

  const formatPhoneNumber = (value) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Formatar para +55 (XX) XXXXX-XXXX
    if (numbers.length <= 2) return `+${numbers}`;
    if (numbers.length <= 4) return `+${numbers.slice(0, 2)} (${numbers.slice(2)}`;
    if (numbers.length <= 9) return `+${numbers.slice(0, 2)} (${numbers.slice(2, 4)}) ${numbers.slice(4)}`;
    return `+${numbers.slice(0, 2)} (${numbers.slice(2, 4)}) ${numbers.slice(4, 9)}-${numbers.slice(9, 13)}`;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {editingEvent ? 'Editar Agendamento' : 'Novo Agendamento'}
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cliente"
                value={formData.cliente}
                onChange={(e) => handleChange('cliente', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Serviço"
                value={formData.servico}
                onChange={(e) => handleChange('servico', e.target.value)}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Data"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="time"
                label="Hora"
                value={formData.time}
                onChange={(e) => handleChange('time', e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Valor (Opcional)"
                value={formData.valor}
                onChange={(e) => handleChange('valor', formatCurrency(e.target.value))}
                placeholder="R$ 0,00"
                helperText="Valor do serviço em reais"
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Configuração de Aviso WhatsApp
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.enableNotification}
                    onChange={(e) => handleChange('enableNotification', e.target.checked)}
                    color="primary"
                  />
                }
                label="Habilitar aviso automático (24h antes)"
              />
            </Grid>
            
            {formData.enableNotification && (
              <>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Número WhatsApp"
                    placeholder="+55 (11) 99999-9999"
                    value={formData.whatsappNumber}
                    onChange={(e) => handleChange('whatsappNumber', formatPhoneNumber(e.target.value))}
                    helperText="Formato: +55 (DDD) XXXXX-XXXX"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Mensagem Personalizada"
                    value={formData.customMessage}
                    onChange={(e) => handleChange('customMessage', e.target.value)}
                    helperText="Use {{nome_cliente}}, {{data_agenda}}, {{hora_agenda}}, {{servico}} para personalizar"
                  />
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={onClose}
          startIcon={<Close />}
          variant="outlined"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          startIcon={<Save />}
          variant="contained"
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
            }
          }}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AgendaModal;