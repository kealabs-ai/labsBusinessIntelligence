import React, { useState, useEffect } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import ClientsPresentational from '../../components/presentational/ClientsPresentational';
import ClientModal from '../../components/presentational/ClientModal';
import Footer from '../../components/presentational/Footer';
import { clientService } from '../../services/clientService';

const ClientsContainer = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await clientService.getClients();
      setClients(data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      showSnackbar('Erro ao carregar clientes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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
    try {
      setLoading(true);
      
      if (editingClient) {
        await clientService.updateClient(editingClient.client_id, clientData);
        showSnackbar('Cliente atualizado com sucesso!');
      } else {
        await clientService.createClient(clientData);
        showSnackbar('Cliente criado com sucesso!');
      }
      
      await loadClients();
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      
      // Check for duplicate phone error
      if (error.response?.status === 400 && error.response?.data?.detail?.includes('telefone')) {
        showSnackbar('Já existe um cliente cadastrado com este número de telefone', 'error');
      } else {
        const message = editingClient ? 'Erro ao atualizar cliente' : 'Erro ao criar cliente';
        showSnackbar(message, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (clientId, newStatus) => {
    try {
      setLoading(true);
      await clientService.updateClientStatus(clientId, newStatus);
      showSnackbar(`Cliente ${newStatus ? 'ativado' : 'inativado'} com sucesso!`);
      await loadClients();
    } catch (error) {
      console.error('Erro ao alterar status do cliente:', error);
      showSnackbar('Erro ao alterar status do cliente', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box sx={{ flexGrow: 1 }}>
        <ClientsPresentational
          clients={clients}
          loading={loading}
          onOpenModal={handleOpenModal}
          onEditClient={handleEditClient}
          onToggleStatus={handleToggleStatus}
        />
      </Box>
      
      <Footer />
      
      <ClientModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveClient}
        editingClient={editingClient}
      />
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ClientsContainer;