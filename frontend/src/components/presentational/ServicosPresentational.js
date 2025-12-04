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
  Grid
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Work,
  AttachMoney
} from '@mui/icons-material';

const ServicosPresentational = ({
  servicos,
  loading,
  onOpenModal,
  onEditServico,
  onDeleteServico
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredServicos = servicos.filter(servico =>
    servico.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    servico.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
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
          Gerenciamento de Serviços
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={onOpenModal}
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
          Novo Serviço
        </Button>
      </Box>

      <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
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

      <Card sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
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
                  key={servico.id}
                  sx={{
                    borderBottom: index < filteredServicos.length - 1 ? '1px solid #f0f0f0' : 'none',
                    py: 2,
                    '&:hover': {
                      backgroundColor: '#f8f9fa'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                    <Work sx={{ color: '#667eea' }} />
                  </Box>
                  
                  <ListItemText
                    sx={{ flex: 1 }}
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {servico.nome}
                        </Typography>
                        <Chip
                          label={servico.categoria}
                          size="small"
                          sx={{ backgroundColor: '#e3f2fd', color: '#1976d2' }}
                        />
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
                          <Typography variant="body2" color="textSecondary">
                            <strong>Preço:</strong> {formatCurrency(servico.preco)}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            <strong>Duração:</strong> {servico.duracao} min
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          {servico.descricao && (
                            <Typography variant="body2" color="textSecondary">
                              <strong>Descrição:</strong> {servico.descricao}
                            </Typography>
                          )}
                        </Grid>
                      </Grid>
                    }
                  />
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <IconButton
                      onClick={() => onEditServico(servico)}
                      sx={{ color: '#1976d2' }}
                      title="Editar serviço"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => onDeleteServico(servico.id)}
                      sx={{ color: '#f44336' }}
                      title="Excluir serviço"
                    >
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