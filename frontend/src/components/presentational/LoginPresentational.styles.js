import { COLOR_PALETTES } from '../../utils/colorPalettes';

export const getLoginStyles = (palette = 'KEA_LABS') => {
  const colors = COLOR_PALETTES[palette];
  
  return {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: colors.gradient,
      padding: 2
    },
    
    loginCard: {
      padding: 4,
      borderRadius: 3,
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      background: `${colors.surface}F2`,
      backdropFilter: 'blur(10px)',
      border: `1px solid ${colors.primary}33`,
      maxWidth: 400,
      width: '100%'
    },
    
    logo: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      mb: 3
    },
    
    logoImage: {
      width: 120,
      height: 'auto',
      maxHeight: 80,
      objectFit: 'contain',
      mb: 2
    },
    
    subtitle: {
      textAlign: 'center',
      color: colors.textSecondary,
      mb: 3,
      fontWeight: 300
    },
    
    textField: {
      '& .MuiOutlinedInput-root': {
        borderRadius: 2,
        '&:hover fieldset': {
          borderColor: colors.primary
        },
        '&.Mui-focused fieldset': {
          borderColor: colors.primary
        }
      }
    },
    
    submitButton: {
      mt: 3,
      mb: 2,
      height: 48,
      borderRadius: 2,
      background: colors.gradient,
      fontWeight: 600,
      fontSize: 16,
      '&:hover': {
        background: `linear-gradient(135deg, ${colors.primary}E6 0%, ${colors.secondary}E6 100%)`,
        transform: 'translateY(-1px)',
        boxShadow: `0 4px 12px ${colors.primary}66`
      },
      transition: 'all 0.3s ease'
    },
    
    errorAlert: {
      mb: 2,
      borderRadius: 2
    },
    
    loadingSpinner: {
      color: colors.surface
    }
  };
};

export const loginStyles = getLoginStyles();