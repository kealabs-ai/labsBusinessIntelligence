import React, { useState, useEffect } from 'react';
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
  Pagination,
  CircularProgress,
  Chip
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
import { useColorPalette } from '../../utils/useColorPalette';


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
  const colorPalette = useColorPalette();
  


  if (!colorPalette) {
    return null;
  }

  const styles = agendaStyles(colorPalette);

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
    <Box sx={{ p: 3, backgroundColor: colorPalette.backgroundColor }}>
        <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', background: `linear-gradient(135deg, ${colorPalette.primaryColor} 0%, ${colorPalette.secondaryColor} 100%)` }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CalendarToday sx={{ fontSize: 32, color: colorPalette.textColor }} />
              <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: colorPalette.textColor }}>
                Gerenciamento de Agenda
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          {/* Google Calendar */}
          <Grid item xs={12} md={6}>
            <Card sx={{ ...styles.mainCard, backgroundColor: colorPalette.backgroundCardColor }}>
              <Typography variant="h6" sx={{ ...styles.sectionTitle, color: colorPalette.textColor }}>
                <CalendarToday sx={{ ...styles.calendarIcon, color: colorPalette.primaryColor }} />
                Agendamentos
              </Typography>
              <TextField
                fullWidth
                label="Buscar agendamentos"
                value={searchTerm}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Digite o nome do cliente ou serviço..."
                sx={{
                  ...styles.textField,
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: colorPalette.primaryColor,
                    },
                    '&:hover fieldset': {
                      borderColor: colorPalette.secondaryColor,
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: colorPalette.textColor,
                  },
                }}
              />

              <Box sx={styles.addEventSection}>
                <Typography variant="subtitle1" gutterBottom sx={{ color: colorPalette.textColor }}>Gerenciar Agendamentos</Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={onOpenModal}
                  fullWidth
                  sx={{
                    ...styles.addButton,
                    backgroundColor: colorPalette.buttonColor,
                    color: colorPalette.buttonTextColor,
                    '&:hover': {
                      backgroundColor: colorPalette.buttonHoverColor,
                    },
                  }}
                >
                  ADICIONAR AGENDAMENTO
                </Button>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle1" sx={{ color: colorPalette.textColor }}>Próximos Eventos</Typography>
                  {loading && <CircularProgress size={16} />}
                  {pagination.totalItems > 0 && (
                    <Chip 
                      label={`${pagination.totalItems} agendamentos`} 
                      size="small" 
                      sx={{ backgroundColor: colorPalette.primaryColor, color: colorPalette.textColor }}
                      variant="outlined"
                    />
                  )}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    onClick={() => setNotificationModalOpen(true)}
                    sx={{ 
                      color: colorPalette.warningColor,
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
                      color: colorPalette.primaryColor,
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
              <List sx={{ 
                maxHeight: { xs: '250px', sm: '600px' }, 
                overflow: 'auto',
                minHeight: '200px',
                backgroundColor: colorPalette.backgroundColor,
              }}>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                  </Box>
                ) : events.length === 0 ? (
                  <Box sx={{ textAlign: 'center', p: 3, color: colorPalette.textSecondaryColor }}>
                    <Typography variant="body2">
                      {searchTerm ? 'Nenhum agendamento encontrado para a busca' : 'Nenhum agendamento encontrado'}
                    </Typography>
                  </Box>
                ) : (
                  events.map((event) => (
                    <ListItem 
                      key={event.id} 
                      sx={{
                        ...styles.eventItem,
                        backgroundColor: colorPalette.backgroundCardColor,
                        borderBottom: `1px solid ${colorPalette.borderColor}`,
                        '&:hover': {
                          backgroundColor: colorPalette.hoverColor,
                        },
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        gap: { xs: 1, sm: 0 }
                      }}
                    >
                      <ListItemText
                        primary={event.title}
                        secondary={
                          <Box>
                            <Typography variant="body2" sx={{ color: colorPalette.textSecondaryColor }}>
                              {event.date} às {event.time} - {event.description}
                            </Typography>
                            {event.unit_name && (
                              <Typography variant="caption" sx={{ 
                                color: colorPalette.primaryColor, 
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
                            fontWeight: 500,
                            color: colorPalette.textColor,
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
                          sx={{ color: colorPalette.primaryColor }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => onDeleteEvent(event.id)}
                          sx={{ color: colorPalette.errorColor }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </ListItem>
                  ))
                )}
              </List>
              
              {!loading && events.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Pagination
                    count={pagination?.totalPages || 1}
                    page={pagination?.currentPage || 1}
                    onChange={(e, page) => onPageChange(e, page)}
                    color="primary"
                    size="small"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              )}
            </Card>
          </Grid>

          {/* WhatsApp Manager */}
          <Grid item xs={12} md={6}>
            <Card sx={{ ...styles.whatsappCard, backgroundColor: colorPalette.backgroundCardColor, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" sx={{...styles.sectionTitle, color: colorPalette.textColor }}>
                <WhatsApp sx={{...styles.whatsappIcon, color: colorPalette.successColor }} />
                WhatsApp Manager
              </Typography>

              <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                {/* Lista de Contatos */}
                <Grid item xs={12} sm={5}>
                  <Typography variant="subtitle2" gutterBottom sx={{ color: colorPalette.textColor }}>Contatos</Typography>
                  <List sx={{ 
                    maxHeight: { xs: '250px', sm: '600px' }, 
                    overflow: 'auto',
                    overflowY: 'scroll',
                    border: { xs: `1px solid ${colorPalette.borderColor}`, sm: 'none' },
                    borderRadius: { xs: 1, sm: 0 },
                    minHeight: '200px',
                    backgroundColor: colorPalette.backgroundColor,
                    '&::-webkit-scrollbar': {
                      width: '8px'
                    },
                    '&::-webkit-scrollbar-track': {
                      background: colorPalette.backgroundColor,
                      borderRadius: '4px'
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: colorPalette.secondaryColor,
                      borderRadius: '4px',
                      '&:hover': {
                        background: colorPalette.primaryColor,
                      }
                    }
                  }}>
                    {contacts.length === 0 ? (
                      <Box sx={{ textAlign: 'center', p: 3, color: colorPalette.textSecondaryColor }}>
                        <Typography variant="body2">
                          Nenhum contato disponível
                        </Typography>
                      </Box>
                    ) : (
                      contacts.map((contact) => (
                        <ListItem
                          key={contact.id}
                          button
                          selected={selectedContact?.id === contact.id}
                          onClick={() => onSelectContact(contact)}
                          sx={{
                            ...styles.contactItem,
                            backgroundColor: colorPalette.backgroundCardColor,
                            borderBottom: `1px solid ${colorPalette.borderColor}`,
                            py: { xs: 1, sm: 1.5 },
                            '&.Mui-selected': {
                              backgroundColor: colorPalette.hoverColor,
                            },
                            '&:hover': {
                                backgroundColor: colorPalette.hoverColor,
                            }
                          }}
                        >
                          <ListItemAvatar>
                            <Badge
                              badgeContent={getContactMessages(contact.id).length}
                              color="primary"
                              sx={{
                                '& .MuiBadge-badge': {
                                  backgroundColor: colorPalette.primaryColor,
                                  color: colorPalette.textColor,
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
                                <Avatar sx={{ width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 }, backgroundColor: colorPalette.primaryColor, color: colorPalette.textColor }}>
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
                                fontWeight: 500,
                                color: colorPalette.textColor,
                              },
                              '& .MuiListItemText-secondary': {
                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                color: colorPalette.textSecondaryColor
                              }
                            }}
                          />
                        </ListItem>
                      ))
                    )}
                  </List>
                </Grid>

                {/* Chat */}
                <Grid item xs={12} sm={7}>
                  {selectedContact ? (
                    <Box sx={styles.chatContainer}>
                      <Typography variant="subtitle2" gutterBottom sx={{ color: colorPalette.textColor }}>
                        Chat com {selectedContact.name}
                      </Typography>
                      
                      <Box sx={{ 
                        ...styles.messagesArea, 
                        maxHeight: { xs: '300px', sm: '500px' },
                        minHeight: { xs: '200px', sm: '300px' },
                        display: 'flex',
                        flexDirection: 'column-reverse',
                        gap: 1,
                        backgroundColor: colorPalette.backgroundColor,
                      }}>
                        {getContactMessages(selectedContact.id).length === 0 ? (
                          <Box sx={{ textAlign: 'center', p: 3, color: colorPalette.textSecondaryColor }}>
                            <Typography variant="body2">
                              Nenhuma mensagem encontrada
                            </Typography>
                          </Box>
                        ) : (
                          getContactMessages(selectedContact.id).map((msg) => (
                            <Card
                              key={msg.id}
                              sx={{
                                ...styles.messageCard,
                                ...(msg.sent ? { ...styles.sentMessage, backgroundColor: colorPalette.primaryColor, color: colorPalette.textColor } : { ...styles.receivedMessage, backgroundColor: colorPalette.secondaryColor, color: colorPalette.textColor })
                              }}
                            >
                              <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                                <Typography variant="body2">{msg.message}</Typography>
                                <Typography variant="caption" sx={{ color: colorPalette.textSecondaryColor }}>
                                  {msg.timestamp}
                                </Typography>
                              </CardContent>
                            </Card>
                          ))
                        )}
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
                            ...styles.messageInput,
                            mb: { xs: 1, sm: 0 },
                             '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: colorPalette.primaryColor,
                                },
                                '&:hover fieldset': {
                                    borderColor: colorPalette.secondaryColor,
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: colorPalette.textColor,
                            },
                            '& .MuiInputBase-input': {
                                color: colorPalette.textColor,
                            }
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
                            ...styles.sendButton,
                            minWidth: { xs: '100%', sm: 'auto' },
                            height: { xs: '40px', sm: 'auto' },
                            background: `linear-gradient(135deg, ${colorPalette.primaryColor} 0%, ${colorPalette.secondaryColor} 100%)`,
                            color: colorPalette.textColor,
                            '&:hover': {
                              background: `linear-gradient(135deg, ${colorPalette.secondaryColor} 0%, ${colorPalette.primaryColor} 100%)`
                            }
                          }}
                        >
                          <Send sx={{ mr: { xs: 1, sm: 0 } }} />
                          <Box sx={{ display: { xs: 'inline', sm: 'none' } }}>Enviar</Box>
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{
                      ...styles.emptyChat,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: '400px',
                      textAlign: 'center',
                      color: colorPalette.textSecondaryColor,
                      backgroundColor: colorPalette.backgroundColor,
                    }}>
                      <Box>
                        <WhatsApp sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                        <Typography variant="h6" gutterBottom sx={{ color: colorPalette.textColor }}>
                          Selecione um contato
                        </Typography>
                        <Typography variant="body2">
                          Escolha um contato da lista para iniciar uma conversa
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Grid>
              </Grid>

              <Box sx={{...styles.tip, color: colorPalette.textColor, backgroundColor: colorPalette.backgroundColor }}>
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