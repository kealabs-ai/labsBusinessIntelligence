import React, { useState, useEffect } from 'react';
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
  Business,
  Group
} from '@mui/icons-material';
import { useColorPalette } from '../../utils/useColorPalette';


const RecursosPresentational = ({
  recursos,
  loading,
  onOpenModal,
  onEditRecurso,
  onDeleteRecurso
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const colorPalette = useColorPalette();



  if (!colorPalette) {
    return null;
  }

  const filteredRecursos = recursos.filter(recurso =>
    (recurso.name || recurso.nome || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (recurso.type || recurso.tipo || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRecursoIcon = (tipo) => {
    return tipo === 'profissional' || tipo === 'professional' ? <Person /> : <Business />;
  };

  return (
    <Box sx={{ p: 3, backgroundColor: colorPalette.backgroundColor }}>
      <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', background: `linear-gradient(135deg, ${colorPalette.primaryColor} 0%, ${colorPalette.secondaryColor} 100%)` }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Group sx={{ fontSize: 32, color: colorPalette.textColor }} />
              <Typography variant="h4" component="h1" sx={{ 
                fontWeight: 600,
                color: colorPalette.textColor
              }}>
                Recursos e Profissionais
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={onOpenModal}
              sx={{
                backgroundColor: colorPalette.buttonColor,
                color: colorPalette.buttonTextColor,
                '&:hover': {
                  backgroundColor: colorPalette.buttonHoverColor,
                },
                borderRadius: 2,
                px: 3,
                py: 1
              }}
            >
              Novo Recurso
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.1)', backgroundColor: colorPalette.backgroundCardColor }}>
        <CardContent>
          <TextField
            fullWidth
            label="Buscar recursos"
            placeholder="Digite o nome ou tipo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: colorPalette.primaryColor,
                    },
                    '&:hover fieldset': {
                        borderColor: colorPalette.secondaryColor,
                    },
                },
                '& .MuiInputLabel-root': {
                    color: colorPalette.textColor,
                },
            }}
          />
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.1)', backgroundColor: colorPalette.backgroundCardColor }}>
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography sx={{ color: colorPalette.textColor }}>Carregando recursos...</Typography>
            </Box>
          ) : filteredRecursos.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="textSecondary" sx={{ color: colorPalette.textSecondaryColor }}>
                {searchTerm ? 'Nenhum recurso encontrado' : 'Nenhum recurso cadastrado'}
              </Typography>
            </Box>
          ) : (
            <List>
              {filteredRecursos.map((recurso, index) => (
                <ListItem
                  key={recurso.id}
                  sx={{
                    borderBottom: index < filteredRecursos.length - 1 ? `1px solid ${colorPalette.borderColor}` : 'none',
                    py: 2,
                    '&:hover': {
                      backgroundColor: colorPalette.hoverColor
                    }
                  }}
                >
                  <Avatar sx={{ 
                    bgcolor: (recurso.type || recurso.tipo) === 'professional' || (recurso.type || recurso.tipo) === 'profissional' ? colorPalette.successColor : colorPalette.primaryColor,
                    mr: 2,
                    color: colorPalette.textColor
                  }}>
                    {getRecursoIcon(recurso.type || recurso.tipo)}
                  </Avatar>
                  
                  <ListItemText
                    sx={{ flex: 1 }}
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: colorPalette.textColor }}>
                          {recurso.name || recurso.nome}
                        </Typography>
                        <Chip
                          label={recurso.type || recurso.tipo}
                          size="small"
                          sx={{ backgroundColor: (recurso.type || recurso.tipo) === 'professional' || (recurso.type || recurso.tipo) === 'profissional' ? colorPalette.successColor : colorPalette.primaryColor, color: colorPalette.textColor }}
                        />
                        <Chip
                          label={recurso.status ? 'Ativo' : 'Inativo'}
                          size="small"
                          sx={{ backgroundColor: recurso.status ? colorPalette.successColor : colorPalette.errorColor, color: colorPalette.textColor }}
                        />
                      </Box>
                    }
                    secondary={
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          {(recurso.specialty || recurso.especialidade) && (
                            <Typography variant="body2" sx={{ color: colorPalette.textSecondaryColor }}>
                              <strong>Especialidade:</strong> {recurso.specialty || recurso.especialidade}
                            </Typography>
                          )}
                          {recurso.email && (
                            <Typography variant="body2" sx={{ color: colorPalette.textSecondaryColor }}>
                              <strong>Email:</strong> {recurso.email}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          {(recurso.phone || recurso.telefone) && (
                            <Typography variant="body2" sx={{ color: colorPalette.textSecondaryColor }}>
                              <strong>Telefone:</strong> {recurso.phone || recurso.telefone}
                            </Typography>
                          )}
                          {(recurso.notes || recurso.observacoes) && (
                            <Typography variant="body2" sx={{ color: colorPalette.textSecondaryColor }}>
                              <strong>Obs:</strong> {recurso.notes || recurso.observacoes}
                            </Typography>
                          )}
                        </Grid>
                      </Grid>
                    }
                  />
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <IconButton
                      onClick={() => onEditRecurso(recurso)}
                      sx={{ color: colorPalette.primaryColor }}
                      title="Editar recurso"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => onDeleteRecurso(recurso.id)}
                      sx={{ color: colorPalette.errorColor }}
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