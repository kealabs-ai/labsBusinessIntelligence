export const toolbarStyles = {
  toolbar: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  },
  
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    px: 3,
    py: 2
  },
  
  logo: {
    display: 'flex',
    alignItems: 'center'
  },
  
  logoImage: {
    height: 60,
    width: 'auto',
    maxWidth: 210,
    objectFit: 'contain'
  },
  
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 2
  },
  

  
  menuButton: {
    color: 'white',
    width: 48,
    height: 48,
    mx: 2,
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.1)'
    }
  },
  
  menu: {
    '& .MuiPaper-root': {
      borderRadius: 2,
      boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      mt: 1
    }
  },
  
  menuItem: {
    py: 1.5,
    px: 2,
    '&:hover': {
      background: 'rgba(102, 126, 234, 0.1)'
    }
  }
};