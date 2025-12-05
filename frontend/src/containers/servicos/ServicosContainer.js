import React, { useState, useEffect } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import ServicosPresentational from '../../components/presentational/ServicosPresentational';
import ServicoModal from '../../components/presentational/ServicoModal';
import { serviceService } from '../../services/serviceService';

const ServicosContainer = () => {
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingServico, setEditingServico] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadServicos();
  }, []);

  const loadServicos = async () => {
    try {
      setLoading(true);
      const data = await serviceService.getServices();
      setServicos(data);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
      showSnackbar('Erro ao carregar serviços', 'error');
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
    setEditingServico(null);
    setModalOpen(true);
  };

  const handleEditServico = (servico) => {
    setEditingServico(servico);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingServico(null);
  };

  const handleSaveServico = async (servicoData) => {
    try {
      setLoading(true);
      
      if (editingServico) {
        await serviceService.updateService(editingServico.service_id, servicoData);
        showSnackbar('Serviço atualizado com sucesso!');
      } else {
        await serviceService.createService(servicoData);
        showSnackbar('Serviço criado com sucesso!');
      }
      
      await loadServicos();
    } catch (error) {
      console.error('Erro ao salvar serviço:', error);
      const message = editingServico ? 'Erro ao atualizar serviço' : 'Erro ao criar serviço';
      showSnackbar(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteServico = async (servicoId) => {
    if (window.confirm('Tem certeza que deseja inativar este serviço?')) {
      try {
        setLoading(true);
        await serviceService.updateServiceStatus(servicoId, false);
        showSnackbar('Serviço inativado com sucesso!');
        await loadServicos();
      } catch (error) {
        console.error('Erro ao inativar serviço:', error);
        showSnackbar('Erro ao inativar serviço', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box>
      <ServicosPresentational
        servicos={servicos}
        loading={loading}
        onOpenModal={handleOpenModal}
        onEditServico={handleEditServico}
        onDeleteServico={handleDeleteServico}
      />
      
      <ServicoModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveServico}
        editingServico={editingServico}
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

export default ServicosContainer;