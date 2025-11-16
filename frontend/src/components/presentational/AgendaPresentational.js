import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Divider,
  Card,
  CardContent,
  Badge
} from '@mui/material';
import {
  CalendarToday,
  WhatsApp,
  Person,
  Add,
  Send,
  Circle
} from '@mui/icons-material';

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
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <CalendarToday sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
        <Typography variant="h4" component="h1">
          Gerenciamento de Agenda
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Google Calendar */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '600px' }}>
            <Typography variant="h6" gutterBottom>
              <CalendarToday sx={{ mr: 1, verticalAlign: 'middle' }} />
              Google Calendar
            </Typography>
            
            <TextField
              type="date"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => onDateChange(new Date(e.target.value))}
              fullWidth
              sx={{ mb: 2 }}
            />

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>Adicionar Evento</Typography>
              <TextField
                label="Título"
                value={newEvent.title}
                onChange={(e) => onEventChange({...newEvent, title: e.target.value})}
                fullWidth
                size="small"
                sx={{ mb: 1 }}
              />
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <TextField
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => onEventChange({...newEvent, date: e.target.value})}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => onEventChange({...newEvent, time: e.target.value})}
                    fullWidth
                    size="small"
                  />
                </Grid>
              </Grid>
              <TextField
                label="Descrição"
                value={newEvent.description}
                onChange={(e) => onEventChange({...newEvent, description: e.target.value})}
                fullWidth
                size="small"
                sx={{ mt: 1, mb: 1 }}
              />
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={onAddEvent}
                size="small"
              >
                Adicionar
              </Button>
            </Box>

            <Typography variant="subtitle1" gutterBottom>Próximos Eventos</Typography>
            <List>
              {events.map((event) => (
                <ListItem key={event.id}>
                  <ListItemText
                    primary={event.title}
                    secondary={`${event.date} às ${event.time} - ${event.description}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* WhatsApp Manager */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '600px', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              <WhatsApp sx={{ mr: 1, verticalAlign: 'middle', color: '#25D366' }} />
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
                      sx={{ border: '1px solid #e0e0e0', mb: 1, borderRadius: 1 }}
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
                  <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Chat com {selectedContact.name}
                    </Typography>
                    
                    <Box sx={{ flexGrow: 1, maxHeight: '300px', overflow: 'auto', mb: 2 }}>
                      {getContactMessages(selectedContact.id).map((msg) => (
                        <Card
                          key={msg.id}
                          sx={{
                            mb: 1,
                            ml: msg.sent ? 2 : 0,
                            mr: msg.sent ? 0 : 2,
                            bgcolor: msg.sent ? '#e3f2fd' : '#f5f5f5'
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
                      />
                      <Button
                        variant="contained"
                        size="small"
                        onClick={handleSendMessage}
                        disabled={!messageText.trim()}
                      >
                        <Send />
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <Typography color="textSecondary">
                      Selecione um contato para iniciar o chat
                    </Typography>
                  </Box>
                )}
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />
            <Typography variant="caption" color="textSecondary">
              💡 Configure notificações automáticas para eventos da agenda
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AgendaPresentational;