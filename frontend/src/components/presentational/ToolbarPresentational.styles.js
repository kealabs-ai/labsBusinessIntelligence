import { COLOR_PALETTES } from '../../utils/colorPalettes';

export const getToolbarStyles = (palette = 'KEA_LABS') => {
  const colors = COLOR_PALETTES[palette];
  
  return {
    toolbar: {
      background: colors.gradient,
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      backdropFilter: 'blur(10px)',
      borderBottom: `1px solid ${colors.primary}20`,
      position: 'sticky',
      top: 0,
      zIndex: 1100
    },
    
    container: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      px: 3,
      py: 2,
      maxWidth: '100%'
    },
    
    logo: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'scale(1.05)'
      }
    },
    
    logoImage: {
      height: 60,
      width: 'auto',
      maxWidth: 210,
      objectFit: 'contain',
      filter: 'brightness(1.1)'
    },
    
    userSection: {
      display: 'flex',
      alignItems: 'center',
      gap: 2
    },
    
    userInfo: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      mr: 1
    },
    
    userName: {
      color: colors.surface,
      fontWeight: 600,
      fontSize: '0.9rem',
      lineHeight: 1.2
    },
    
    userRole: {
      color: `${colors.surface}CC`,
      fontSize: '0.75rem',
      fontWeight: 400
    },
    
    avatar: {
      width: 40,
      height: 40,
      background: `${colors.surface}33`,
      color: colors.surface,
      fontWeight: 600,
      border: `2px solid ${colors.surface}4D`,
      transition: 'all 0.3s ease',
      '&:hover': {
        background: `${colors.surface}4D`,
        transform: 'scale(1.1)'
      }
    },
    
    menuButton: {
      color: colors.surface,
      width: 48,
      height: 48,
      borderRadius: 2,
      transition: 'all 0.3s ease',
      '&:hover': {
        background: `${colors.surface}26`,
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
      }
    },
    
    menu: {
      '& .MuiPaper-root': {
        borderRadius: 3,
        boxShadow: '0 16px 48px rgba(0,0,0,0.15)',
        border: `1px solid ${colors.primary}33`,
        background: `${colors.surface}F2`,
        backdropFilter: 'blur(10px)',
        mt: 1,
        minWidth: 200
      }
    },
    
    menuItem: {
      py: 1.5,
      px: 3,
      borderRadius: 2,
      mx: 1,
      my: 0.5,
      transition: 'all 0.3s ease',
      '&:hover': {
        background: `${colors.primary}1A`,
        transform: 'translateX(4px)'
      }
    },
    
    menuItemIcon: {
      color: colors.primary,
      mr: 2,
      minWidth: 'auto'
    },
    
    menuItemText: {
      color: colors.text,
      fontWeight: 500
    },
    
    divider: {
      my: 1,
      mx: 2,
      background: `${colors.primary}33`
    },
    
    notificationBadge: {
      '& .MuiBadge-badge': {
        background: colors.error,
        color: colors.surface,
        fontWeight: 600,
        fontSize: '0.7rem',
        minWidth: 18,
        height: 18
      }
    },
    
    themeToggle: {
      color: colors.surface,
      width: 40,
      height: 40,
      borderRadius: 2,
      transition: 'all 0.3s ease',
      '&:hover': {
        background: `${colors.surface}26`,
        transform: 'rotate(180deg)'
      }
    }
  };
};

// Backward compatibility
export const toolbarStyles = getToolbarStyles();