import React, { useState, useEffect } from 'react';
import DialogMui from '@mui/material/Dialog';
import DialogTitleMui from '@mui/material/DialogTitle';
import DialogContentMui from '@mui/material/DialogContent';
import DialogActionsMui from '@mui/material/DialogActions';
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
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Save, Close } from '@mui/icons-material';

const AgendaModal = ({ open, onClose, onSave, editingEvent }) => {
    const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    client_id: '',
    cliente: '',
    service_id: '',
    servico: '',
    valor: '',
    whatsappNumber: '',
    customMessage: 'Olá {{nome_cliente}}, lembramos que você tem um agendamento em {{data_agenda}} às {{hora_agenda}} para {{servico}}.',
    enableNotification: true
  });

  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const unitId = localStorage.getItem('unit_id');
        const keaClientId = localStorage.getItem('kea_client_id');
        
        const [clientsResponse, servicesResponse] = await Promise.all([
          fetch('http://72.60.140.128:6002/api/v1/clients', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          }),
          fetch('http://72.60.140.128:6002/api/v1/services', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          })
        ]);
        
        if (clientsResponse.ok) {
          const clientsData = await clientsResponse.json();
          setClients(clientsData);
        }
        
        if (servicesResponse.ok) {
          const servicesData = await servicesResponse.json();
          const filteredServices = servicesData.filter(service => 
            service.unit_id == unitId && service.kea_client_id === keaClientId
          );
          setServices(filteredServices);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };
    
    if (open) {
      loadData();
    }
  }, [open]);

  React.useEffect(() => {
    if (editingEvent) {
      setFormData({
        title: editingEvent.title || '',
        date: editingEvent.date || '',
        time: editingEvent.time || '',
        client_id: editingEvent.client_id || '',
        cliente: editingEvent.cliente || '',
        service_id: editingEvent.service_id || '',
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
        client_id: '',
        cliente: '',
        service_id: localStorage.getItem('selected_service_id') || '',
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
    // Validação do número WhatsApp: deve começar com + e ter código do país
    if (!/^\+\d{2}/.test(formData.whatsappNumber)) {
      setOpenDialog(true);
      return;
    }
    // Formatar data_agenda para dd/MM/YYYY na mensagem personalizada
    let customMessage = formData.customMessage;
    if (formData.date) {
      const [yyyy, mm, dd] = formData.date.split('-');
      const dataFormatada = `${dd}/${mm}/${yyyy}`;
      customMessage = customMessage.replace(/\{\{data_agenda\}\}/g, dataFormatada);
    }
    const mappedData = {
      client_id: parseInt(formData.client_id),
      cliente: formData.cliente,
      service_id: parseInt(formData.service_id),
      servico: formData.servico,
      date: formData.date,
      time: formData.time,
      valor: formData.valor ? parseCurrency(formData.valor) : null,
      whatsappNumber: formData.whatsappNumber,
      customMessage: customMessage,
      enableNotification: formData.enableNotification,
      kea_client_id: localStorage.getItem('kea_client_id') || null
    };
    onSave(mappedData);
    setFormData({
      title: '',
      date: '',
      time: '',
      client_id: '',
      cliente: '',
      service_id: '',
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
    
    // Formatar para +55(XX)XXXXX-XXXX
    if (numbers.length <= 2) return `+${numbers}`;
    if (numbers.length <= 4) return `+${numbers.slice(0, 2)}(${numbers.slice(2)}`;
    if (numbers.length <= 9) return `+${numbers.slice(0, 2)}(${numbers.slice(2, 4)})${numbers.slice(4)}`;
    return `+${numbers.slice(0, 2)}(${numbers.slice(2, 4)})${numbers.slice(4, 9)}-${numbers.slice(9, 13)}`;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            {/* Dialogo de instrução para número WhatsApp */}
            <DialogMui open={openDialog} onClose={() => setOpenDialog(false)}>
              <DialogTitleMui>Formato do número WhatsApp</DialogTitleMui>
              <DialogContentMui>
                <Typography>O número do WhatsApp deve conter o código do país. Exemplo para Brasil: <b>+55(19)99999-9999</b></Typography>
              </DialogContentMui>
              <DialogActionsMui>
                <Button onClick={() => setOpenDialog(false)} autoFocus>OK</Button>
              </DialogActionsMui>
            </DialogMui>
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {editingEvent ? 'Editar Agendamento' : 'Novo Agendamento'}
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Cliente</InputLabel>
                <Select
                  value={formData.client_id}
                  onChange={(e) => {
                    const selectedClient = clients.find(c => c.client_id === e.target.value);
                    handleChange('client_id', e.target.value);
                    handleChange('cliente', selectedClient ? selectedClient.full_name : '');
                    handleChange('whatsappNumber', selectedClient ? selectedClient.phone_whatsapp : '');
                  }}
                  label="Cliente"
                >
                  <MenuItem value="">
                    <em>Selecione um cliente</em>
                  </MenuItem>
                  {clients.map((client) => (
                    <MenuItem key={client.client_id} value={client.client_id}>
                      {client.full_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Serviço</InputLabel>
                <Select
                  value={formData.service_id?.toString() || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    const selectedService = services.find(s => String(s.service_id) === String(value));
                    handleChange('service_id', value);
                    handleChange('servico', selectedService ? selectedService.name : '');
                    handleChange('valor', selectedService ? selectedService.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '');
                    localStorage.setItem('selected_service_id', value);
                  }}
                  label="Serviço"
                  multiple={false}
                >
                  <MenuItem value="">
                    <em>Selecione um serviço</em>
                  </MenuItem>
                  {services.map((service) => (
                    <MenuItem key={service.service_id} value={service.service_id?.toString()}>
                      {service.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Número WhatsApp"
                placeholder="+55(11)99999-9999"
                value={formData.whatsappNumber}
                onChange={(e) => handleChange('whatsappNumber', formatPhoneNumber(e.target.value))}
                helperText="Preenchido automaticamente ao selecionar cliente"
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