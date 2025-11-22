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
  Badge
} from '@mui/material';
import {
  CalendarToday,
  WhatsApp,
  Person,
  Add,
  Send
} from '@mui/icons-material';
import { agendaStyles } from './AgendaPresentational.styles';

const AgendaPresentational = ({
  selectedDate,
  events,
  contacts,
  messages,
  newEvent,
  selectedContact,
  onDateChange,
  onEventChange,
  onAddEvent,
  onSelectContact,
  onSendMessage
}) => {
  const [messageText, setMessageText] = useState('');

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
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => onDateChange(new Date(e.target.value))}
                fullWidth
                sx={{ ...agendaStyles.textField, mb: 2 }}
              />

              <Box sx={agendaStyles.addEventSection}>
                <Typography variant="subtitle1" gutterBottom>Adicionar Evento</Typography>
                <TextField
                  label="Título"
                  value={newEvent.title}
                  onChange={(e) => onEventChange({...newEvent, title: e.target.value})}
                  fullWidth
                  size="small"
                  sx={{ ...agendaStyles.textField, mb: 1 }}
                />
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <TextField
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => onEventChange({...newEvent, date: e.target.value})}
                      fullWidth
                      size="small"
                      sx={agendaStyles.textField}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => onEventChange({...newEvent, time: e.target.value})}
                      fullWidth
                      size="small"
                      sx={agendaStyles.textField}
                    />
                  </Grid>
                </Grid>
                <TextField
                  label="Descrição"
                  value={newEvent.description}
                  onChange={(e) => onEventChange({...newEvent, description: e.target.value})}
                  fullWidth
                  size="small"
                  sx={{ ...agendaStyles.textField, mt: 1, mb: 1 }}
                />
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={onAddEvent}
                  size="small"
                  sx={agendaStyles.addButton}
                >
                  Adicionar
                </Button>
              </Box>

              <Typography variant="subtitle1" gutterBottom>Próximos Eventos</Typography>
              <List>
                {events.map((event) => (
                  <ListItem key={event.id} sx={agendaStyles.eventItem}>
                    <ListItemText
                      primary={event.title}
                      secondary={`${event.date} às ${event.time} - ${event.description}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Card>
          </Grid>

          {/* WhatsApp Manager */}
          <Grid item xs={12} md={6}>
            <Card sx={{ ...agendaStyles.mainCard, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" sx={agendaStyles.sectionTitle}>
                <WhatsApp sx={agendaStyles.whatsappIcon} />
                WhatsApp Manager
              </Typography>

              <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                {/* Lista de Contatos */}
                <Grid item xs={5}>
                  <Typography variant="subtitle2" gutterBottom>Contatos</Typography>
                  <List sx={{ maxHeight: '400px', overflow: 'auto' }}>
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
                      
                      <Box sx={agendaStyles.messagesArea}>
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
    </Box>
  );
};

export default AgendaPresentational;