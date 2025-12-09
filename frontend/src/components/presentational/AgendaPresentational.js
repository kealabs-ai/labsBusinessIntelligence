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
  Tv,
  NotificationsActive
} from '@mui/icons-material';
import TVModal from './TVModal';
import NotificationModal from './NotificationModal';
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
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);

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
    <Box sx={{ p: 3 }}>
        <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CalendarToday sx={{ fontSize: 32, color: 'white' }} />
              <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: 'white' }}>
                Gerenciamento de Agenda
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          {/* Google Calendar */}
          <Grid item xs={12} md={6}>
            <Card sx={agendaStyles.mainCard}>
              <Typography variant="h6" sx={agendaStyles.sectionTitle}>
                <CalendarToday sx={agendaStyles.calendarIcon} />
                Agendamentos
              </Typography>
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

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, flexWrap: 'wrap', gap: 1 }}>
                <Typography variant="subtitle1">Próximos Eventos</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    onClick={() => setNotificationModalOpen(true)}
                    sx={{ 
                      color: '#FF9800',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 152, 0, 0.1)'
                      }
                    }}
                    title="Configurar Avisos"
                  >
                    <NotificationsActive />
                  </IconButton>
                  <IconButton
                    onClick={() => setTvModalOpen(true)}
                    sx={{ 
                      color: 'primary.main',
                      '&:hover': {
                        backgroundColor: 'rgba(102, 126, 234, 0.1)'
                      }
                    }}
                    title="Modo TV"
                  >
                    <Tv />
                  </IconButton>
                </Box>
              </Box>
              <List sx={{ maxHeight: { xs: '250px', sm: '600px' }, overflow: 'auto' }}>
                {events.map((event) => (
                  <ListItem 
                    key={event.id} 
                    sx={{
                      ...agendaStyles.eventItem,
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      gap: { xs: 1, sm: 0 }
                    }}
                  >
                    <ListItemText
                      primary={event.title}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            {event.date} às {event.time} - {event.description}
                          </Typography>
                          {event.unit_name && (
                            <Typography variant="caption" sx={{ 
                              color: 'primary.main', 
                              fontWeight: 500,
                              display: 'block',
                              mt: 0.5
                            }}>
                              📍 Unidade: {event.unit_name}
                            </Typography>
                          )}
                        </Box>
                      }
                      sx={{ 
                        flex: 1,
                        '& .MuiListItemText-primary': {
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                          fontWeight: 500
                        }
                      }}
                    />
                    <Box sx={{ 
                      display: 'flex', 
                      gap: 1,
                      alignSelf: { xs: 'flex-end', sm: 'center' }
                    }}>
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
                <Grid item xs={12} sm={5}>
                  <Typography variant="subtitle2" gutterBottom>Contatos</Typography>
                  <List sx={{ 
                    maxHeight: { xs: '250px', sm: '600px' }, 
                    overflow: 'auto',
                    overflowY: 'scroll',
                    border: { xs: '1px solid #e0e0e0', sm: 'none' },
                    borderRadius: { xs: 1, sm: 0 },
                    '&::-webkit-scrollbar': {
                      width: '8px'
                    },
                    '&::-webkit-scrollbar-track': {
                      background: '#f1f1f1',
                      borderRadius: '4px'
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: '#c1c1c1',
                      borderRadius: '4px',
                      '&:hover': {
                        background: '#a8a8a8'
                      }
                    }
                  }}>
                    {contacts.map((contact) => (
                      <ListItem
                        key={contact.id}
                        button
                        selected={selectedContact?.id === contact.id}
                        onClick={() => onSelectContact(contact)}
                        sx={{
                          ...agendaStyles.contactItem,
                          py: { xs: 1, sm: 1.5 },
                          '&.Mui-selected': {
                            backgroundColor: 'rgba(102, 126, 234, 0.1)'
                          }
                        }}
                      >
                        <ListItemAvatar>
                          <Badge
                            badgeContent={getContactMessages(contact.id).length}
                            color="primary"
                            sx={{
                              '& .MuiBadge-badge': {
                                backgroundColor: '#667eea',
                                color: 'white',
                                fontSize: '0.75rem',
                                minWidth: '18px',
                                height: '18px'
                              }
                            }}
                          >
                            <Badge
                              color={contact.online ? 'success' : 'default'}
                              variant="dot"
                            >
                              <Avatar sx={{ width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 } }}>
                                <Person />
                              </Avatar>
                            </Badge>
                          </Badge>
                        </ListItemAvatar>
                        <ListItemText
                          primary={contact.name}
                          secondary={contact.lastMessage}
                          sx={{
                            '& .MuiListItemText-primary': {
                              fontSize: { xs: '0.9rem', sm: '1rem' },
                              fontWeight: 500
                            },
                            '& .MuiListItemText-secondary': {
                              fontSize: { xs: '0.75rem', sm: '0.875rem' },
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>

                {/* Chat */}
                <Grid item xs={12} sm={7}>
                  {selectedContact ? (
                    <Box sx={agendaStyles.chatContainer}>
                      <Typography variant="subtitle2" gutterBottom>
                        Chat com {selectedContact.name}
                      </Typography>
                      
                      <Box sx={{ 
                        ...agendaStyles.messagesArea, 
                        maxHeight: { xs: '300px', sm: '500px' },
                        minHeight: { xs: '200px', sm: '300px' }
                      }}>
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

                      <Box sx={{ 
                        display: 'flex', 
                        gap: 1,
                        flexDirection: { xs: 'column', sm: 'row' },
                        mt: 1
                      }}>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Digite sua mensagem..."
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                          sx={{
                            ...agendaStyles.messageInput,
                            mb: { xs: 1, sm: 0 }
                          }}
                          multiline
                          maxRows={3}
                        />
                        <Button
                          variant="contained"
                          size="small"
                          onClick={handleSendMessage}
                          disabled={!messageText.trim()}
                          sx={{
                            ...agendaStyles.sendButton,
                            minWidth: { xs: '100%', sm: 'auto' },
                            height: { xs: '40px', sm: 'auto' }
                          }}
                        >
                          <Send sx={{ mr: { xs: 1, sm: 0 } }} />
                          <Box sx={{ display: { xs: 'inline', sm: 'none' } }}>Enviar</Box>
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
      
      <TVModal
        open={tvModalOpen}
        onClose={() => setTvModalOpen(false)}
        events={allEvents}
        onRefresh={onRefreshEvents}
        loading={loading}
      />
      
      <NotificationModal
        open={notificationModalOpen}
        onClose={() => setNotificationModalOpen(false)}
        onSave={(config) => {
          // Salvar configuração global de notificação
          localStorage.setItem('defaultNotificationConfig', JSON.stringify(config));
          console.log('Configuração de aviso salva:', config);
        }}
      />
    </Box>
  );
};

export default AgendaPresentational;