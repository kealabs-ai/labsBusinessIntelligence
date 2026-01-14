import { COLOR_PALETTES } from '../../utils/colorPalettes';

export const getMenuStyles = (palette = 'KEA_LABS') => {
  const colors = COLOR_PALETTES[palette];
  
  return {
    container: {
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.accent}40 100%)`,
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
      background: colors.gradient,
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      mb: 1
    },
    
    subtitle: {
      color: colors.textSecondary,
      fontWeight: 300
    },
    
    menuCard: {
      height: '100%',
      borderRadius: 3,
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      background: `${colors.surface}E6`,
      backdropFilter: 'blur(10px)',
      border: `1px solid ${colors.primary}33`,
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
      background: colors.gradient,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      mx: 'auto',
      mb: 2,
      color: colors.surface
    },
    
    cardTitle: {
      fontWeight: 600,
      mb: 1,
      color: colors.text
    },
    
    cardDescription: {
      color: colors.textSecondary,
      lineHeight: 1.6
    },
    
    accessButton: {
      mt: 2,
      borderRadius: 2,
      background: colors.gradient,
      fontWeight: 600,
      px: 4,
      py: 1.5,
      '&:hover': {
        background: `linear-gradient(135deg, ${colors.primary}E6 0%, ${colors.secondary}E6 100%)`,
        transform: 'translateY(-1px)',
        boxShadow: `0 4px 12px ${colors.primary}66`
      },
      transition: 'all 0.3s ease'
    }
  };
};

// Backward compatibility
export const menuStyles = getMenuStyles();