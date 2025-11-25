import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Select, MenuItem,
  FormControl, InputLabel, Checkbox, FormControlLabel, Button
} from '@mui/material';
import { adminService } from '../../services/adminService';

const PermissionManagement = () => {
  const [users, setUsers] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [permissions, setPermissions] = useState({});

  useEffect(() => {
    loadUsers();
    loadModules();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await adminService.getUsers(1, 100);
      setUsers(response.users.filter(user => user.is_active));
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    }
  };

  const loadModules = async () => {
    try {
      const response = await adminService.getModules();
      setModules(response.data);
    } catch (error) {
      console.error('Erro ao carregar módulos:', error);
    }
  };

  const loadUserPermissions = async (userId) => {
    try {
      const response = await adminService.getUserPermissions(userId);
      const permsObj = {};
      response.data.forEach(perm => {
        permsObj[perm.id] = {
          can_view: perm.can_view,
          can_create: perm.can_create,
          can_edit: perm.can_edit,
          can_delete: perm.can_delete
        };
      });
      setPermissions(permsObj);
    } catch (error) {
      console.error('Erro ao carregar permissões:', error);
    }
  };

  const handleUserChange = (userId) => {
    setSelectedUser(userId);
    if (userId) {
      loadUserPermissions(userId);
    } else {
      setPermissions({});
    }
  };

  const handlePermissionChange = (moduleId, permission, value) => {
    setPermissions(prev => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [permission]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      await adminService.updateUserPermissions(selectedUser, permissions);
      alert('Permissões atualizadas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar permissões:', error);
      alert('Erro ao salvar permissões');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Gestão de Permissões</Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <FormControl fullWidth>
            <InputLabel>Selecionar Usuário</InputLabel>
            <Select
              value={selectedUser}
              onChange={(e) => handleUserChange(e.target.value)}
            >
              <MenuItem value="">Selecione um usuário</MenuItem>
              {users.map(user => (
                <MenuItem key={user.id} value={user.id}>
                  {user.username} ({user.email})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      {selectedUser && (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Permissões por Módulo</Typography>
              <Button 
                variant="contained" 
                onClick={handleSave}
                sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
              >
                Salvar Permissões
              </Button>
            </Box>
            
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Módulo</TableCell>
                    <TableCell>Descrição</TableCell>
                    <TableCell align="center">Visualizar</TableCell>
                    <TableCell align="center">Criar</TableCell>
                    <TableCell align="center">Editar</TableCell>
                    <TableCell align="center">Excluir</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {modules.map((module) => (
                    <TableRow key={module.id}>
                      <TableCell>{module.name}</TableCell>
                      <TableCell>{module.description}</TableCell>
                      <TableCell align="center">
                        <Checkbox
                          checked={permissions[module.id]?.can_view || false}
                          onChange={(e) => handlePermissionChange(module.id, 'can_view', e.target.checked)}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Checkbox
                          checked={permissions[module.id]?.can_create || false}
                          onChange={(e) => handlePermissionChange(module.id, 'can_create', e.target.checked)}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Checkbox
                          checked={permissions[module.id]?.can_edit || false}
                          onChange={(e) => handlePermissionChange(module.id, 'can_edit', e.target.checked)}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Checkbox
                          checked={permissions[module.id]?.can_delete || false}
                          onChange={(e) => handlePermissionChange(module.id, 'can_delete', e.target.checked)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default PermissionManagement;