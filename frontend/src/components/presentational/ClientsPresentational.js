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
  ListItemAvatar,
  Avatar,
  IconButton,
  Chip,
  TextField,
  Grid
} from '@mui/material';
import {
  Add,
  Person,
  Edit,
  Block,
  CheckCircle,
  Phone,
  Email
} from '@mui/icons-material';

const ClientsPresentational = ({
  clients,
  loading,
  onOpenModal,
  onEditClient,
  onToggleStatus
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = clients.filter(client =>
    client.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone_whatsapp.includes(searchTerm)
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'Não informado';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatPhone = (phone) => {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  return (
    <Box sx={{ p: 3 }}>
    <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Person sx={{ fontSize: 32, color: 'white' }} />
              <Typography variant="h4" component="h1" sx={{ 
                fontWeight: 600,
                color: 'white'
              }}>
                Gerenciamento de Clientes
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={onOpenModal}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.3)',
                },
                borderRadius: 2,
                px: 3,
                py: 1
              }}
            >
              Novo Cliente
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <CardContent>
          <TextField
            fullWidth
            label="Buscar clientes"
            placeholder="Digite o nome, email ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2 }}
          />
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography>Carregando clientes...</Typography>
            </Box>
          ) : filteredClients.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="textSecondary">
                {searchTerm ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
              </Typography>
            </Box>
          ) : (
            <List>
              {filteredClients.map((client, index) => (
                <ListItem
                  key={client.client_id}
                  sx={{
                    borderBottom: index < filteredClients.length - 1 ? '1px solid #f0f0f0' : 'none',
                    py: 2,
                    '&:hover': {
                      backgroundColor: '#f8f9fa'
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ 
                      bgcolor: client.status ? '#4caf50' : '#f44336',
                      width: 50,
                      height: 50
                    }}>
                      <Person />
                    </Avatar>
                  </ListItemAvatar>
                  
                  <ListItemText
                    sx={{ flex: 1, ml: 2 }}
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {client.full_name}
                        </Typography>
                        <Chip
                          label={client.status ? 'Ativo' : 'Inativo'}
                          color={client.status ? 'success' : 'error'}
                          size="small"
                        />
                      </Box>
                    }
                    secondary={
                      <Grid container spacing={2} sx={{ mt: 0.5 }}>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Email sx={{ fontSize: 16, color: '#666' }} />
                            <Typography variant="body2" color="textSecondary">
                              {client.email}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Phone sx={{ fontSize: 16, color: '#666' }} />
                            <Typography variant="body2" color="textSecondary">
                              {formatPhone(client.phone_whatsapp)}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="textSecondary">
                            <strong>Nascimento:</strong> {formatDate(client.birth_date)}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            <strong>Cadastrado:</strong> {formatDate(client.created_at)}
                          </Typography>
                          {client.note && (
                            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                              <strong>Observação:</strong> {client.note}
                            </Typography>
                          )}
                        </Grid>
                      </Grid>
                    }
                  />
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <IconButton
                      onClick={() => onEditClient(client)}
                      sx={{ color: '#1976d2' }}
                      title="Editar cliente"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => onToggleStatus(client.client_id, !client.status)}
                      sx={{ color: client.status ? '#f44336' : '#4caf50' }}
                      title={client.status ? 'Inativar cliente' : 'Ativar cliente'}
                    >
                      {client.status ? <Block /> : <CheckCircle />}
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

export default ClientsPresentational;