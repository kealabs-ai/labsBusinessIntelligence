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
    maxWidth: 'lg',
    mx: 'auto',
    px: 3,
    py: 2
  },
  
  logo: {
    display: 'flex',
    alignItems: 'center'
  },
  
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    mr: 2
  },
  
  logoText: {
    color: 'white',
    fontWeight: 700,
    fontSize: 20
  },
  
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 2
  },
  
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    color: 'white'
  },
  
  avatar: {
    width: 40,
    height: 40,
    background: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    fontWeight: 600
  },
  
  userName: {
    fontWeight: 500,
    display: { xs: 'none', sm: 'block' }
  },
  
  menuButton: {
    color: 'white',
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