import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  TextField,
  Grid,
  CircularProgress
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Work,
  AttachMoney,
  Build
} from '@mui/icons-material';

const ServicosPresentational = ({
  servicos,
  loading,
  onOpenModal,
  onEditServico,
  onDeleteServico,
  palette
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredServicos = servicos.filter(servico => {
    const nome = servico.nome || servico.name || '';
    const categoria = servico.categoria || servico.category || '';
    return nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
           categoria.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const formatCurrency = (value) => {
    if (value === undefined || value === null) return 'N/A';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Box sx={{ p: 3, backgroundColor: palette.background, minHeight: '100%' }}>
      <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', background: palette.gradient }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Build sx={{ fontSize: 32, color: 'white' }} />
              <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: 'white' }}>
                Gerenciamento de Serviços
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={onOpenModal}
            >
              Novo Serviço
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.1)', bgcolor: palette.surface }}>
        <CardContent>
          <TextField
            fullWidth
            label="Buscar serviços"
            placeholder="Digite o nome ou categoria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.1)', bgcolor: palette.surface }}>
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box sx={{ p: 3, textAlign: 'center', color: palette.textPrimary }}>
              <CircularProgress />
              <Typography>Carregando serviços...</Typography>
            </Box>
          ) : filteredServicos.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="textSecondary">
                {searchTerm ? 'Nenhum serviço encontrado' : 'Nenhum serviço cadastrado'}
              </Typography>
            </Box>
          ) : (
            <List>
              {filteredServicos.map((servico, index) => (
                <ListItem
                  key={servico.service_id}
                  sx={{
                    borderBottom: `1px solid ${palette.background}`,
                    py: 2,
                    '&:hover': { backgroundColor: palette.background }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                    <Work sx={{ color: palette.primary }} />
                  </Box>
                  
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: palette.textPrimary }}>
                          {servico.nome || servico.name}
                        </Typography>
                        <Chip label={servico.categoria || servico.category} size="small" />
                        <Chip
                          label={servico.status ? 'Ativo' : 'Inativo'}
                          size="small"
                          color={servico.status ? 'success' : 'error'}
                        />
                      </Box>
                    }
                    secondary={
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="textSecondary"><strong>Preço:</strong> {formatCurrency(servico.preco || servico.price)}</Typography>
                          <Typography variant="body2" color="textSecondary"><strong>Duração:</strong> {servico.duracao || servico.duration} min</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          {(servico.descricao || servico.description) && (
                            <Typography variant="body2" color="textSecondary"><strong>Descrição:</strong> {servico.descricao || servico.description}</Typography>
                          )}
                        </Grid>
                      </Grid>
                    }
                  />
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton onClick={() => onEditServico(servico)} sx={{ color: palette.primary }} title="Editar serviço">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => onDeleteServico(servico.service_id)} sx={{ color: palette.error }} title="Inativar serviço">
                      <Delete />
                    </IconButton>
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ServicosPresentational;