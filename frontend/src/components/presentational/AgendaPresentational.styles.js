export const agendaStyles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    pt: 0,
    pb: 4
  },
  
  content: {
    maxWidth: 'xl',
    mx: 'auto',
    px: 3,
    py: 4
  },
  
  header: {
    display: 'flex',
    alignItems: 'center',
    mb: 4,
    p: 3,
    borderRadius: 3,
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
  },
  
  headerIcon: {
    fontSize: 40,
    mr: 2,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  
  title: {
    fontWeight: 700,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  
  mainCard: {
    borderRadius: 3,
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    p: 3,
    height: '600px'
  },
  
  sectionTitle: {
    fontWeight: 600,
    mb: 2,
    display: 'flex',
    alignItems: 'center'
  },
  
  calendarIcon: {
    mr: 1,
    color: '#667eea'
  },
  
  whatsappIcon: {
    mr: 1,
    color: '#25D366'
  },
  
  addEventSection: {
    mb: 3,
    p: 2,
    borderRadius: 2,
    background: 'rgba(102, 126, 234, 0.05)',
    border: '1px solid rgba(102, 126, 234, 0.1)'
  },
  
  textField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      '&:hover fieldset': {
        borderColor: '#667eea'
      },
      '&.Mui-focused fieldset': {
        borderColor: '#667eea'
      }
    }
  },
  
  addButton: {
    borderRadius: 2,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontWeight: 600,
    '&:hover': {
      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
    },
    transition: 'all 0.3s ease'
  },
  
  eventItem: {
    borderRadius: 2,
    mb: 1,
    background: 'rgba(255, 255, 255, 0.8)',
    border: '1px solid rgba(102, 126, 234, 0.1)',
    '&:hover': {
      background: 'rgba(102, 126, 234, 0.05)'
    }
  },
  
  contactItem: {
    borderRadius: 2,
    mb: 1,
    background: 'rgba(255, 255, 255, 0.8)',
    border: '1px solid rgba(37, 211, 102, 0.2)',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'rgba(37, 211, 102, 0.05)',
      transform: 'translateX(4px)'
    },
    '&.Mui-selected': {
      background: 'rgba(37, 211, 102, 0.1)',
      borderColor: '#25D366'
    }
  },
  
  chatContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  
  messagesArea: {
    flexGrow: 1,
    maxHeight: '300px',
    overflow: 'auto',
    mb: 2,
    p: 1,
    borderRadius: 2,
    background: 'rgba(245, 245, 245, 0.5)'
  },
  
  messageCard: {
    mb: 1,
    borderRadius: 2,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  
  sentMessage: {
    ml: 2,
    bgcolor: 'rgba(102, 126, 234, 0.1)',
    borderLeft: '3px solid #667eea'
  },
  
  receivedMessage: {
    mr: 2,
    bgcolor: 'rgba(245, 245, 245, 0.8)',
    borderLeft: '3px solid #e0e0e0'
  },
  
  messageInput: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      '&:hover fieldset': {
        borderColor: '#25D366'
      },
      '&.Mui-focused fieldset': {
        borderColor: '#25D366'
      }
    }
  },
  
  sendButton: {
    borderRadius: 2,
    background: '#25D366',
    '&:hover': {
      background: '#20b858',
      transform: 'scale(1.05)'
    },
    transition: 'all 0.3s ease'
  },
  
  emptyChat: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: 'text.secondary',
    fontStyle: 'italic'
  },
  
  tip: {
    mt: 2,
    p: 2,
    borderRadius: 2,
    background: 'rgba(102, 126, 234, 0.05)',
    border: '1px solid rgba(102, 126, 234, 0.1)',
    color: 'text.secondary',
    fontStyle: 'italic'
  }
};