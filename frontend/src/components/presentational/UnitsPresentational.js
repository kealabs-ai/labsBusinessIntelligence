import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Grid,
  IconButton,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Business,
  Schedule,
  Phone,
  Email,
  LocationOn,
  Notifications,
  NotificationsOff
} from '@mui/icons-material';

const UnitsPresentational = ({
  units,
  loading,
  onOpenModal,
  onEditUnit,
  onDeleteUnit
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUnits = units.filter(unit =>
    unit.unit_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (unit.address && unit.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2
      }}>
        <Typography variant="h4" component="h1" sx={{ 
          fontWeight: 600,
          color: '#333'
        }}>
          Cadastro de Unidades
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={onOpenModal}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
            },
            borderRadius: 2,
            px: 3,
            py: 1
          }}
        >
          Nova Unidade
        </Button>
      </Box>

      <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <CardContent>
          <TextField
            fullWidth
            label="Buscar unidades"
            placeholder="Digite o nome ou endereço..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography>Carregando unidades...</Typography>
            </Box>
          ) : filteredUnits.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="textSecondary">
                {searchTerm ? 'Nenhuma unidade encontrada' : 'Nenhuma unidade cadastrada'}
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Unidade</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Contato</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Horário</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Configurações</TableCell>
                    <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUnits.map((unit) => (
                    <TableRow 
                      key={unit.id}
                      sx={{ 
                        '&:hover': { backgroundColor: '#f8f9fa' },
                        '&:last-child td, &:last-child th': { border: 0 }
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: '#2196f3' }}>
                            <Business />
                          </Avatar>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {unit.unit_name}
                            </Typography>
                            {unit.address && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="body2" color="textSecondary">
                                  {unit.address}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Box>
                          {unit.phone && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                              <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="body2">
                                {unit.phone}
                              </Typography>
                            </Box>
                          )}
                          {unit.email && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="body2">
                                {unit.email}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                          <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            {unit.opening_time?.substring(0, 5)} - {unit.closing_time?.substring(0, 5)}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="textSecondary">
                          Intervalo: {unit.appointment_interval}min
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Chip
                            icon={unit.notifications_enabled ? <Notifications /> : <NotificationsOff />}
                            label={unit.notifications_enabled ? 'Notificações Ativas' : 'Notificações Inativas'}
                            size="small"
                            color={unit.notifications_enabled ? 'success' : 'default'}
                          />
                          {unit.notifications_enabled && (
                            <Typography variant="caption" color="textSecondary">
                              {unit.notification_advance_hours}h de antecedência
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                          <IconButton
                            onClick={() => onEditUnit(unit)}
                            sx={{ color: '#1976d2' }}
                            title="Editar unidade"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            onClick={() => onDeleteUnit(unit.id)}
                            sx={{ color: '#f44336' }}
                            title="Excluir unidade"
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default UnitsPresentational;