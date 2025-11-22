import React from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Card,
  IconButton,
  Chip
} from '@mui/material';
import { Send, Clear, SmartToy, Add, Person, Psychology } from '@mui/icons-material';
import { aiPromptStyles } from './AiPromptPresentational.styles';

const AIPromptPresentational = ({
  prompt,
  loading,
  history,
  conversations,
  activeConversation,
  onPromptChange,
  onSubmit,
  onClearHistory,
  onSelectConversation,
  onNewConversation
}) => {
  return (
    <Box sx={aiPromptStyles.container}>
      <Box sx={aiPromptStyles.content}>
        <Box sx={aiPromptStyles.header}>
          <SmartToy sx={aiPromptStyles.headerIcon} />
          <Typography variant="h4" component="h1" sx={aiPromptStyles.title}>
            AI Assistant
          </Typography>
        </Box>

        <Box sx={aiPromptStyles.mainLayout}>
          {/* Seção Principal - Chat */}
          <Box sx={aiPromptStyles.chatSection}>
            {/* Área de Conversação */}
            <Card sx={aiPromptStyles.conversationCard}>
              <Typography variant="h6" sx={aiPromptStyles.historyTitle}>
                Conversação Atual
              </Typography>
              
              <Box sx={aiPromptStyles.conversationArea}>
                {history.length === 0 ? (
                  <Box sx={aiPromptStyles.emptyState}>
                    <SmartToy sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                    <Typography>Inicie uma conversa com a IA</Typography>
                  </Box>
                ) : (
                  history.slice().reverse().map((entry) => (
                    <React.Fragment key={entry.id}>
                      {/* Mensagem do Usuário */}
                      <Box sx={aiPromptStyles.messageUser}>
                        <Box sx={aiPromptStyles.messageHeader}>
                          <Box sx={aiPromptStyles.userAvatar}>
                            <Person sx={{ fontSize: 14 }} />
                          </Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            Você
                          </Typography>
                          <Typography sx={aiPromptStyles.timestamp}>
                            {entry.timestamp}
                          </Typography>
                        </Box>
                        <Typography variant="body2">
                          {entry.prompt}
                        </Typography>
                      </Box>
                      
                      {/* Resposta da IA */}
                      <Box sx={aiPromptStyles.messageAi}>
                        <Box sx={aiPromptStyles.messageHeader}>
                          <Box sx={aiPromptStyles.aiAvatar}>
                            <Psychology sx={{ fontSize: 14 }} />
                          </Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            IA Assistant
                          </Typography>
                        </Box>
                        <Typography variant="body2">
                          {entry.response}
                        </Typography>
                      </Box>
                    </React.Fragment>
                  ))
                )}
              </Box>
            </Card>
            
            {/* Formulário de Prompt */}
            <Card sx={aiPromptStyles.promptCard}>
              <Box component="form" onSubmit={onSubmit}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  variant="outlined"
                  label="Digite sua pergunta ou comando para a IA"
                  value={prompt}
                  onChange={(e) => onPromptChange(e.target.value)}
                  disabled={loading}
                  sx={{ ...aiPromptStyles.textField, mb: 2 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
                    disabled={loading || !prompt.trim()}
                    sx={aiPromptStyles.sendButton}
                  >
                    {loading ? 'Processando...' : 'Enviar'}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Clear />}
                    onClick={onClearHistory}
                    disabled={history.length === 0}
                    sx={aiPromptStyles.clearButton}
                  >
                    Limpar Conversa
                  </Button>
                </Box>
              </Box>
            </Card>
          </Box>

          {/* Seção de Histórico */}
          <Box sx={aiPromptStyles.historySection}>
            <Card sx={aiPromptStyles.historyCard}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={aiPromptStyles.historyTitle}>
                  Histórico
                </Typography>
                <IconButton 
                  onClick={onNewConversation}
                  sx={{ 
                    background: 'rgba(102, 126, 234, 0.1)',
                    '&:hover': { background: 'rgba(102, 126, 234, 0.2)' }
                  }}
                >
                  <Add sx={{ color: '#667eea' }} />
                </IconButton>
              </Box>
              
              <Box sx={aiPromptStyles.historyList}>
                {conversations.length === 0 ? (
                  <Box sx={aiPromptStyles.emptyState}>
                    <Typography variant="body2">
                      Nenhuma conversa salva
                    </Typography>
                  </Box>
                ) : (
                  <List>
                    {conversations.map((conversation) => (
                      <ListItem
                        key={conversation.id}
                        sx={{
                          ...aiPromptStyles.historyItem,
                          ...(activeConversation === conversation.id && {
                            background: 'rgba(102, 126, 234, 0.15)',
                            borderColor: '#667eea'
                          })
                        }}
                        onClick={() => onSelectConversation(conversation.id)}
                      >
                        <ListItemText
                          primary={
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                              {conversation.title}
                            </Typography>
                          }
                          secondary={
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Última mensagem: {conversation.lastMessage}
                              </Typography>
                              <Chip 
                                label={`${conversation.messages.length} mensagens`}
                                size="small"
                                sx={{ 
                                  mt: 0.5,
                                  height: 20,
                                  fontSize: 10,
                                  background: 'rgba(102, 126, 234, 0.1)',
                                  color: '#667eea'
                                }}
                              />
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>
            </Card>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AIPromptPresentational;