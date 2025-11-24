import React, { useState, useEffect } from 'react';
import AgendaPresentational from '../../components/presentational/AgendaPresentational';
import AgendaModal from '../../components/presentational/AgendaModal';
import ToolbarContainer from '../toolbar/ToolbarContainer';
import { agendaService } from '../../services/agendaService';

const AgendaContainer = () => {
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

  useEffect(() => {
    loadAgendamentos();
    loadAllEvents();
    loadContacts();
  }, []);

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
      const response = await agendaService.getAgendamentos(1, 1000);
      const agendamentos = response.items || response.data || response;
      const formattedEvents = Array.isArray(agendamentos) ? agendamentos.map(ag => ({
        id: ag.id,
        date: ag.data,
        title: `${ag.cliente} - ${ag.servico}`
      })) : [];
      setAllEvents(formattedEvents);
    } catch (error) {
      console.error('Erro ao carregar todos os agendamentos:', error);
    }
  };

  const handleSearch = async (term) => {
    setSearchTerm(term);
    if (term.trim()) {
      try {
        const response = await agendaService.getAgendamentos(1, 3, term);
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
        whatsapp_number: eventData.whatsappNumber,
        custom_message: eventData.customMessage,
        enable_notification: eventData.enableNotification
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
        const chatMessages = response.messages.records.map((msg, index) => ({
          id: msg.key?.id || index,
          contactId: contact.id,
          message: msg.message?.conversation || msg.message?.extendedTextMessage?.text || 'Mensagem não suportada',
          sent: msg.key?.fromMe || false,
          timestamp: new Date(msg.messageTimestamp * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        }));
        setMessages(chatMessages);
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    }
  };

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    loadChatMessages(contact);
  };

  const handleSendMessage = async (contactId, message) => {
    try {
      const contact = contacts.find(c => c.id === contactId);
      if (!contact) return;
      
      const result = await agendaService.sendWhatsAppMessage(contact.phone, message);
      
      if (result.success) {
        const newMessage = {
          id: Date.now(),
          contactId,
          message,
          sent: true,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, newMessage]);
      } else {
        alert('Erro ao enviar mensagem WhatsApp');
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      alert('Erro ao enviar mensagem. Tente novamente.');
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleRefreshEvents = async () => {
    await loadAllEvents();
    await loadAgendamentos(pagination.currentPage);
  };

  return (
    <>
      <ToolbarContainer />
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
        onEditEvent={handleEditEvent}
        onDeleteEvent={handleDeleteEvent}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        onRefreshEvents={handleRefreshEvents}
      />
      
      <AgendaModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveEvent}
        editingEvent={editingEvent}
      />
    </>
  );
};

export default AgendaContainer;