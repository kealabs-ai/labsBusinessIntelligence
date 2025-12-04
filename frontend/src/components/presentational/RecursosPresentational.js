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
  Avatar
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Person,
  Business
} from '@mui/icons-material';

const RecursosPresentational = ({
  recursos,
  loading,
  onOpenModal,
  onEditRecurso,
  onDeleteRecurso
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecursos = recursos.filter(recurso =>
    recurso.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recurso.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRecursoIcon = (tipo) => {
    return tipo === 'profissional' ? <Person /> : <Business />;
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
          Recursos e Profissionais
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
          Novo Recurso
        </Button>
      </Box>

      <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <CardContent>
          <TextField
            fullWidth
            label="Buscar recursos"
            placeholder="Digite o nome ou tipo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography>Carregando recursos...</Typography>
            </Box>
          ) : filteredRecursos.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="textSecondary">
                {searchTerm ? 'Nenhum recurso encontrado' : 'Nenhum recurso cadastrado'}
              </Typography>
            </Box>
          ) : (
            <List>
              {filteredRecursos.map((recurso, index) => (
                <ListItem
                  key={recurso.id}
                  sx={{
                    borderBottom: index < filteredRecursos.length - 1 ? '1px solid #f0f0f0' : 'none',
                    py: 2,
                    '&:hover': {
                      backgroundColor: '#f8f9fa'
                    }
                  }}
                >
                  <Avatar sx={{ 
                    bgcolor: recurso.tipo === 'profissional' ? '#4caf50' : '#2196f3',
                    mr: 2
                  }}>
                    {getRecursoIcon(recurso.tipo)}
                  </Avatar>
                  
                  <ListItemText
                    sx={{ flex: 1 }}
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {recurso.nome}
                        </Typography>
                        <Chip
                          label={recurso.tipo}
                          size="small"
                          color={recurso.tipo === 'profissional' ? 'success' : 'primary'}
                        />
                        <Chip
                          label={recurso.status ? 'Ativo' : 'Inativo'}
                          size="small"
                          color={recurso.status ? 'success' : 'error'}
                        />
                      </Box>
                    }
                    secondary={
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          {recurso.especialidade && (
                            <Typography variant="body2" color="textSecondary">
                              <strong>Especialidade:</strong> {recurso.especialidade}
                            </Typography>
                          )}
                          {recurso.email && (
                            <Typography variant="body2" color="textSecondary">
                              <strong>Email:</strong> {recurso.email}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          {recurso.telefone && (
                            <Typography variant="body2" color="textSecondary">
                              <strong>Telefone:</strong> {recurso.telefone}
                            </Typography>
                          )}
                          {recurso.observacoes && (
                            <Typography variant="body2" color="textSecondary">
                              <strong>Obs:</strong> {recurso.observacoes}
                            </Typography>
                          )}
                        </Grid>
                      </Grid>
                    }
                  />
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <IconButton
                      onClick={() => onEditRecurso(recurso)}
                      sx={{ color: '#1976d2' }}
                      title="Editar recurso"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => onDeleteRecurso(recurso.id)}
                      sx={{ color: '#f44336' }}
                      title="Excluir recurso"
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

export default RecursosPresentational;