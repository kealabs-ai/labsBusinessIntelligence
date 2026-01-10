import React, { useState, useEffect } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import CaixaPresentational from '../../components/presentational/CaixaPresentational';
import TransacaoModal from '../../components/presentational/TransacaoModal';
import Footer from '../../components/presentational/Footer';
import { transacaoService } from '../../services/transacaoService';

const CaixaContainer = () => {
  const [transacoes, setTransacoes] = useState([]);
  const [resumo, setResumo] = useState({});
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTransacao, setEditingTransacao] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadTransacoes();
    loadResumo();
  }, []);

  const loadTransacoes = async () => {
    try {
      setLoading(true);
      const data = await transacaoService.getTransacoes(1, 50);
      setTransacoes(data.items || []);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
      showSnackbar('Erro ao carregar transações', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadResumo = async () => {
    try {
      const data = await transacaoService.getResumoFinanceiro();
      setResumo(data);
    } catch (error) {
      console.error('Erro ao carregar resumo:', error);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenModal = () => {
    setEditingTransacao(null);
    setModalOpen(true);
  };

  const handleEditTransacao = (transacao) => {
    setEditingTransacao(transacao);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingTransacao(null);
  };

  const handleSaveTransacao = async (transacaoData) => {
    try {
      setLoading(true);
      
      if (editingTransacao) {
        await transacaoService.updateTransacao(editingTransacao.id, transacaoData);
        showSnackbar('Transação atualizada com sucesso!');
      } else {
        await transacaoService.createTransacao(transacaoData);
        showSnackbar('Transação criada com sucesso!');
      }
      
      await loadTransacoes();
      await loadResumo();
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
      const message = editingTransacao ? 'Erro ao atualizar transação' : 'Erro ao criar transação';
      showSnackbar(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransacao = async (transacaoId) => {
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      try {
        setLoading(true);
        await transacaoService.deleteTransacao(transacaoId);
        showSnackbar('Transação excluída com sucesso!');
        await loadTransacoes();
        await loadResumo();
      } catch (error) {
        console.error('Erro ao excluir transação:', error);
        showSnackbar('Erro ao excluir transação', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box sx={{ flexGrow: 1 }}>
        <CaixaPresentational
          transacoes={transacoes}
          resumo={resumo}
          loading={loading}
          onOpenModal={handleOpenModal}
          onEditTransacao={handleEditTransacao}
          onDeleteTransacao={handleDeleteTransacao}
        />
      </Box>
      
      <TransacaoModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTransacao}
        editingTransacao={editingTransacao}
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

export default CaixaContainer;