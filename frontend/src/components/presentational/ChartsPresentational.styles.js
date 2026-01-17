import { COLOR_PALETTES } from '../../utils/colorPalettes';

export const getChartsPresentationalStyles = (palette = 'KEA_LABS') => {
  const colors = COLOR_PALETTES[palette];
  
  return {
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
      background: `${colors.surface}E6`,
      backdropFilter: 'blur(10px)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      border: `1px solid ${colors.primary}33`
    },
    
    title: {
      fontWeight: 700,
      background: colors.gradient,
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    
    refreshButton: {
      borderRadius: 2,
      background: colors.gradient,
      color: colors.surface,
      fontWeight: 600,
      '&:hover': {
        background: `linear-gradient(135deg, ${colors.primary}E6 0%, ${colors.secondary}E6 100%)`,
        transform: 'translateY(-1px)',
        boxShadow: `0 4px 12px ${colors.primary}66`
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
      background: `${colors.surface}E6`,
      borderRadius: 3,
      backdropFilter: 'blur(10px)'
    },
    
    loadingSpinner: {
      color: colors.primary
    },
    
    loadingText: {
      mt: 2,
      color: colors.primary,
      fontWeight: 500
    },
    
    errorContainer: {
      p: 4
    },
    
    errorAlert: {
      borderRadius: 2,
      background: `${colors.surface}F2`,
      backdropFilter: 'blur(10px)'
    },
    
    kpiCard: {
      background: `${colors.surface}F2`,
      backdropFilter: 'blur(10px)',
      borderRadius: 3,
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      border: `1px solid ${colors.primary}33`,
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
      color: colors.surface,
      background: colors.gradient,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    
    kpiValue: {
      fontWeight: 700,
      color: colors.text,
      mb: 0.5
    },
    
    kpiTitle: {
      color: colors.textSecondary,
      fontWeight: 500
    },
    
    chartCard: {
      p: 3,
      borderRadius: 3,
      background: `${colors.surface}F2`,
      backdropFilter: 'blur(10px)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      border: `1px solid ${colors.primary}33`,
      transition: 'all 0.3s ease',
      width: '100%',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 16px 48px rgba(0,0,0,0.15)'
      }
    },
    
    chartTitle: {
      fontWeight: 600,
      color: colors.text,
      mb: 2
    },
    
    chartContainer: {
      width: '100%',
      height: '85%'
    },
    
    tooltip: {
      backgroundColor: `${colors.surface}F2`,
      border: 'none',
      borderRadius: 8,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      backdropFilter: 'blur(10px)'
    }
  };
};

export const chartsPresentationalStyles = getChartsPresentationalStyles();