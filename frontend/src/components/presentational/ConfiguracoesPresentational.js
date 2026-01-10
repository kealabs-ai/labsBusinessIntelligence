import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Grid,
  Switch,
  FormControlLabel,
  Divider
} from '@mui/material';
import {
  Save,
  Settings,
  Business,
  Schedule,
  Notifications
} from '@mui/icons-material';
import ColorPaletteConfig from './ColorPaletteConfig';

const ConfiguracoesPresentational = ({
  configuracoes,
  loading,
  onSaveConfiguracoes
}) => {
  const [formData, setFormData] = useState({
    nome_unidade: configuracoes?.nome_unidade || '',
    endereco: configuracoes?.endereco || '',
    telefone: configuracoes?.telefone || '',
    email: configuracoes?.email || '',
    horario_funcionamento_inicio: configuracoes?.horario_funcionamento_inicio || '08:00',
    horario_funcionamento_fim: configuracoes?.horario_funcionamento_fim || '18:00',
    intervalo_agendamento: configuracoes?.intervalo_agendamento || 30,
    notificacoes_ativas: configuracoes?.notificacoes_ativas || true,
    antecedencia_notificacao: configuracoes?.antecedencia_notificacao || 24,
    ...configuracoes
  });

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onSaveConfiguracoes(formData);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2
      }}>
        <Typography variant="h4" component="h1" sx={{ 
          fontWeight: 600,
          color: '#333'
        }}>
          Configurações da Unidade
        </Typography>
        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={handleSave}
          disabled={loading}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
            },
            borderRadius: 2,
            px: 3,
            py: 1
          }}
        >
          Salvar Configurações
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Configuração de Paleta de Cores */}
        <Grid item xs={12}>
          <ColorPaletteConfig />
        </Grid>

        {/* Informações da Unidade */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Business sx={{ mr: 1, color: '#667eea' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Informações da Unidade
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nome da Unidade"
                    value={formData.nome_unidade}
                    onChange={handleChange('nome_unidade')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Telefone"
                    value={formData.telefone}
                    onChange={handleChange('telefone')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange('email')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Endereço"
                    value={formData.endereco}
                    onChange={handleChange('endereco')}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Horário de Funcionamento */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Schedule sx={{ mr: 1, color: '#667eea' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Horário de Funcionamento
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Horário de Início"
                    type="time"
                    value={formData.horario_funcionamento_inicio}
                    onChange={handleChange('horario_funcionamento_inicio')}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Horário de Fim"
                    type="time"
                    value={formData.horario_funcionamento_fim}
                    onChange={handleChange('horario_funcionamento_fim')}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Intervalo entre Agendamentos (minutos)"
                    type="number"
                    value={formData.intervalo_agendamento}
                    onChange={handleChange('intervalo_agendamento')}
                    inputProps={{ min: 15, max: 120, step: 15 }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Configurações de Notificação */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Notifications sx={{ mr: 1, color: '#667eea' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Notificações
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.notificacoes_ativas}
                        onChange={handleChange('notificacoes_ativas')}
                        color="primary"
                      />
                    }
                    label="Ativar notificações automáticas"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Antecedência para notificação (horas)"
                    type="number"
                    value={formData.antecedencia_notificacao}
                    onChange={handleChange('antecedencia_notificacao')}
                    disabled={!formData.notificacoes_ativas}
                    inputProps={{ min: 1, max: 168 }}
                    helperText="Tempo antes do agendamento para enviar notificação"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ConfiguracoesPresentational;