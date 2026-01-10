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
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  OutlinedInput
} from '@mui/material';
import { serviceService } from '../../services/serviceService';
import { getPaletteOptions } from '../../utils/colorPalettes';

const KeaClientModal = ({ open, onClose, onSave, client, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    cpf_cnpj: '',
    email: '',
    site: '',
    phone_number: '',
    cell_phone: '',
    whatsapp_number: '',
    address: '',
    status: true,
    payment_plan: '',
    user_quantity: 1,
    last_payment_date: '',
    segmento: [],
    color_palette: 'KEA_LABS'
  });

  const [segmentos, setSegmentos] = useState([]);

  const paymentPlans = [
    { value: 'basico', label: 'Básico' },
    { value: 'premium', label: 'Premium' },
    { value: 'enterprise', label: 'Enterprise' }
  ];

  useEffect(() => {
    const loadSegmentos = async () => {
      try {
        const categories = await serviceService.getServiceCategories();
        console.log('Categorias carregadas:', categories);
        setSegmentos(categories || []);
      } catch (error) {
        console.error('Erro ao carregar segmentos:', error);
        setSegmentos([]);
      }
    };
    if (open) {
      loadSegmentos();
    }
  }, [open]);

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || '',
        cpf_cnpj: client.cpf_cnpj || '',
        email: client.email || '',
        site: client.site || '',
        phone_number: client.phone_number || '',
        cell_phone: client.cell_phone || '',
        whatsapp_number: client.whatsapp_number || '',
        address: client.address || '',
        status: client.status !== undefined ? client.status : true,
        payment_plan: client.payment_plan || '',
        user_quantity: client.user_quantity || 1,
        last_payment_date: client.last_payment_date || '',
        segmento: client.segmento || [],
        color_palette: client.color_palette || 'KEA_LABS'
      });
    } else {
      setFormData({
        name: '',
        cpf_cnpj: '',
        email: '',
        site: '',
        phone_number: '',
        cell_phone: '',
        whatsapp_number: '',
        address: '',
        status: true,
        payment_plan: '',
        user_quantity: 1,
        last_payment_date: '',
        segmento: [],
        color_palette: 'KEA_LABS'
      });
    }
  }, [client, open]);

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
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
        {client ? 'Editar Cliente KEA' : 'Novo Cliente KEA'}
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Nome *"
                value={formData.name}
                onChange={handleChange('name')}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="CPF/CNPJ *"
                value={formData.cpf_cnpj}
                onChange={handleChange('cpf_cnpj')}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email *"
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Site"
                value={formData.site}
                onChange={handleChange('site')}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Telefone"
                value={formData.phone_number}
                onChange={handleChange('phone_number')}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Celular"
                value={formData.cell_phone}
                onChange={handleChange('cell_phone')}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="WhatsApp"
                value={formData.whatsapp_number}
                onChange={handleChange('whatsapp_number')}
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
                select
                label="Plano de Pagamento"
                value={formData.payment_plan}
                onChange={handleChange('payment_plan')}
              >
                {paymentPlans.map((plan) => (
                  <MenuItem key={plan.value} value={plan.value}>
                    {plan.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Paleta de Cores"
                value={formData.color_palette}
                onChange={handleChange('color_palette')}
              >
                {getPaletteOptions().map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Quantidade de Usuários"
                type="number"
                value={formData.user_quantity}
                onChange={handleChange('user_quantity')}
                inputProps={{ min: 1 }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Segmento</InputLabel>
                <Select
                  multiple
                  value={formData.segmento}
                  onChange={handleChange('segmento')}
                  input={<OutlinedInput label="Segmento" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {segmentos.map((segmento) => (
                    <MenuItem key={segmento} value={segmento}>
                      {segmento}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Data do Último Pagamento"
                type="date"
                value={formData.last_payment_date}
                onChange={handleChange('last_payment_date')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.status}
                    onChange={handleChange('status')}
                  />
                }
                label="Status Ativo"
              />
            </Grid>
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
          disabled={loading || !formData.name.trim() || !formData.cpf_cnpj.trim() || !formData.email.trim()}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
            }
          }}
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default KeaClientModal;