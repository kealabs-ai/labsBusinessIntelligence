import { styled } from '@mui/material/styles';
import { Box, Card } from '@mui/material';

export const ConfigContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  height: 'calc(100vh - 140px)',
  overflow: 'auto',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
}));

export const ConfigCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  marginBottom: theme.spacing(2),
}));

export const TabContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiTabs-root': {
    minHeight: 48,
    '& .MuiTab-root': {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '0.9rem',
      minHeight: 48,
      padding: theme.spacing(1, 2),
      '&.Mui-selected': {
        color: theme.palette.primary.main,
      },
    },
    '& .MuiTabs-indicator': {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      height: 3,
      borderRadius: '3px 3px 0 0',
    },
  },
}));