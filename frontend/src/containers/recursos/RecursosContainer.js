import React, { useState, useEffect } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import RecursosPresentational from '../../components/presentational/RecursosPresentational';
import RecursoModal from '../../components/presentational/RecursoModal';

const RecursosContainer = () => {
  const [recursos, setRecursos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecurso, setEditingRecurso] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    setRecursos([
      {
        id: 1,
        nome: 'Dr. João Silva',
        tipo: 'profissional',
        especialidade: 'Cardiologia',
        email: 'joao@exemplo.com',
        telefone: '(11) 99999-9999',
        observacoes: 'Especialista em cardiologia',
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
    setEditingRecurso(null);
    setModalOpen(true);
  };

  const handleEditRecurso = (recurso) => {
    setEditingRecurso(recurso);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingRecurso(null);
  };

  const handleSaveRecurso = (recursoData) => {
    if (editingRecurso) {
      setRecursos(prev => prev.map(r => 
        r.id === editingRecurso.id ? { ...recursoData, id: editingRecurso.id } : r
      ));
      showSnackbar('Recurso atualizado com sucesso!');
    } else {
      const newRecurso = { ...recursoData, id: Date.now() };
      setRecursos(prev => [...prev, newRecurso]);
      showSnackbar('Recurso criado com sucesso!');
    }
  };

  const handleDeleteRecurso = (recursoId) => {
    if (window.confirm('Tem certeza que deseja excluir este recurso?')) {
      setRecursos(prev => prev.filter(r => r.id !== recursoId));
      showSnackbar('Recurso excluído com sucesso!');
    }
  };

  return (
    <Box>
      <RecursosPresentational
        recursos={recursos}
        loading={loading}
        onOpenModal={handleOpenModal}
        onEditRecurso={handleEditRecurso}
        onDeleteRecurso={handleDeleteRecurso}
      />
      
      <RecursoModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveRecurso}
        editingRecurso={editingRecurso}
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

export default RecursosContainer;