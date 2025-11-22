export const aiPromptStyles = {
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
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
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
  
  mainLayout: {
    display: 'flex',
    gap: 3,
    height: 'calc(100vh - 200px)'
  },
  
  chatSection: {
    flex: 2,
    display: 'flex',
    flexDirection: 'column'
  },
  
  historySection: {
    flex: 1,
    minWidth: 300
  },
  
  promptCard: {
    borderRadius: 3,
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    p: 3,
    mb: 3
  },
  
  conversationCard: {
    borderRadius: 3,
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    p: 3,
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  
  historyCard: {
    borderRadius: 3,
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    p: 3,
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
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
  
  sendButton: {
    borderRadius: 2,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontWeight: 600,
    px: 4,
    '&:hover': {
      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
    },
    transition: 'all 0.3s ease'
  },
  
  clearButton: {
    borderRadius: 2,
    borderColor: '#667eea',
    color: '#667eea',
    fontWeight: 600,
    '&:hover': {
      borderColor: '#5a6fd8',
      background: 'rgba(102, 126, 234, 0.05)'
    }
  },
  
  conversationArea: {
    flexGrow: 1,
    overflow: 'auto',
    mb: 2,
    p: 2,
    borderRadius: 2,
    background: 'rgba(245, 245, 245, 0.3)',
    border: '1px solid rgba(102, 126, 234, 0.1)'
  },
  
  messageUser: {
    mb: 2,
    p: 2,
    borderRadius: 2,
    background: 'rgba(102, 126, 234, 0.1)',
    borderLeft: '4px solid #667eea',
    ml: 4
  },
  
  messageAi: {
    mb: 2,
    p: 2,
    borderRadius: 2,
    background: 'rgba(16, 185, 129, 0.1)',
    borderLeft: '4px solid #10b981',
    mr: 4
  },
  
  messageHeader: {
    display: 'flex',
    alignItems: 'center',
    mb: 1
  },
  
  userAvatar: {
    width: 24,
    height: 24,
    borderRadius: '50%',
    background: '#667eea',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 600,
    mr: 1
  },
  
  aiAvatar: {
    width: 24,
    height: 24,
    borderRadius: '50%',
    background: '#10b981',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 600,
    mr: 1
  },
  
  timestamp: {
    fontSize: 12,
    color: 'text.secondary',
    ml: 'auto'
  },
  
  historyTitle: {
    fontWeight: 600,
    mb: 2,
    color: '#1e293b'
  },
  
  historyList: {
    flexGrow: 1,
    overflow: 'auto'
  },
  
  historyItem: {
    borderRadius: 2,
    mb: 1,
    p: 2,
    background: 'rgba(102, 126, 234, 0.05)',
    border: '1px solid rgba(102, 126, 234, 0.1)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'rgba(102, 126, 234, 0.1)',
      transform: 'translateX(4px)'
    }
  },
  
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '200px',
    color: 'text.secondary',
    fontStyle: 'italic'
  }
};