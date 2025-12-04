import React, { useState, useEffect } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import ServicosPresentational from '../../components/presentational/ServicosPresentational';
import ServicoModal from '../../components/presentational/ServicoModal';

const ServicosContainer = () => {
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingServico, setEditingServico] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    setServicos([
      {
        id: 1,
        nome: 'Consulta Médica',
        categoria: 'Consulta',
        descricao: 'Consulta médica geral',
        preco: 150.00,
        duracao: 30,
        status: true
      }
    ]);
  }, []);

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

  const handleSaveServico = (servicoData) => {
    if (editingServico) {
      setServicos(prev => prev.map(s => 
        s.id === editingServico.id ? { ...servicoData, id: editingServico.id } : s
      ));
      showSnackbar('Serviço atualizado com sucesso!');
    } else {
      const newServico = { ...servicoData, id: Date.now() };
      setServicos(prev => [...prev, newServico]);
      showSnackbar('Serviço criado com sucesso!');
    }
  };

  const handleDeleteServico = (servicoId) => {
    if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
      setServicos(prev => prev.filter(s => s.id !== servicoId));
      showSnackbar('Serviço excluído com sucesso!');
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