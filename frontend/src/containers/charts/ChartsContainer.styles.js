export const chartsStyles = {
  container: {
    display: 'flex',
    minHeight: '100vh'
  },
  
  appBar: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  },
  
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  
  menuButton: {
    mr: 2,
    color: 'white',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.1)'
    }
  },
  
  appTitle: {
    flexGrow: 1,
    fontWeight: 700,
    color: 'white'
  },
  
  drawer: {
    width: 240,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      width: 240,
      boxSizing: 'border-box',
      background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      borderRight: 'none'
    }
  },
  
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    p: 2,
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  },
  
  drawerTitle: {
    color: 'white',
    fontWeight: 700,
    fontSize: 20
  },
  
  menuList: {
    pt: 2,
    px: 1
  },
  
  menuItem: {
    mb: 0.5
  },
  
  menuButton: {
    borderRadius: 2,
    mx: 1,
    py: 1.5,
    transition: 'all 0.3s ease',
    '&.Mui-selected': {
      background: 'rgba(255, 255, 255, 0.15)',
      '&:hover': {
        background: 'rgba(255, 255, 255, 0.2)'
      }
    },
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.1)'
    }
  },
  
  menuIcon: {
    color: 'rgba(255, 255, 255, 0.9)',
    minWidth: 40
  },
  
  menuText: {
    '& .MuiListItemText-primary': {
      fontSize: '0.875rem',
      fontWeight: 500,
      color: 'rgba(255, 255, 255, 0.9)'
    }
  },
  
  mainContent: {
    flexGrow: 1,
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    minHeight: '100vh',
    position: 'relative'
  }
};