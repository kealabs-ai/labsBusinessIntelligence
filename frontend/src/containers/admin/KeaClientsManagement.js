import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  TextField,
  Alert,
  Snackbar
} from '@mui/material';
import { Add, Edit, Delete, Business } from '@mui/icons-material';
import KeaClientModal from '../../components/presentational/KeaClientModal';
import { keaClientService } from '../../services/keaClientService';

const KeaClientsManagement = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setLoading(true);
    try {
      const data = await keaClientService.getKeaClients();
      setClients(data);
    } catch (error) {
      showNotification('Erro ao carregar clientes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const handleOpenModal = () => {
    setEditingClient(null);
    setModalOpen(true);
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingClient(null);
  };

  const handleSaveClient = async (clientData) => {
    setModalLoading(true);
    try {
      if (editingClient) {
        await keaClientService.updateKeaClient(editingClient.id, clientData);
        showNotification('Cliente atualizado com sucesso!');
      } else {
        await keaClientService.createKeaClient(clientData);
        showNotification('Cliente criado com sucesso!');
      }
      
      handleCloseModal();
      loadClients();
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Erro ao salvar cliente';
      showNotification(errorMessage, 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteClient = async (clientId) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await keaClientService.deleteKeaClient(clientId);
        showNotification('Cliente excluído com sucesso!');
        loadClients();
      } catch (error) {
        const errorMessage = error.response?.data?.detail || 'Erro ao excluir cliente';
        showNotification(errorMessage, 'error');
      }
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.kea_identifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <Business sx={{ fontSize: 32, color: 'white' }} />
              <Typography variant="h4" component="h1" sx={{ 
                fontWeight: 600,
                color: 'white'
              }}>
                Clientes Kealabs
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleOpenModal}
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
            placeholder="Digite o nome, identificador KEA ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
            <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Cliente</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Contato</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Plano</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow 
                      key={client.id}
                      sx={{ 
                        '&:hover': { backgroundColor: '#f8f9fa' },
                        '&:last-child td, &:last-child th': { border: 0 }
                      }}
                    >
                      <TableCell>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {client.name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            ID: {client.kea_identifier}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {client.cpf_cnpj}
                          </Typography>
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Box>
                          <Typography variant="body2">
                            {client.email}
                          </Typography>
                          {client.whatsapp_number && (
                            <Typography variant="body2" color="textSecondary">
                              WhatsApp: {client.whatsapp_number}
                            </Typography>
                          )}
                          {client.site && (
                            <Typography variant="body2" color="textSecondary">
                              {client.site}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Box>
                          {client.payment_plan && (
                            <Chip
                              label={client.payment_plan}
                              size="small"
                              color="primary"
                            />
                          )}
                          <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                            {client.user_quantity} usuário(s)
                          </Typography>
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Chip
                          label={client.status ? 'Ativo' : 'Inativo'}
                          size="small"
                          color={client.status ? 'success' : 'error'}
                        />
                      </TableCell>
                      
                      <TableCell>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                          <IconButton
                            onClick={() => handleEditClient(client)}
                            sx={{ color: '#1976d2' }}
                            title="Editar cliente"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeleteClient(client.id)}
                            sx={{ color: '#f44336' }}
                            title="Excluir cliente"
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <KeaClientModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveClient}
        client={editingClient}
        loading={modalLoading}
      />
      
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default KeaClientsManagement;