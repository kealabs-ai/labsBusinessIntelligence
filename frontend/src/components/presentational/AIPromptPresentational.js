import React from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  IconButton
} from '@mui/material';
import { Send, Clear, SmartToy } from '@mui/icons-material';

const AIPromptPresentational = ({
  prompt,
  loading,
  history,
  onPromptChange,
  onSubmit,
  onClearHistory
}) => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <SmartToy sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
        <Typography variant="h4" component="h1">
          AI Assistant
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box component="form" onSubmit={onSubmit}>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            label="Digite sua pergunta ou comando para a IA"
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            disabled={loading}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <Send />}
              disabled={loading || !prompt.trim()}
            >
              {loading ? 'Processando...' : 'Enviar'}
            </Button>
            <Button
              variant="outlined"
              startIcon={<Clear />}
              onClick={onClearHistory}
              disabled={history.length === 0}
            >
              Limpar Histórico
            </Button>
          </Box>
        </Box>
      </Paper>

      {history.length > 0 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Histórico de Conversas
          </Typography>
          <List>
            {history.map((entry, index) => (
              <React.Fragment key={entry.id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={
                      <Box>
                        <Typography variant="subtitle2" color="primary">
                          Você ({entry.timestamp}):
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {entry.prompt}
                        </Typography>
                        <Typography variant="subtitle2" color="secondary">
                          IA:
                        </Typography>
                        <Typography variant="body2">
                          {entry.response}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < history.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
    </Container>
  );
};

export default AIPromptPresentational;