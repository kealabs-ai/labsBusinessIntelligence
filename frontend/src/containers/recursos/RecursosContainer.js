import React, { useState, useEffect } from 'react';
import { Box, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import RecursosPresentational from '../../components/presentational/RecursosPresentational';
import RecursoModal from '../../components/presentational/RecursoModal';
import Footer from '../../components/presentational/Footer';
import { getAllResources, createResource, updateResource, deleteResource } from '../../services/resourceService';

const RecursosContainer = () => {
  const [recursos, setRecursos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecurso, setEditingRecurso] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, resourceId: null });

  useEffect(() => {
    loadRecursos();
  }, []);

  const loadRecursos = async () => {
    try {
      setLoading(true);
      const data = await getAllResources();
      setRecursos(data);
    } catch (error) {
      showSnackbar('Erro ao carregar recursos', 'error');
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

  const handleSaveRecurso = async (recursoData) => {
    try {
      setLoading(true);
      
      // Get user data from session/localStorage
      const userKeaClientId = localStorage.getItem('kea_client_id') || '';
      const userRoleId = localStorage.getItem('role_id') || '1';
      
      console.log('Original recursoData:', recursoData);
      console.log('User kea_client_id from session:', userKeaClientId);
      console.log('User role_id from session:', userRoleId);
      
      // Map Portuguese field names to English
      const mappedData = {
        name: recursoData.nome,
        type: recursoData.tipo,
        specialty: recursoData.especialidade || '',
        email: recursoData.email || '',
        phone: recursoData.telefone || '',
        notes: recursoData.observacoes || '',
        unit_id: recursoData.kea_client_id || '',
        kea_client_id: userKeaClientId,
        role_id: parseInt(userRoleId)
      };
      
      console.log('Mapped data to send:', mappedData);
      
      if (editingRecurso) {
        await updateResource(editingRecurso.id, mappedData);
        showSnackbar('Recurso atualizado com sucesso!');
      } else {
        await createResource(mappedData);
        showSnackbar('Recurso criado com sucesso!');
      }
      handleCloseModal();
      loadRecursos();
    } catch (error) {
      showSnackbar('Erro ao salvar recurso', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecurso = (recursoId) => {
    setConfirmDialog({ open: true, resourceId: recursoId });
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      await deleteResource(confirmDialog.resourceId);
      showSnackbar('Recurso excluído com sucesso!');
      loadRecursos();
    } catch (error) {
      showSnackbar('Erro ao excluir recurso', 'error');
    } finally {
      setLoading(false);
      setConfirmDialog({ open: false, resourceId: null });
    }
  };

  const handleCancelDelete = () => {
    setConfirmDialog({ open: false, resourceId: null });
  };



  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box sx={{ flexGrow: 1 }}>
        <RecursosPresentational
          recursos={recursos}
          loading={loading}
          onOpenModal={handleOpenModal}
          onEditRecurso={handleEditRecurso}
          onDeleteRecurso={handleDeleteRecurso}
        />
      </Box>
      
      <Footer />
      
      <RecursoModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveRecurso}
        editingRecurso={editingRecurso}
      />
      
      <Dialog
        open={confirmDialog.open}
        onClose={handleCancelDelete}
      >
        <DialogTitle>
          Confirmar Exclusão
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir este recurso? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

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