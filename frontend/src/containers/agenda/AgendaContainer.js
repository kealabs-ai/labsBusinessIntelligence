import React, { useState, useEffect } from 'react';
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
  Collapse
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  CalendarToday, 
  People, 
  WhatsApp, 
  AccountBalance, 
  Assessment,
  Settings,
  ExpandLess,
  ExpandMore
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AgendaPresentational from '../../components/presentational/AgendaPresentational';
import AgendaModal from '../../components/presentational/AgendaModal';
import ClientsContainer from '../clients/ClientsContainer';
import ToolbarContainer from '../toolbar/ToolbarContainer';
import { agendaService } from '../../services/agendaService';

const AgendaContainer = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('agendamentos');
  const [menuOpen, setMenuOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
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

  useEffect(() => {
    loadAgendamentos();
    loadAllEvents();
    loadContacts();
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
      const response = await agendaService.getAgendamentos(page, 3);
      const agendamentos = response.items || response.data || response;
      const formattedEvents = Array.isArray(agendamentos) ? agendamentos.map(ag => ({
        id: ag.id,
        title: `${ag.cliente} - ${ag.servico}`,
        date: ag.data,
        time: ag.hora,
        description: ag.servico,
        cliente: ag.cliente,
        servico: ag.servico,
        whatsapp_number: ag.whatsapp_number,
        custom_message: ag.custom_message,
        enable_notification: ag.enable_notification
      })) : [];
      setEvents(formattedEvents);
      
      if (response.total !== undefined) {
        setPagination({
          currentPage: response.page || page,
          totalPages: response.pages || Math.ceil(response.total / 3),
          totalItems: response.total || formattedEvents.length
        });
      }
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
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

  const handleSearch = async (term) => {
    setSearchTerm(term);
    const dateFilter = selectedDate.toISOString().split('T')[0];
    
    if (term.trim()) {
      try {
        const response = await agendaService.getAgendamentos(1, 3, term, dateFilter);
        const agendamentos = response.items || response.data || response;
        const formattedEvents = Array.isArray(agendamentos) ? agendamentos.map(ag => ({
          id: ag.id,
          title: `${ag.cliente} - ${ag.servico}`,
          date: ag.data,
          time: ag.hora,
          description: ag.servico,
          cliente: ag.cliente,
          servico: ag.servico,
          whatsapp_number: ag.whatsapp_number,
          custom_message: ag.custom_message,
          enable_notification: ag.enable_notification
        })) : [];
        setEvents(formattedEvents);
        
        if (response.total !== undefined) {
          setPagination({
            currentPage: 1,
            totalPages: response.pages || Math.ceil(response.total / 3),
            totalItems: response.total || formattedEvents.length
          });
        }
      } catch (error) {
        console.error('Erro ao buscar agendamentos:', error);
      }
    } else {
      loadAgendamentos(1);
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
      setContacts([
        { id: 1, name: 'João Silva', phone: '+5511999999999', lastMessage: 'Confirma reunião?', online: true },
        { id: 2, name: 'Maria Santos', phone: '+5511888888888', lastMessage: 'Relatório enviado', online: false }
      ]);
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
        await loadContacts();
        console.log(editingEvent ? 'Agendamento atualizado' : 'Agendamento criado', 'com sucesso');
      }
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error);
      alert('Erro ao salvar agendamento. Tente novamente.');
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

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Tem certeza que deseja inativar este agendamento?')) {
      try {
        setLoading(true);
        await agendaService.deleteAgendamento(eventId);
        await loadAgendamentos(pagination.currentPage);
        console.log('Agendamento inativado com sucesso');
      } catch (error) {
        console.error('Erro ao inativar agendamento:', error);
        alert('Erro ao inativar agendamento. Tente novamente.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePageChange = (page) => {
    loadAgendamentos(page);
  };

  const loadChatMessages = async (contact) => {
    if (!contact) return;
    
    try {
      const response = await agendaService.getChatMessages(contact.phone.replace(/\D/g, ''));
      
      if (response.success && response.messages && response.messages.records) {
        const chatMessages = response.messages.records
          .map((msg, index) => ({
            id: msg.key?.id || `${msg.messageTimestamp}-${index}`,
            contactId: contact.id,
            message: msg.message?.conversation || msg.message?.extendedTextMessage?.text || 'Mensagem não suportada',
            sent: msg.key?.fromMe || false,
            timestamp: new Date(msg.messageTimestamp * 1000).toLocaleString('pt-BR', { 
              day: '2-digit', 
              month: '2-digit', 
              year: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            messageTimestamp: msg.messageTimestamp
          }))
          .sort((a, b) => b.messageTimestamp - a.messageTimestamp);
        
        setMessages(chatMessages);
        if (chatMessages.length > 0) {
          setLastMessageId(chatMessages[0].id);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
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
    
    loadChatMessages(contact);
    
    setPollingActive(true);
    startChatAutoUpdate(contact);
  };

  const handleSendMessage = async (contactId, message) => {
    try {
      const contact = contacts.find(c => c.id === contactId);
      if (!contact) return;
      
      const result = await agendaService.sendWhatsAppMessage(contact.phone, message);
      
      if (result.success) {
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
      const response = await agendaService.getAgendamentos(1, 3, searchTerm, dateFilter);
      const agendamentos = response.items || response.data || response;
      const formattedEvents = Array.isArray(agendamentos) ? agendamentos.map(ag => ({
        id: ag.id,
        title: `${ag.cliente} - ${ag.servico}`,
        date: ag.data,
        time: ag.hora,
        description: ag.servico,
        cliente: ag.cliente,
        servico: ag.servico,
        whatsapp_number: ag.whatsapp_number,
        custom_message: ag.custom_message,
        enable_notification: ag.enable_notification
      })) : [];
      setEvents(formattedEvents);
      
      if (response.total !== undefined) {
        setPagination({
          currentPage: 1,
          totalPages: response.pages || Math.ceil(response.total / 3),
          totalItems: response.total || formattedEvents.length
        });
      }
    } catch (error) {
      console.error('Erro ao filtrar por data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshEvents = async () => {
    await loadAllEvents();
    await loadAgendamentos(pagination.currentPage);
  };

  const handleMenuClick = (option) => {
    setCurrentView(option);
    setMenuOpen(false);
    console.log('Navegando para:', option);
  };

  const menuItems = [
    { id: 'agendamentos', label: 'Agendamentos', icon: <CalendarToday /> },
    { id: 'clientes', label: 'Clientes', icon: <People /> },
    { id: 'caixa', label: 'Caixa e Transações', icon: <AccountBalance /> },
    { id: 'relatorios', label: 'Relatórios', icon: <Assessment /> }
  ];

  const configSubItems = [
    { title: 'Serviços', action: () => handleMenuClick('config-servicos') },
    { title: 'Recursos e Profissionais', action: () => handleMenuClick('config-recursos') },
    { title: 'Configurações da Unidade', action: () => handleMenuClick('config-unidade') }
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ 
        zIndex: 1201,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
          
          <ListItem disablePadding>
            <ListItemButton onClick={() => setConfigOpen(!configOpen)}>
              <ListItemIcon sx={{ color: 'white' }}>
                <Settings />
              </ListItemIcon>
              <ListItemText primary="Configurações" />
              {configOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          
          <Collapse in={configOpen} timeout="auto" unmountOnExit>
            {configSubItems.map((subItem, subIndex) => (
              <ListItem key={subIndex} disablePadding sx={{ pl: 4 }}>
                <ListItemButton 
                  onClick={subItem.action}
                  sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
                >
                  <ListItemText 
                    primary={subItem.title}
                    sx={{ '& .MuiListItemText-primary': { fontSize: '0.9rem' } }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </Collapse>
        </List>
      </Drawer>
      
      <Box component="main" sx={{ 
        flexGrow: 1, 
        p: 3, 
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#f5f5f5'
      }}>
        <Toolbar />
        {currentView === 'agendamentos' ? (
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
        ) : currentView === 'clientes' ? (
          <ClientsContainer />
        ) : (
          <Box>
            <Typography variant="h4" sx={{ mb: 2 }}>
              {currentView.charAt(0).toUpperCase() + currentView.slice(1)}
            </Typography>
            <Typography variant="body1">
              Módulo em desenvolvimento...
            </Typography>
          </Box>
        )}
      </Box>
      
      <AgendaModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveEvent}
        editingEvent={editingEvent}
      />
    </Box>
  );
};

export default AgendaContainer;