export const menuStyles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    pt: 0
  },
  
  content: {
    maxWidth: 'lg',
    mx: 'auto',
    px: 3,
    py: 4
  },
  
  header: {
    mb: 4,
    textAlign: 'center'
  },
  
  title: {
    fontWeight: 700,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    mb: 1
  },
  
  subtitle: {
    color: 'text.secondary',
    fontWeight: 300
  },
  
  menuCard: {
    height: '100%',
    borderRadius: 3,
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 16px 48px rgba(0,0,0,0.15)'
    }
  },
  
  cardContent: {
    textAlign: 'center',
    p: 3
  },
  
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    mx: 'auto',
    mb: 2,
    color: 'white'
  },
  
  cardTitle: {
    fontWeight: 600,
    mb: 1,
    color: 'text.primary'
  },
  
  cardDescription: {
    color: 'text.secondary',
    lineHeight: 1.6
  },
  
  accessButton: {
    mt: 2,
    borderRadius: 2,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontWeight: 600,
    px: 4,
    py: 1.5,
    '&:hover': {
      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
    },
    transition: 'all 0.3s ease'
  }
};