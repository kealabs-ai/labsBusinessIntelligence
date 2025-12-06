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
  Paper
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
  onDeleteTransacao
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
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getTransacaoIcon = (transacao) => {
    const tipo = transacao.transaction_type || transacao.tipo;
    return tipo === 'entrada' ? <TrendingUp sx={{ color: '#4caf50' }} /> : <TrendingDown sx={{ color: '#f44336' }} />;
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
              <AccountBalance sx={{ fontSize: 32, color: 'white' }} />
              <Typography variant="h4" component="h1" sx={{ 
                fontWeight: 600,
                color: 'white'
              }}>
                Caixa e Transações
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
              Nova Transação
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Resumo Financeiro */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <TrendingUp sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
            <Typography variant="h6" color="#4caf50">Entradas</Typography>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {formatCurrency(resumo?.total_entradas || 0)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <TrendingDown sx={{ fontSize: 40, color: '#f44336', mb: 1 }} />
            <Typography variant="h6" color="#f44336">Saídas</Typography>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {formatCurrency(resumo?.total_saidas || 0)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <AccountBalance sx={{ fontSize: 40, color: '#2196f3', mb: 1 }} />
            <Typography variant="h6" color="#2196f3">Saldo</Typography>
            <Typography variant="h4" sx={{ 
              fontWeight: 600,
              color: (resumo?.saldo || 0) >= 0 ? '#4caf50' : '#f44336'
            }}>
              {formatCurrency(resumo?.saldo || 0)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <Receipt sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
            <Typography variant="h6" color="#ff9800">Transações</Typography>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {resumo?.total_transacoes || 0}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Filtro */}
      <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
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

      {/* Lista de Transações */}
      <Card sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
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
                    borderBottom: index < filteredTransacoes.length - 1 ? '1px solid #f0f0f0' : 'none',
                    py: 2,
                    '&:hover': {
                      backgroundColor: '#f8f9fa'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                    {getTransacaoIcon(transacao)}
                  </Box>
                  
                  <ListItemText
                    sx={{ flex: 1 }}
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {transacao.description || transacao.descricao}
                        </Typography>
                        <Chip
                          label={transacao.category || transacao.categoria}
                          size="small"
                          sx={{ backgroundColor: '#e3f2fd', color: '#1976d2' }}
                        />
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
                          <Typography variant="body2" color="textSecondary">
                            <strong>Valor:</strong> {formatCurrency(transacao.amount || transacao.valor)}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            <strong>Data:</strong> {formatDate(transacao.transaction_date || transacao.data_transacao)}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="textSecondary">
                            <strong>Método:</strong> {transacao.payment_method || transacao.metodo_pagamento}
                          </Typography>
                          {transacao.observacoes && (
                            <Typography variant="body2" color="textSecondary">
                              <strong>Obs:</strong> {transacao.observacoes}
                            </Typography>
                          )}
                        </Grid>
                      </Grid>
                    }
                  />
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <IconButton
                      onClick={() => onEditTransacao(transacao)}
                      sx={{ color: '#1976d2' }}
                      title="Editar transação"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => onDeleteTransacao(transacao.id)}
                      sx={{ color: '#f44336' }}
                      title="Excluir transação"
                    >
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