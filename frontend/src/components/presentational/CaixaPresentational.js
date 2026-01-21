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
  IconButton,
  Chip,
  TextField,
  Grid,
  Paper,
  CircularProgress
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  TrendingUp,
  TrendingDown,
  AccountBalance,
  Receipt
} from '@mui/icons-material';

const CaixaPresentational = ({
  transacoes,
  resumo,
  loading,
  onOpenModal,
  onEditTransacao,
  onDeleteTransacao,
  palette
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransacoes = transacoes.filter(transacao => {
    const descricao = transacao.description || transacao.descricao || '';
    const categoria = transacao.category || transacao.categoria || '';
    return descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
           categoria.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Data não informada';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getTransacaoIcon = (transacao) => {
    const tipo = transacao.transaction_type || transacao.tipo;
    return tipo === 'entrada' ? <TrendingUp sx={{ color: palette.success }} /> : <TrendingDown sx={{ color: palette.error }} />;
  };

  return (
    <Box sx={{ p: 3, backgroundColor: palette.background, minHeight: '100%' }}>
      <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', background: palette.gradient }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <AccountBalance sx={{ fontSize: 32, color: 'white' }} />
              <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: 'white' }}>
                Caixa e Transações
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={onOpenModal}
            >
              Nova Transação
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {[
          { icon: <TrendingUp sx={{ fontSize: 40, color: palette.success, mb: 1 }} />, title: 'Entradas', value: resumo?.total_entradas, color: palette.success },
          { icon: <TrendingDown sx={{ fontSize: 40, color: palette.error, mb: 1 }} />, title: 'Saídas', value: resumo?.total_saidas, color: palette.error },
          { icon: <AccountBalance sx={{ fontSize: 40, color: palette.primary, mb: 1 }} />, title: 'Saldo', value: resumo?.saldo, color: (resumo?.saldo || 0) >= 0 ? palette.success : palette.error },
          { icon: <Receipt sx={{ fontSize: 40, color: palette.warning, mb: 1 }} />, title: 'Transações', value: resumo?.total_transacoes, color: palette.textPrimary, isCurrency: false }
        ].map(item => (
          <Grid item xs={12} sm={6} md={3} key={item.title}>
            <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.1)', bgcolor: palette.surface, height: '100%' }}>
              {item.icon}
              <Typography variant="h6" sx={{ color: item.color }}>{item.title}</Typography>
              <Typography variant="h4" sx={{ fontWeight: 600, color: item.color }}>
                {item.isCurrency === false ? item.value || 0 : formatCurrency(item.value || 0)}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.1)', bgcolor: palette.surface }}>
        <CardContent>
          <TextField
            fullWidth
            label="Buscar transações"
            placeholder="Digite a descrição ou categoria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.1)', bgcolor: palette.surface }}>
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box sx={{ p: 3, textAlign: 'center', color: palette.textPrimary }}>
              <CircularProgress />
              <Typography>Carregando transações...</Typography>
            </Box>
          ) : filteredTransacoes.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="textSecondary">
                {searchTerm ? 'Nenhuma transação encontrada' : 'Nenhuma transação cadastrada'}
              </Typography>
            </Box>
          ) : (
            <List>
              {filteredTransacoes.map((transacao, index) => (
                <ListItem
                  key={transacao.id}
                  sx={{
                    borderBottom: `1px solid ${palette.background}`,
                    py: 2,
                    '&:hover': { backgroundColor: palette.background }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                    {getTransacaoIcon(transacao)}
                  </Box>
                  
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: palette.textPrimary }}>
                          {transacao.description || transacao.descricao}
                        </Typography>
                        <Chip label={transacao.category || transacao.categoria} size="small" />
                        <Chip
                          label={transacao.transaction_type || transacao.tipo}
                          size="small"
                          color={(transacao.transaction_type || transacao.tipo) === 'entrada' ? 'success' : 'error'}
                        />
                      </Box>
                    }
                    secondary={
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="textSecondary"><strong>Valor:</strong> {formatCurrency(transacao.amount || transacao.valor)}</Typography>
                          <Typography variant="body2" color="textSecondary"><strong>Data:</strong> {formatDate(transacao.transaction_date || transacao.data_transacao)}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="textSecondary"><strong>Método:</strong> {transacao.payment_method || transacao.metodo_pagamento}</Typography>
                          {transacao.observacoes && <Typography variant="body2" color="textSecondary"><strong>Obs:</strong> {transacao.observacoes}</Typography>}
                        </Grid>
                      </Grid>
                    }
                  />
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton onClick={() => onEditTransacao(transacao)} sx={{ color: palette.primary }} title="Editar transação">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => onDeleteTransacao(transacao.id)} sx={{ color: palette.error }} title="Excluir transação">
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

export default CaixaPresentational;