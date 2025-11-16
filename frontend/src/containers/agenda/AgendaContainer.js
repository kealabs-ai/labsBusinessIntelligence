import React, { useState, useEffect } from 'react';
import AgendaPresentational from '../../components/presentational/AgendaPresentational';
import ToolbarContainer from '../toolbar/ToolbarContainer';

const AgendaContainer = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '', description: '' });
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    // Simular dados do Google Calendar
    setEvents([
      { id: 1, title: 'Reunião de equipe', date: '2024-01-15', time: '09:00', description: 'Reunião semanal' },
      { id: 2, title: 'Apresentação cliente', date: '2024-01-16', time: '14:00', description: 'Demo do produto' }
    ]);

    // Simular contatos WhatsApp
    setContacts([
      { id: 1, name: 'João Silva', phone: '+5511999999999', lastMessage: 'Confirma reunião?', online: true },
      { id: 2, name: 'Maria Santos', phone: '+5511888888888', lastMessage: 'Relatório enviado', online: false }
    ]);

    // Simular mensagens
    setMessages([
      { id: 1, contactId: 1, message: 'Oi, tudo bem?', sent: false, timestamp: '10:30' },
      { id: 2, contactId: 1, message: 'Confirma reunião de amanhã?', sent: false, timestamp: '10:31' },
      { id: 3, contactId: 1, message: 'Confirmado!', sent: true, timestamp: '10:35' }
    ]);
  }, []);

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.date && newEvent.time) {
      const event = {
        id: Date.now(),
        ...newEvent
      };
      setEvents(prev => [...prev, event]);
      setNewEvent({ title: '', date: '', time: '', description: '' });
    }
  };

  const handleSendMessage = (contactId, message) => {
    const newMessage = {
      id: Date.now(),
      contactId,
      message,
      sent: true,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <>
      <ToolbarContainer />
      <AgendaPresentational
        selectedDate={selectedDate}
        events={events}
        contacts={contacts}
        messages={messages}
        newEvent={newEvent}
        selectedContact={selectedContact}
        onDateChange={handleDateChange}
        onEventChange={setNewEvent}
        onAddEvent={handleAddEvent}
        onSelectContact={setSelectedContact}
        onSendMessage={handleSendMessage}
      />
    </>
  );
};

export default AgendaContainer;