import React, { useState, useEffect } from 'react';
import { useAuth } from '../../services/AuthContext';
import { useTheme } from '../../services/ThemeContext';
import { 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  IconButton,
  Typography,
  CssBaseline,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Alert
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { 
  Menu as MenuIcon, 
  CalendarToday, 
  People, 
  WhatsApp, 
  AccountBalance, 
  Build,
  Group,
  Settings
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import UnitsContainer from '../units/UnitsContainer';
import AgendaPresentational from '../../components/presentational/AgendaPresentational';
import AgendaModal from '../../components/presentational/AgendaModal';
import ClientsContainer from '../clients/ClientsContainer';
import CaixaContainer from '../caixa/CaixaContainer';
import ServicosContainer from '../servicos/ServicosContainer';
import RecursosContainer from '../recursos/RecursosContainer';
import ConfiguracoesPresentational from '../../components/presentational/ConfiguracoesPresentational';
import ToolbarContainer from '../toolbar/ToolbarContainer';
import Footer from '../../components/presentational/Footer';
import { agendaService } from '../../services/agendaService';

const AgendaContainer = () => {
  const { palette } = useTheme();
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorDialogMsg, setErrorDialogMsg] = useState('');
  const [successAlertOpen, setSuccessAlertOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmDialogMsg, setConfirmDialogMsg] = useState('');
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const [currentView, setCurrentView] = useState('agendamentos');
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [allEvents, setAllEvents] = useState([]);
  const [lastMessageId, setLastMessageId] = useState(null);
  const [pollingActive, setPollingActive] = useState(false);
  const [chatPollingInterval, setChatPollingInterval] = useState(null);
  const [units, setUnits] = useState([]);
  const [userUnit, setUserUnit] = useState(null);

  useEffect(() => {
    loadAgendamentos();
    loadAllEvents();
    loadContacts();
    loadUserUnit();
  }, []);
  
  useEffect(() => {
    return () => {
      setPollingActive(false);
      if (chatPollingInterval) {
        clearInterval(chatPollingInterval);
      }
    };
  }, []);
  
  useEffect(() => {
    // Restart auto-update when selectedContact changes
    if (selectedContact && pollingActive) {
      startChatAutoUpdate(selectedContact);
    }
  }, [selectedContact, pollingActive]);

  const loadAgendamentos = async (page = 1) => {
    try {
      setLoading(true);
      setEvents([]); // Limpa eventos antes de carregar novos
      const response = await agendaService.getAgendamentos(page, 5);
      const agendamentos = response.items || response.data || response;
      console.log('loadAgendamentos: Agendamentos recebidos:', agendamentos);
      const formattedEvents = Array.isArray(agendamentos) ? await Promise.all(agendamentos.map(async ag => {
        console.log('Processando agendamento:', ag);
        console.log('ag.unit_name:', ag.unit_name, 'ag.unit_id:', ag.unit_id);
        const unitName = ag.unit_name || await loadUnitName(ag.unit_id) || 'Sem unidade';
        console.log('Unit name final:', unitName);
        return {
          id: ag.id,
          title: `${ag.cliente} - ${ag.servico}`,
          date: ag.data,
          time: ag.hora,
          description: ag.servico,
          cliente: ag.cliente,
          servico: ag.servico,
          whatsapp_number: ag.whatsapp_number,
          custom_message: ag.custom_message,
          enable_notification: ag.enable_notification,
          unit_name: unitName
        };
      })) : [];
      
      // Remove duplicatas baseado no ID
      const uniqueEvents = formattedEvents.filter((event, index, self) => 
        index === self.findIndex(e => e.id === event.id)
      );
      
      setEvents(uniqueEvents);
      
      setPagination({
        currentPage: page,
        totalPages: response.pages || Math.ceil((response.total || 0) / 5),
        totalItems: response.total || 0
      });
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
      setEvents([]);
      setPagination({ currentPage: 1, totalPages: 1, totalItems: 0 });
    } finally {
      setLoading(false);
    }
  };

  const loadAllEvents = async () => {
    try {
      let allAgendamentos = [];
      let page = 1;
      let hasMore = true;
      
      while (hasMore) {
        const response = await agendaService.getAgendamentos(page, 100);
        const agendamentos = response.items || response.data || response;
        
        if (Array.isArray(agendamentos) && agendamentos.length > 0) {
          allAgendamentos = [...allAgendamentos, ...agendamentos];
          hasMore = agendamentos.length === 100;
          page++;
        } else {
          hasMore = false;
        }
      }
      
      const formattedEvents = allAgendamentos.map(ag => ({
        id: ag.id,
        date: ag.data,
        time: ag.hora,
        title: `${ag.cliente} - ${ag.servico}`,
        cliente: ag.cliente,
        servico: ag.servico
      }));
      
      setAllEvents(formattedEvents);
    } catch (error) {
      console.error('Erro ao carregar todos os agendamentos:', error);
    }
  };

  const handleSearch = async (term, page = 1) => {
    setSearchTerm(term);
    const dateFilter = selectedDate.toISOString().split('T')[0];
    
    if (term.trim()) {
      try {
        setLoading(true);
        setEvents([]);
        const response = await agendaService.getAgendamentos(page, 5, term, dateFilter);
        const agendamentos = response.items || response.data || response;
        const formattedEvents = Array.isArray(agendamentos) ? await Promise.all(agendamentos.map(async ag => ({
          id: ag.id,
          title: `${ag.cliente} - ${ag.servico}`,
          date: ag.data,
          time: ag.hora,
          description: ag.servico,
          cliente: ag.cliente,
          servico: ag.servico,
          whatsapp_number: ag.whatsapp_number,
          custom_message: ag.custom_message,
          enable_notification: ag.enable_notification,
          unit_name: ag.unit_name || await loadUnitName(ag.unit_id) || 'Sem unidade'
        }))) : [];
        
        const uniqueEvents = formattedEvents.filter((event, index, self) => 
          index === self.findIndex(e => e.id === event.id)
        );
        
        setEvents(uniqueEvents);
        
        setPagination({
          currentPage: page,
          totalPages: response.pages || Math.ceil((response.total || 0) / 5),
          totalItems: response.total || 0
        });
      } catch (error) {
        console.error('Erro ao buscar agendamentos:', error);
      } finally {
        setLoading(false);
      }
    } else {
      loadAgendamentos(page);
    }
  };

  const loadContacts = async () => {
    try {
      const response = await agendaService.getContacts();
      const contactsData = response.data || response;
      const formattedContacts = Array.isArray(contactsData) ? contactsData.map(contact => ({
        id: contact.id,
        name: contact.name,
        phone: contact.phone,
        lastMessage: contact.last_message || 'Sem mensagens',
        online: contact.is_online
      })) : [];
      setContacts(formattedContacts);
    } catch (error) {
      console.error('Erro ao carregar contatos:', error);
      // Set empty array on error to prevent UI issues
      setContacts([]);
    }
  };

  const loadUnitName = async (unitId) => {
    if (!unitId) {
      console.log('loadUnitName: unitId é null/undefined');
      return 'Sem unidade';
    }
    
    try {
      console.log('loadUnitName: Buscando unidade com ID:', unitId);
      const response = await fetch(`http://72.60.140.128:6002/api/v1/units?id=${unitId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('loadUnitName: Resposta da API:', data);
        return data[0]?.unit_name || 'Sem unidade';
      }
      console.log('loadUnitName: Resposta não OK:', response.status);
      return 'Sem unidade';
    } catch (error) {
      console.error('Erro ao carregar nome da unidade:', error);
      return 'Sem unidade';
    }
  };

  const loadUserUnit = async () => {
    try {
      const response = await fetch('http://72.60.140.128:6002/api/v1/user-unit', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserUnit(data.unit_name || 'Sem unidade');
      } else {
        setUserUnit('Sem unidade');
      }
    } catch (error) {
      console.error('Erro ao carregar unidade do usuário:', error);
      setUserUnit('Sem unidade');
    }
  };

  const handleSaveEvent = async (eventData) => {
    try {
      setLoading(true);
      const agendamentoData = {
        cliente: eventData.cliente,
        servico: eventData.servico,
        data: eventData.date,
        hora: eventData.time,
        valor: eventData.valor,
        whatsapp_number: eventData.whatsappNumber,
        custom_message: eventData.customMessage,
        enable_notification: eventData.enableNotification,
        notification_quantity: eventData.notificationQuantity || 1,
        notification_unit: eventData.notificationUnit || 'dias'
      };
      let result;
      if (editingEvent && editingEvent.id) {
        result = await agendaService.updateAgendamento(editingEvent.id, agendamentoData);
      } else {
        result = await agendaService.createAgendamento(agendamentoData);
      }
      if (result.success !== false) {
        await loadAgendamentos(pagination.currentPage);
        await loadAllEvents();
        // Substituir variáveis {{variavel}} na mensagem personalizada
        if (eventData.whatsappNumber && eventData.customMessage) {
          let msg = eventData.customMessage;
          const variaveis = {
            nome_cliente: eventData.cliente,
            data_agenda: eventData.date,
            hora_agenda: eventData.time,
            servico: eventData.servico
          };
          msg = msg.replace(/{{(.*?)}}/g, (_, v) => variaveis[v.trim()] || '');
          try {
            await agendaService.sendWhatsAppMessage(eventData.whatsappNumber, msg);
          } catch (err) {
            console.warn('Falha ao enviar mensagem WhatsApp:', err);
          }
        }
        setSuccessAlertOpen(true);
        setTimeout(() => setSuccessAlertOpen(false), 4000);
        console.log(editingEvent ? 'Agendamento atualizado' : 'Agendamento criado', 'com sucesso');
      }
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error);
      setErrorDialogMsg('Erro ao salvar agendamento. Tente novamente.');
      setErrorDialogOpen(true);
    } finally {
      setLoading(false);
    }
    setEditingEvent(null);
  };

  const scheduleWhatsAppNotification = (event) => {
    const notificationDate = new Date(`${event.date} ${event.time}`);
    notificationDate.setDate(notificationDate.getDate() - 1);
    
    console.log('Notificação agendada para:', notificationDate);
    console.log('Dados do evento:', event);
  };

  const handleOpenModal = (event = null) => {
    setEditingEvent(event);
    setModalOpen(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setModalOpen(true);
  };

  const handleDeleteEvent = (eventId) => {
    setConfirmDialogMsg('Tem certeza que deseja inativar este agendamento?');
    setPendingDeleteId(eventId);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      setLoading(true);
      await agendaService.deleteAgendamento(pendingDeleteId);
      await loadAgendamentos(pagination.currentPage);
      console.log('Agendamento inativado com sucesso');
    } catch (error) {
      console.error('Erro ao inativar agendamento:', error);
      setErrorDialogMsg('Erro ao inativar agendamento. Tente novamente.');
      setErrorDialogOpen(true);
    } finally {
      setLoading(false);
      setConfirmDialogOpen(false);
      setPendingDeleteId(null);
    }
  };
// ...existing code...

  const handlePageChange = (event, page) => {
    console.log('Mudando para página:', page);
    if (searchTerm.trim()) {
      handleSearch(searchTerm, page);
    } else {
      loadAgendamentos(page);
    }
  };

  const loadChatMessages = async (contact) => {
    if (!contact) return;
    
    try {
      const response = await agendaService.getChatMessages(contact.phone.replace(/\D/g, ''));
      
      if (response.success && response.messages && response.messages.records) {
        const chatMessages = response.messages.records
          .filter(msg => msg && msg.message) // Filter out invalid messages
          .map((msg, index) => {
            const messageContent = msg.message;
            let messageText = '';
            
            // Extract message text with better handling
            if (messageContent.conversation) {
              messageText = messageContent.conversation;
            } else if (messageContent.extendedTextMessage?.text) {
              messageText = messageContent.extendedTextMessage.text;
            } else if (messageContent.textMessage?.text) {
              messageText = messageContent.textMessage.text;
            } else if (messageContent.text) {
              messageText = messageContent.text;
            } else {
              messageText = 'Mensagem não suportada';
            }
            
            return {
              id: msg.key?.id || `${msg.messageTimestamp}-${index}`,
              contactId: contact.id,
              message: messageText,
              sent: msg.key?.fromMe || false,
              timestamp: new Date(msg.messageTimestamp * 1000).toLocaleString('pt-BR', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
              }),
              messageTimestamp: msg.messageTimestamp
            };
          })
          .sort((a, b) => b.messageTimestamp - a.messageTimestamp);
        
        setMessages(chatMessages);
        if (chatMessages.length > 0) {
          setLastMessageId(chatMessages[0].id);
        }
      } else {
        console.warn('Chat messages not available:', response.error || 'Unknown error');
        setMessages([]);
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
      setMessages([]);
    }
  };
  
  const startChatAutoUpdate = (contact) => {
    if (chatPollingInterval) {
      clearInterval(chatPollingInterval);
    }
    
    const interval = setInterval(async () => {
      if (contact && pollingActive) {
        console.log('Auto-updating chat for:', contact.name);
        await loadChatMessages(contact);
      }
    }, 3000); // Update every 3 seconds
    
    setChatPollingInterval(interval);
  };

  const handleSelectContact = (contact) => {
    if (chatPollingInterval) {
      clearInterval(chatPollingInterval);
    }
    
    setSelectedContact(contact);
    setLastMessageId(null);
    setMessages([]);
    
    // Load messages immediately
    loadChatMessages(contact);
    
    // Start auto-update with delay to avoid conflicts
    setTimeout(() => {
      setPollingActive(true);
      startChatAutoUpdate(contact);
    }, 1000);
  };

  const handleSendMessage = async (contactId, message) => {
    try {
      const contact = contacts.find(c => c.id === contactId);
      if (!contact) return;
      
      const result = await agendaService.sendWhatsAppMessage(contact.phone, message);
      
      if (result && result.success) {
        const now = Date.now();
        const newMessage = {
          id: now,
          contactId,
          message,
          sent: true,
          timestamp: new Date().toLocaleString('pt-BR', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          messageTimestamp: Math.floor(now / 1000)
        };
        setMessages(prev => [newMessage, ...prev]);
        
        // Reload chat after sending message
        setTimeout(() => loadChatMessages(contact), 1000);
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    // Filtrar eventos pela data selecionada
    filterEventsByDate(date);
  };

  const filterEventsByDate = async (date) => {
    const dateFilter = date.toISOString().split('T')[0];
    try {
      setLoading(true);
      setEvents([]); // Limpa eventos antes de filtrar
      const response = await agendaService.getAgendamentos(1, 5, searchTerm, dateFilter);
      const agendamentos = response.items || response.data || response;
      const formattedEvents = Array.isArray(agendamentos) ? await Promise.all(agendamentos.map(async ag => ({
        id: ag.id,
        title: `${ag.cliente} - ${ag.servico}`,
        date: ag.data,
        time: ag.hora,
        description: ag.servico,
        cliente: ag.cliente,
        servico: ag.servico,
        whatsapp_number: ag.whatsapp_number,
        custom_message: ag.custom_message,
        enable_notification: ag.enable_notification,
        unit_name: ag.unit_name || await loadUnitName(ag.unit_id) || 'Sem unidade'
      }))) : [];
      
      // Remove duplicatas baseado no ID
      const uniqueEvents = formattedEvents.filter((event, index, self) => 
        index === self.findIndex(e => e.id === event.id)
      );
      
      setEvents(uniqueEvents);
      
      setPagination({
        currentPage: 1,
        totalPages: response.pages || Math.ceil((response.total || 0) / 5),
        totalItems: response.total || 0
      });
    } catch (error) {
      console.error('Erro ao filtrar por data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshEvents = async () => {
    await loadAgendamentos(pagination.currentPage);
    await loadAllEvents();
  };

  const handleMenuClick = (option) => {
    setCurrentView(option);
    setMenuOpen(false);
    console.log('Navegando para:', option);
  };

  const allMenuItems = [
    { id: 'agendamentos', label: 'Agendamentos', icon: <CalendarToday /> },
    { id: 'clientes', label: 'Clientes', icon: <People /> },
    { id: 'caixa', label: 'Caixa e Transações', icon: <AccountBalance /> },
    { id: 'servicos', label: 'Serviços', icon: <Build /> },
    { id: 'recursos', label: 'Recursos', icon: <Group /> },
    { id: 'configuracoes', label: 'Configurações da Unidade', icon: <Settings /> }
  ];

  const menuItems = allMenuItems.filter(item => {
    const hasAccess = hasPermission(item.id);
    console.log(`Menu item ${item.id}: hasPermission = ${hasAccess}`);
    return hasAccess;
  });

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ 
        zIndex: 1201,
        background: palette.gradient,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={() => setMenuOpen(!menuOpen)}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Sistema de Agendamentos
          </Typography>
          <ToolbarContainer />
        </Toolbar>
      </AppBar>
      
      <Drawer
        variant="temporary"
        anchor="left"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: 280,
          flexShrink: 0,
          zIndex: 1300,
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
            background: palette.gradient,
            color: 'white',
            zIndex: 1300
          }
        }}
      >
        <Toolbar />
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Menu Principal
          </Typography>
        </Box>
        
        {/* Fim do menu lateral Drawer */}
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton 
                onClick={() => handleMenuClick(item.id)}
                selected={currentView === item.id}
                sx={{
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                  '&.Mui-selected': { backgroundColor: 'rgba(255,255,255,0.2)' }
                }}
              >
                <ListItemIcon sx={{ color: 'white' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Dialog de confirmação e Alert de sucesso devem ficar fora do Drawer */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Confirmação</DialogTitle>
        <DialogContent>
          <DialogContentText>{confirmDialogMsg}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
      {successAlertOpen && (
        <Alert
          iconMapping={{ success: <CheckCircleIcon fontSize="inherit" /> }}
          severity="success"
          sx={{ position: 'fixed', top: 80, right: 32, zIndex: 2000, minWidth: 320 }}
          onClose={() => setSuccessAlertOpen(false)}
        >
          Agendamento realizado com sucesso.
        </Alert>
      )}

      <Box component="main" sx={{ 
        flexGrow: 1, 
        p: 3, 
        minHeight: '100vh',
        width: '100%',
        backgroundColor: palette.background,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Toolbar />
        {currentView === 'agendamentos' && hasPermission('agendamentos') ? (
          <AgendaPresentational
        selectedDate={selectedDate}
        events={events}
        allEvents={allEvents}
        contacts={contacts}
        messages={messages}
        selectedContact={selectedContact}
        pagination={pagination}
        searchTerm={searchTerm}
        onDateChange={handleDateChange}
        onOpenModal={handleOpenModal}
        onSelectContact={handleSelectContact}
        onSendMessage={handleSendMessage}
        pollingActive={pollingActive}
        onEditEvent={handleEditEvent}
        onDeleteEvent={handleDeleteEvent}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
            onRefreshEvents={handleRefreshEvents}
            loading={loading}
          />
        ) : currentView === 'clientes' && hasPermission('clientes') ? (
          <ClientsContainer />
        ) : currentView === 'caixa' && hasPermission('caixa') ? (
          <CaixaContainer />
        ) : currentView === 'servicos' && hasPermission('servicos') ? (
          <ServicosContainer />
        ) : currentView === 'recursos' && hasPermission('recursos') ? (
          <RecursosContainer />
        ) : currentView === 'configuracoes' && hasPermission('configuracoes') ? (
          <UnitsContainer />
        ) : (
          <Box sx={{ p: 3, textAlign: 'center', flexGrow: 1 }}>
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 600, color: palette.text }}>
              Acesso Negado
            </Typography>
            <Typography variant="body1" color={palette.textSecondary}>
              Você não tem permissão para acessar este módulo.
            </Typography>
          </Box>
        )}
        <Footer />
      </Box>
      
      <AgendaModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveEvent}
        editingEvent={editingEvent}
      />
    {successAlertOpen && (
      <Alert
        iconMapping={{ success: <CheckCircleIcon fontSize="inherit" /> }}
        severity="success"
        sx={{ position: 'fixed', top: 80, right: 32, zIndex: 2000, minWidth: 320 }}
        onClose={() => setSuccessAlertOpen(false)}
      >
        Agendamento realizado com sucesso.
      </Alert>
    )}
    </Box>
  );
};

export default AgendaContainer;