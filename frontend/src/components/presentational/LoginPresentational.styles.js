export const loginStyles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: 2
  },
  
  loginCard: {
    padding: 4,
    borderRadius: 3,
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    maxWidth: 400,
    width: '100%'
  },
  
  logo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    mb: 3
  },
  
  logoIcon: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    mr: 2
  },
  
  title: {
    fontWeight: 700,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textAlign: 'center'
  },
  
  subtitle: {
    textAlign: 'center',
    color: 'text.secondary',
    mb: 3,
    fontWeight: 300
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
  
  submitButton: {
    mt: 3,
    mb: 2,
    height: 48,
    borderRadius: 2,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontWeight: 600,
    fontSize: 16,
    '&:hover': {
      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
    },
    transition: 'all 0.3s ease'
  },
  
  errorAlert: {
    mb: 2,
    borderRadius: 2
  },
  
  loadingSpinner: {
    color: 'white'
  }
};