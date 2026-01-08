import React, { useState, useEffect } from 'react';
import { Alert, Snackbar, Box } from '@mui/material';
import UnitsPresentational from '../../components/presentational/UnitsPresentational';
import UnitModal from '../../components/presentational/UnitModal';
import Footer from '../../components/presentational/Footer';
import { unitService } from '../../services/unitService';

const UnitsContainer = () => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    loadUnits();
  }, []);

  const loadUnits = async () => {
    setLoading(true);
    try {
      const data = await unitService.getUnits();
      setUnits(data);
    } catch (error) {
      showNotification('Erro ao carregar unidades', 'error');
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
    setEditingUnit(null);
    setModalOpen(true);
  };

  const handleEditUnit = (unit) => {
    setEditingUnit(unit);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingUnit(null);
  };

  const handleSaveUnit = async (unitData) => {
    setModalLoading(true);
    try {
      if (editingUnit) {
        await unitService.updateUnit(editingUnit.id, unitData);
        showNotification('Unidade atualizada com sucesso!');
      } else {
        await unitService.createUnit(unitData);
        showNotification('Unidade criada com sucesso!');
      }
      
      handleCloseModal();
      loadUnits();
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Erro ao salvar unidade';
      showNotification(errorMessage, 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteUnit = async (unitId) => {
    if (window.confirm('Tem certeza que deseja excluir esta unidade?')) {
      try {
        await unitService.deleteUnit(unitId);
        showNotification('Unidade excluída com sucesso!');
        loadUnits();
      } catch (error) {
        const errorMessage = error.response?.data?.detail || 'Erro ao excluir unidade';
        showNotification(errorMessage, 'error');
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box sx={{ flexGrow: 1 }}>
        <UnitsPresentational
          units={units}
          loading={loading}
          onOpenModal={handleOpenModal}
          onEditUnit={handleEditUnit}
          onDeleteUnit={handleDeleteUnit}
        />
      </Box>
      
      <Footer />
      
      <UnitModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveUnit}
        unit={editingUnit}
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

export default UnitsContainer;