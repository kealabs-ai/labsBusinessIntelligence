import React, { useState } from 'react';
import {
  Grid,
  Typography,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Card,
  CardContent,
  Badge,
  IconButton,
  Pagination
} from '@mui/material';
import {
  CalendarToday,
  WhatsApp,
  Person,
  Add,
  Send,
  Edit,
  Delete,
  Tv
} from '@mui/icons-material';
import TVModal from './TVModal';
import { agendaStyles } from './AgendaPresentational.styles';

const AgendaPresentational = ({
  selectedDate,
  events,
  allEvents,
  contacts,
  messages,
  selectedContact,
  pagination,
  searchTerm,
  loading,
  onDateChange,
  onOpenModal,
  onSelectContact,
  onSendMessage,
  onEditEvent,
  onDeleteEvent,
  onPageChange,
  onSearch,
  onRefreshEvents
}) => {
  const [messageText, setMessageText] = useState('');
  const [tvModalOpen, setTvModalOpen] = useState(false);

  const isDateScheduled = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return allEvents.some(event => event.date === dateStr);
  };

  const getScheduledEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return allEvents.filter(event => event.date === dateStr);
  };

  const handleSendMessage = () => {
    if (messageText.trim() && selectedContact) {
      onSendMessage(selectedContact.id, messageText);
      setMessageText('');
    }
  };

  const getContactMessages = (contactId) => {
    return messages.filter(msg => msg.contactId === contactId);
  };

  return (
    <Box sx={agendaStyles.container}>
      <Box sx={agendaStyles.content}>
        <Box sx={agendaStyles.header}>
          <CalendarToday sx={agendaStyles.headerIcon} />
          <Typography variant="h4" component="h1" sx={agendaStyles.title}>
            Gerenciamento de Agenda
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Google Calendar */}
          <Grid item xs={12} md={6}>
            <Card sx={agendaStyles.mainCard}>
              <Typography variant="h6" sx={agendaStyles.sectionTitle}>
                <CalendarToday sx={agendaStyles.calendarIcon} />
                Google Calendar
              </Typography>
            
              <TextField
                type="date"
                label="Data Selecionada"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => onDateChange(new Date(e.target.value))}
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{ 
                  ...agendaStyles.textField, 
                  mb: 2,
                  '& .MuiInputBase-input': {
                    backgroundColor: isDateScheduled(selectedDate) ? 'rgba(102, 126, 234, 0.1)' : 'transparent'
                  }
                }}
              />
              
              <TextField
                fullWidth
                label="Buscar agendamentos"
                value={searchTerm}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Digite o nome do cliente ou serviço..."
                sx={{ ...agendaStyles.textField, mb: 2 }}
              />

              <Box sx={agendaStyles.addEventSection}>
                <Typography variant="subtitle1" gutterBottom>Gerenciar Agendamentos</Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={onOpenModal}
                  fullWidth
                  sx={agendaStyles.addButton}
                >
                  ADICIONAR AGENDAMENTO
                </Button>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1">Próximos Eventos</Typography>
                <IconButton
                  onClick={() => setTvModalOpen(true)}
                  sx={{ 
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'rgba(102, 126, 234, 0.1)'
                    }
                  }}
                >
                  <Tv />
                </IconButton>
              </Box>
              <List>
                {events.map((event) => (
                  <ListItem key={event.id} sx={agendaStyles.eventItem}>
                    <ListItemText
                      primary={event.title}
                      secondary={`${event.date} às ${event.time} - ${event.description}`}
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => onEditEvent(event)}
                        sx={{ color: 'primary.main' }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => onDeleteEvent(event.id)}
                        sx={{ color: 'error.main' }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </ListItem>
                ))}
              </List>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Pagination
                  count={pagination?.totalPages || 1}
                  page={pagination?.currentPage || 1}
                  onChange={(e, page) => onPageChange(page)}
                  color="primary"
                  size="small"
                />
              </Box>
            </Card>
          </Grid>

          {/* WhatsApp Manager */}
          <Grid item xs={12} md={6}>
            <Card sx={{ ...agendaStyles.whatsappCard, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" sx={agendaStyles.sectionTitle}>
                <WhatsApp sx={agendaStyles.whatsappIcon} />
                WhatsApp Manager
              </Typography>

              <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                {/* Lista de Contatos */}
                <Grid item xs={5}>
                  <Typography variant="subtitle2" gutterBottom>Contatos</Typography>
                  <List sx={{ maxHeight: '600px', overflow: 'auto' }}>
                    {contacts.map((contact) => (
                      <ListItem
                        key={contact.id}
                        button
                        selected={selectedContact?.id === contact.id}
                        onClick={() => onSelectContact(contact)}
                        sx={agendaStyles.contactItem}
                      >
                        <ListItemAvatar>
                          <Badge
                            color={contact.online ? 'success' : 'default'}
                            variant="dot"
                          >
                            <Avatar>
                              <Person />
                            </Avatar>
                          </Badge>
                        </ListItemAvatar>
                        <ListItemText
                          primary={contact.name}
                          secondary={contact.lastMessage}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>

                {/* Chat */}
                <Grid item xs={7}>
                  {selectedContact ? (
                    <Box sx={agendaStyles.chatContainer}>
                      <Typography variant="subtitle2" gutterBottom>
                        Chat com {selectedContact.name}
                      </Typography>
                      
                      <Box sx={{ ...agendaStyles.messagesArea, maxHeight: '500px' }}>
                        {getContactMessages(selectedContact.id).map((msg) => (
                          <Card
                            key={msg.id}
                            sx={{
                              ...agendaStyles.messageCard,
                              ...(msg.sent ? agendaStyles.sentMessage : agendaStyles.receivedMessage)
                            }}
                          >
                            <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                              <Typography variant="body2">{msg.message}</Typography>
                              <Typography variant="caption" color="textSecondary">
                                {msg.timestamp}
                              </Typography>
                            </CardContent>
                          </Card>
                        ))}
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Digite sua mensagem..."
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          sx={agendaStyles.messageInput}
                        />
                        <Button
                          variant="contained"
                          size="small"
                          onClick={handleSendMessage}
                          disabled={!messageText.trim()}
                          sx={agendaStyles.sendButton}
                        >
                          <Send />
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={agendaStyles.emptyChat}>
                      <Typography>
                        Selecione um contato para iniciar o chat
                      </Typography>
                    </Box>
                  )}
                </Grid>
              </Grid>

              <Box sx={agendaStyles.tip}>
                💡 Configure notificações automáticas para eventos da agenda
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
      
      <TVModal
        open={tvModalOpen}
        onClose={() => setTvModalOpen(false)}
        events={allEvents}
        onRefresh={onRefreshEvents}
        loading={loading}
      />
    </Box>
  );
};

export default AgendaPresentational;