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

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [keaClients, setKeaClients] = useState([]);
  const [units, setUnits] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
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
      
      // Validate required fields
      if (!formData.username || !formData.email) {
        showAlert('Usuário e email são obrigatórios', 'error');
        return;
      }
      
      if (!editingUser && !formData.password) {
        showAlert('Senha é obrigatória para novos usuários', 'error');
        return;
      }
      
      let response;
      if (editingUser) {
        response = await adminService.updateUser(editingUser.id, formData);
        showAlert(response.message || 'Usuário atualizado com sucesso', 'success');
      } else {
        response = await adminService.createUser(formData);
        showAlert(response.message || 'Usuário criado com sucesso', 'success');
      }
      
      setModalOpen(false);
      setEditingUser(null);
      setFormData({ username: '', email: '', password: '', role: '4', kea_client_id: '', unit_id: null });
      loadUsers();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Erro ao salvar usuário';
      showAlert(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      role: user.role,
      kea_client_id: user.kea_client_id || '',
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
            label="Usuário"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Senha"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            margin="normal"
            helperText={editingUser ? "Deixe em branco para manter a senha atual" : ""}
          />
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
              onChange={(e) => setFormData({ ...formData, kea_client_id: e.target.value })}
            >
              <MenuItem value="">
                <em>Nenhum cliente</em>
              </MenuItem>
              {keaClients.map((client) => (
                <MenuItem key={client.id} value={client.id}>
                  {client.name} ({client.kea_identifier})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
      >
        <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserManagement;