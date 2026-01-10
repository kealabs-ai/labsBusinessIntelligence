import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Select,
  MenuItem, FormControl, InputLabel, Chip, IconButton, Pagination,
  Alert, Snackbar
} from '@mui/material';
import { Add, Edit, Delete, People } from '@mui/icons-material';
import { adminService } from '../../services/adminService';
import { roleService } from '../../services/roleService';
import { keaClientService } from '../../services/keaClientService';
import { formatPhoneBR } from '../../utils/phoneUtils';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [keaClients, setKeaClients] = useState([]);
  const [units, setUnits] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    role: '4',
    kea_client_id: '',
    unit_id: null
  });
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
    loadRoles();
    loadKeaClients();
    loadUnits();
  }, [pagination.page]);

  const showAlert = (message, severity = 'success') => {
    setAlert({ open: true, message, severity });
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  const loadRoles = async () => {
    try {
      const data = await roleService.getRoles();
      setRoles(data);
    } catch (error) {
      console.error('Erro ao carregar roles:', error);
    }
  };

  const loadKeaClients = async () => {
    try {
      const data = await keaClientService.getKeaClients();
      setKeaClients(data);
    } catch (error) {
      console.error('Erro ao carregar clientes KEA:', error);
    }
  };

  const loadUnits = async () => {
    try {
      const response = await adminService.getUnits();
      setUnits(response.data);
    } catch (error) {
      console.error('Erro ao carregar unidades:', error);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getUsers(pagination.page, 10);
      setUsers(response.users);
      setPagination({
        page: response.page,
        pages: response.pages,
        total: response.total
      });
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      showAlert('Erro ao carregar usuários', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      console.log('=== INÍCIO CRIAÇÃO/EDIÇÃO USUÁRIO ===');
      console.log('Editing User:', editingUser);
      console.log('Form Data Original:', formData);
      
      // Validate required fields
      if (!formData.name || !formData.username || !formData.email) {
        console.log('❌ Validação falhou - campos obrigatórios');
        showAlert('Nome, usuário e email são obrigatórios', 'error');
        return;
      }
      
      if (!editingUser && !formData.password) {
        console.log('❌ Validação falhou - senha obrigatória');
        showAlert('Senha é obrigatória para novos usuários', 'error');
        return;
      }
      
      if (!editingUser && formData.password !== formData.confirmPassword) {
        console.log('❌ Validação falhou - senhas não coincidem');
        showAlert('As senhas não coincidem', 'error');
        return;
      }
      
      // Preparar dados para envio
      const dataToSend = { ...formData };
      delete dataToSend.confirmPassword; // Remove confirmPassword antes do envio
      
      // Converter unit_id null para 0
      if (dataToSend.unit_id === null || dataToSend.unit_id === '') {
        dataToSend.unit_id = 0;
      }
      
      // Garantir que kea_client_id seja string
      if (dataToSend.kea_client_id !== null && dataToSend.kea_client_id !== undefined && dataToSend.kea_client_id !== '') {
        dataToSend.kea_client_id = String(dataToSend.kea_client_id);
      } else {
        dataToSend.kea_client_id = '';
      }
      
      console.log('✅ Validações passaram');
      console.log('Dados para envio:', dataToSend);
      
      let response;
      if (editingUser) {
        console.log('🔄 Atualizando usuário ID:', editingUser.id);
        response = await adminService.updateUser(editingUser.id, dataToSend);
        console.log('✅ Usuário atualizado:', response);
        showAlert(response.message || 'Usuário atualizado com sucesso', 'success');
      } else {
        console.log('🆕 Criando novo usuário');
        response = await adminService.createUser(dataToSend);
        console.log('✅ Usuário criado:', response);
        showAlert(response.message || 'Usuário criado com sucesso', 'success');
      }
      
      setModalOpen(false);
      setEditingUser(null);
      setFormData({ name: '', username: '', email: '', phone: '', mobile: '', password: '', confirmPassword: '', role: '4', kea_client_id: '', unit_id: null });
      loadUsers();
      
      console.log('=== FIM CRIAÇÃO/EDIÇÃO USUÁRIO ===');
    } catch (error) {
      console.log('=== ERRO NA CRIAÇÃO/EDIÇÃO USUÁRIO ===');
      console.error('Erro completo:', error);
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      console.error('Headers:', error.response?.headers);
      console.error('Config:', error.config);
      
      let errorMessage = 'Erro ao salvar usuário';
      
      if (error.response?.status === 422) {
        console.log('🚨 Erro 422 - Dados inválidos');
        if (error.response?.data?.detail) {
          if (Array.isArray(error.response.data.detail)) {
            errorMessage = error.response.data.detail.map(err => `${err.loc?.join('.')}: ${err.msg}`).join(', ');
          } else {
            errorMessage = error.response.data.detail;
          }
        }
      } else {
        errorMessage = error.response?.data?.detail || error.message || errorMessage;
      }
      
      console.log('Mensagem de erro final:', errorMessage);
      showAlert(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      username: user.username,
      email: user.email,
      phone: user.phone || '',
      mobile: user.mobile || '',
      password: '',
      confirmPassword: '',
      role: user.role_id || '4',
      kea_client_id: user.kea_client_id ? String(user.kea_client_id) : '',
      unit_id: user.unit_id || null
    });
    setModalOpen(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Deseja desativar este usuário?')) {
      try {
        setLoading(true);
        const response = await adminService.deleteUser(userId);
        showAlert(response.message || 'Usuário desativado com sucesso', 'success');
        loadUsers();
      } catch (error) {
        console.error('Erro ao desativar usuário:', error);
        const errorMessage = error.response?.data?.detail || error.message || 'Erro ao desativar usuário';
        showAlert(errorMessage, 'error');
      } finally {
        setLoading(false);
      }
    }
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
              <People sx={{ fontSize: 32, color: 'white' }} />
              <Typography variant="h4" component="h1" sx={{ 
                fontWeight: 600,
                color: 'white'
              }}>
                Gestão de Usuários
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setModalOpen(true)}
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
              Novo Usuário
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nome</TableCell>
                  <TableCell>Usuário</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip 
                        label={user.role} 
                        color={user.role === 'admin' ? 'primary' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={user.is_active ? 'Ativo' : 'Inativo'} 
                        color={user.is_active ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(user)} size="small">
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(user.id)} size="small">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Pagination
              count={pagination.pages}
              page={pagination.page}
              onChange={(e, page) => setPagination(prev => ({ ...prev, page }))}
            />
          </Box>
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nome do Usuário (apelido)"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="E-mail"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Telefone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: formatPhoneBR(e.target.value) })}
            margin="normal"
            placeholder="+55(19)99999-9999"
          />
          <TextField
            fullWidth
            label="Celular"
            value={formData.mobile}
            onChange={(e) => setFormData({ ...formData, mobile: formatPhoneBR(e.target.value) })}
            margin="normal"
            placeholder="+55(19)99999-9999"
          />
          <TextField
            fullWidth
            label="Usuário"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Senha"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            margin="normal"
            helperText={editingUser ? "Deixe em branco para manter a senha atual" : ""}
            required={!editingUser}
          />
          {!editingUser && (
            <TextField
              fullWidth
              label="Confirme sua senha"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              margin="normal"
              required
            />
          )}
          <FormControl fullWidth margin="normal">
            <InputLabel>Perfil</InputLabel>
            <Select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              {roles.map((role) => (
                <MenuItem key={role.value} value={role.value}>
                  {role.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Cliente</InputLabel>
            <Select
              value={formData.kea_client_id}
              onChange={(e) => setFormData({ ...formData, kea_client_id: String(e.target.value) })}
            >
              <MenuItem value="">
                <em>Nenhum cliente</em>
              </MenuItem>
              {keaClients.map((client) => (
                <MenuItem key={client.id} value={String(client.kea_identifier)}>
                  {client.name} ({client.kea_identifier})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {formData.kea_client_id && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Unidade</InputLabel>
              <Select
                value={formData.unit_id || ''}
                onChange={(e) => setFormData({ ...formData, unit_id: e.target.value || null })}
              >
                <MenuItem value="">
                  <em>Nenhuma unidade</em>
                </MenuItem>
                {units.map((unit) => (
                  <MenuItem key={unit.id} value={unit.id}>
                    {unit.unit_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)} disabled={loading}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ zIndex: 9999 }}
      >
        <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserManagement;