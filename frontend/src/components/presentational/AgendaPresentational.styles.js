export const agendaStyles = (colorPalette) => ({
  container: {
    minHeight: '100vh',
    background: colorPalette.backgroundColor,
    pt: 0,
    pb: 4
  },
  
  content: {
    maxWidth: 'xl',
    mx: 'auto',
    px: { xs: 2, sm: 3 },
    py: { xs: 2, sm: 4 }
  },
  
  header: {
    display: 'flex',
    alignItems: 'center',
    mb: { xs: 2, sm: 4 },
    p: { xs: 2, sm: 3 },
    borderRadius: 3,
    background: colorPalette.backgroundCardColor,
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    flexDirection: { xs: 'column', sm: 'row' },
    textAlign: { xs: 'center', sm: 'left' }
  },
  
  headerIcon: {
    fontSize: { xs: 32, sm: 40 },
    mr: { xs: 0, sm: 2 },
    mb: { xs: 1, sm: 0 },
    background: `linear-gradient(135deg, ${colorPalette.primaryColor} 0%, ${colorPalette.secondaryColor} 100%)`,
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  
  title: {
    fontWeight: 700,
    fontSize: { xs: '1.5rem', sm: '2.125rem' },
    background: `linear-gradient(135deg, ${colorPalette.primaryColor} 0%, ${colorPalette.secondaryColor} 100%)`,
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    color: colorPalette.textColor,
  },
  
  mainCard: {
    borderRadius: 3,
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    background: colorPalette.backgroundCardColor,
    backdropFilter: 'blur(10px)',
    border: `1px solid ${colorPalette.borderColor}`,
    p: { xs: 2, sm: 3 },
    height: { xs: 'auto', md: '900px' },
    minHeight: { xs: '600px', md: '900px' },
    color: colorPalette.textColor,
  },
  
  whatsappCard: {
    borderRadius: 3,
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    background: colorPalette.backgroundCardColor,
    backdropFilter: 'blur(10px)',
    border: `1px solid ${colorPalette.borderColor}`,
    p: { xs: 2, sm: 3 },
    height: { xs: 'auto', md: '900px' },
    minHeight: { xs: '600px', md: '900px' },
    color: colorPalette.textColor,
  },
  
  sectionTitle: {
    fontWeight: 600,
    mb: 2,
    display: 'flex',
    alignItems: 'center',
    color: colorPalette.textColor,
  },
  
  calendarIcon: {
    mr: 1,
    color: colorPalette.primaryColor,
  },
  
  whatsappIcon: {
    mr: 1,
    color: colorPalette.successColor,
  },
  
  addEventSection: {
    mb: 3,
    p: 2,
    borderRadius: 2,
    background: colorPalette.backgroundColor,
    border: `1px solid ${colorPalette.borderColor}`,
    color: colorPalette.textColor,
  },
  
  textField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      '&:hover fieldset': {
        borderColor: colorPalette.secondaryColor,
      },
      '&.Mui-focused fieldset': {
        borderColor: colorPalette.primaryColor,
      },
      color: colorPalette.textColor,
    },
    '& .MuiInputLabel-root': {
      color: colorPalette.textColor,
    },
  },
  
  addButton: {
    borderRadius: 2,
    background: `linear-gradient(135deg, ${colorPalette.primaryColor} 0%, ${colorPalette.secondaryColor} 100%)`,
    fontWeight: 600,
    color: colorPalette.buttonTextColor,
    '&:hover': {
      background: `linear-gradient(135deg, ${colorPalette.secondaryColor} 0%, ${colorPalette.primaryColor} 100%)`,
      transform: 'translateY(-1px)',
      boxShadow: `0 4px 12px ${colorPalette.primaryColor}66`,
    },
    transition: 'all 0.3s ease'
  },
  
  eventItem: {
    borderRadius: 2,
    mb: 1,
    background: colorPalette.backgroundCardColor,
    border: `1px solid ${colorPalette.borderColor}`,
    color: colorPalette.textColor,
    '&:hover': {
      background: colorPalette.hoverColor,
    }
  },
  
  contactItem: {
    borderRadius: 2,
    mb: 1,
    background: colorPalette.backgroundCardColor,
    border: `1px solid ${colorPalette.borderColor}`,
    transition: 'all 0.3s ease',
    color: colorPalette.textColor,
    '&:hover': {
      background: colorPalette.hoverColor,
      transform: 'translateX(4px)'
    },
    '&.Mui-selected': {
      background: colorPalette.hoverColor,
      borderColor: colorPalette.primaryColor,
    }
  },
  
  chatContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    color: colorPalette.textColor,
  },
  
  messagesArea: {
    flexGrow: 1,
    maxHeight: { xs: '300px', sm: '500px' },
    minHeight: { xs: '200px', sm: '300px' },
    overflow: 'auto',
    mb: 2,
    p: 1,
    borderRadius: 2,
    background: colorPalette.backgroundColor,
    color: colorPalette.textColor,
  },
  
  messageCard: {
    mb: 1,
    borderRadius: 2,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    color: colorPalette.textColor,
  },
  
  sentMessage: {
    ml: { xs: 1, sm: 2 },
    bgcolor: colorPalette.primaryColor,
    borderLeft: `3px solid ${colorPalette.secondaryColor}`,
    color: colorPalette.textColor,
  },
  
  receivedMessage: {
    mr: { xs: 1, sm: 2 },
    bgcolor: colorPalette.secondaryColor,
    borderLeft: `3px solid ${colorPalette.borderColor}`,
    color: colorPalette.textColor,
  },
  
  messageInput: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      '&:hover fieldset': {
        borderColor: colorPalette.secondaryColor,
      },
      '&.Mui-focused fieldset': {
        borderColor: colorPalette.primaryColor,
      },
      color: colorPalette.textColor,
    },
    '& .MuiInputBase-input': {
      color: colorPalette.textColor,
    }
  },
  
  sendButton: {
    borderRadius: 2,
    background: colorPalette.successColor,
    color: colorPalette.textColor,
    '&:hover': {
      background: colorPalette.primaryColor,
      transform: 'scale(1.05)'
    },
    transition: 'all 0.3s ease'
  },
  
  emptyChat: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: colorPalette.textSecondaryColor,
    fontStyle: 'italic'
  },
  
  tip: {
    mt: 2,
    p: 2,
    borderRadius: 2,
    background: colorPalette.backgroundColor,
    border: `1px solid ${colorPalette.borderColor}`,
    color: colorPalette.textSecondaryColor,
    fontStyle: 'italic'
  }
});