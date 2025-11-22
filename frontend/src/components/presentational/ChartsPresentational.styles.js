export const chartsPresentationalStyles = {
  container: {
    p: 3,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    zIndex: 1
  },
  
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 4,
    p: 3,
    borderRadius: 3,
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  },
  
  title: {
    fontWeight: 700,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  
  refreshButton: {
    borderRadius: 2,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    fontWeight: 600,
    '&:hover': {
      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
    },
    transition: 'all 0.3s ease'
  },
  
  loadingContainer: {
    p: 4,
    textAlign: 'center',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 3,
    backdropFilter: 'blur(10px)'
  },
  
  loadingSpinner: {
    color: '#667eea'
  },
  
  loadingText: {
    mt: 2,
    color: '#667eea',
    fontWeight: 500
  },
  
  errorContainer: {
    p: 4
  },
  
  errorAlert: {
    borderRadius: 2,
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)'
  },
  
  kpiCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: 3,
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 16px 48px rgba(0,0,0,0.15)'
    }
  },
  
  kpiContent: {
    display: 'flex',
    alignItems: 'center',
    p: 3
  },
  
  kpiIcon: {
    borderRadius: 2,
    p: 1.5,
    mr: 2,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  
  kpiValue: {
    fontWeight: 700,
    color: '#1e293b',
    mb: 0.5
  },
  
  kpiTitle: {
    color: '#64748b',
    fontWeight: 500
  },
  
  chartCard: {
    p: 3,
    borderRadius: 3,
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease',
    width: '100%',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 16px 48px rgba(0,0,0,0.15)'
    }
  },
  
  chartTitle: {
    fontWeight: 600,
    color: '#1e293b',
    mb: 2
  },
  
  chartContainer: {
    width: '100%',
    height: '85%'
  },
  
  tooltip: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    border: 'none',
    borderRadius: 8,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    backdropFilter: 'blur(10px)'
  }
};