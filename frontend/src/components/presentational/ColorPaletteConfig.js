import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Grid,
  Chip,
  Alert
} from '@mui/material';
import { Palette } from '@mui/icons-material';
import { COLOR_PALETTES, getPaletteOptions } from '../../utils/colorPalettes';
import { keaClientService } from '../../services/keaClientService';
import { useTheme } from '../../services/ThemeContext';

const ColorPaletteConfig = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedPalette, setSelectedPalette] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });
  const { updateClientPalette } = useTheme();

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const data = await keaClientService.getKeaClients();
      setClients(data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  };

  const handleClientChange = (event) => {
    const clientId = event.target.value;
    setSelectedClient(clientId);
    
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setSelectedPalette(client.color_palette || 'KEA_LABS');
    }
  };

  const handleSave = async () => {
    if (!selectedClient || !selectedPalette) return;
    
    setLoading(true);
    try {
      const success = await updateClientPalette(selectedClient, selectedPalette);
      if (success) {
        setAlert({ show: true, message: 'Paleta atualizada com sucesso!', severity: 'success' });
        await loadClients();
      } else {
        setAlert({ show: true, message: 'Erro ao atualizar paleta', severity: 'error' });
      }
    } catch (error) {
      setAlert({ show: true, message: 'Erro ao salvar configuração', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const renderPalettePreview = (paletteId) => {
    const palette = COLOR_PALETTES[paletteId];
    if (!palette) return null;

    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Prévia da Paleta: {palette.name}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip 
            label="Primária" 
            sx={{ backgroundColor: palette.primary, color: 'white' }} 
          />
          <Chip 
            label="Secundária" 
            sx={{ backgroundColor: palette.secondary, color: 'white' }} 
          />
          <Chip 
            label="Destaque" 
            sx={{ backgroundColor: palette.accent, color: 'white' }} 
          />
        </Box>
      </Box>
    );
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Palette sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h6">
            Configuração de Paleta de Cores
          </Typography>
        </Box>

        {alert.show && (
          <Alert 
            severity={alert.severity} 
            onClose={() => setAlert({ ...alert, show: false })}
            sx={{ mb: 2 }}
          >
            {alert.message}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Cliente</InputLabel>
              <Select
                value={selectedClient}
                onChange={handleClientChange}
                label="Cliente"
              >
                {clients.map((client) => (
                  <MenuItem key={client.id} value={client.id}>
                    {client.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth disabled={!selectedClient}>
              <InputLabel>Paleta de Cores</InputLabel>
              <Select
                value={selectedPalette}
                onChange={(e) => setSelectedPalette(e.target.value)}
                label="Paleta de Cores"
              >
                {getPaletteOptions().map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {selectedPalette && (
            <Grid item xs={12}>
              {renderPalettePreview(selectedPalette)}
            </Grid>
          )}

          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={!selectedClient || !selectedPalette || loading}
              sx={{ mt: 2 }}
            >
              {loading ? 'Salvando...' : 'Salvar Configuração'}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ColorPaletteConfig;