import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography
} from '@mui/material';
import { Save, Close } from '@mui/icons-material';

const NotificationModal = ({ open, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    quantidade: 1,
    unidade: 'dias'
  });

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Configurar Aviso de Antecedência
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
            Configure quando o aviso via WhatsApp deve ser enviado antes do agendamento
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              type="number"
              label="Quantidade"
              value={formData.quantidade}
              onChange={(e) => setFormData({ ...formData, quantidade: parseInt(e.target.value) || 1 })}
              inputProps={{ min: 1, max: 30 }}
              sx={{ width: '150px' }}
            />
            
            <FormControl sx={{ width: '200px' }}>
              <InputLabel>Unidade</InputLabel>
              <Select
                value={formData.unidade}
                onChange={(e) => setFormData({ ...formData, unidade: e.target.value })}
              >
                <MenuItem value="dias">Dias</MenuItem>
                <MenuItem value="semanas">Semanas</MenuItem>
                <MenuItem value="meses">Meses</MenuItem>
              </Select>
            </FormControl>
            
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              antes do agendamento
            </Typography>
          </Box>
          
          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Exemplo: {formData.quantidade} {formData.unidade} antes da data agendada
            </Typography>
          </Box>
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

export default NotificationModal;