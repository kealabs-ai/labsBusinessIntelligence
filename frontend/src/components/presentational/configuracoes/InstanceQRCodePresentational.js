
import React from 'react';
import { Box, Typography, Button, Card, CardContent, Paper, CircularProgress } from '@mui/material';
import { QrCode2 } from '@mui/icons-material';

const InstanceQRCodePresentational = ({ onCreate, qrCodeUrl, loading, error }) => (
  <Box sx={{ p: 3 }}>
    <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <QrCode2 sx={{ fontSize: 32, color: 'white' }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: 'white' }}>
            Criar Nova Instância Evolution API
          </Typography>
        </Box>
      </CardContent>
    </Card>
    <Paper sx={{ p: 4, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.08)', maxWidth: 480, mx: 'auto', textAlign: 'center' }}>
      <Typography sx={{ mb: 3 }}>
        Clique no botão abaixo para gerar o QR Code de criação de uma nova instância no Evolution API.
      </Typography>
      <Button variant="contained" color="primary" onClick={onCreate} disabled={loading} sx={{ minWidth: 180, fontWeight: 600 }}>
        Gerar QR Code
      </Button>
      {loading && <CircularProgress sx={{ mt: 3 }} />}
      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
      {qrCodeUrl && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>Escaneie o QR Code abaixo no Evolution API:</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <img src={qrCodeUrl} alt="QR Code Instância Evolution" style={{ maxWidth: 300, border: '1px solid #eee', borderRadius: 8, background: '#fff', padding: 8 }} />
          </Box>
        </Box>
      )}
    </Paper>
  </Box>
);

export default InstanceQRCodePresentational;
