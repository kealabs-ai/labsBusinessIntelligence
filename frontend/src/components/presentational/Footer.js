import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 2,
        mt: 'auto',
        backgroundColor: '#f5f5f5',
        borderTop: '1px solid #e0e0e0',
        position: 'relative',
        bottom: 0,
        width: '100%'
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} KEA Labs - Business Intelligence System. Todos os direitos reservados.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;