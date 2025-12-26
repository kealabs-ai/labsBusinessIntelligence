import React from 'react';
import { Box, Typography, Button, Card, CardContent, Paper, CircularProgress, IconButton, Tooltip, Modal } from '@mui/material';
import { QrCode2, HelpOutline, QrCodeScanner } from '@mui/icons-material';

const InstanceQRCodePresentational = ({ onCreate, qrCodeUrl, loading, error, onShowQRModal, showQRModal, onCloseQRModal }) => (
  <Box sx={{ p: 3 }}>
    <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <QrCode2 sx={{ fontSize: 32, color: 'white' }} />
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: 'white' }}>
              Criar Nova Instância Evolution API
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Instruções: 1. Clique em 'Gerar QR Code' 2. Escaneie o código com seu WhatsApp 3. Aguarde a conexão ser estabelecida">
              <IconButton sx={{ color: 'white' }}>
                <HelpOutline />
              </IconButton>
            </Tooltip>
            <IconButton sx={{ color: 'white' }} onClick={onShowQRModal}>
              <QrCodeScanner />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
    <Paper sx={{ p: 4, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.08)', maxWidth: 480, mx: 'auto', textAlign: 'center' }}>
      <Typography sx={{ mb: 3 }}>
        Clique no ícone QR Code na barra de título para gerar e visualizar o código.
      </Typography>
    </Paper>
    
    <Modal open={showQRModal} onClose={onCloseQRModal}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2, textAlign: 'center', minWidth: 400 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>Gerar QR Code da Instância</Typography>
        
        <Button 
          variant="contained" 
          color="primary" 
          onClick={onCreate} 
          disabled={loading} 
          sx={{ minWidth: 180, fontWeight: 600, mb: 3 }}
        >
          Gerar QR Code
        </Button>
        
        {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', mb: 2 }} />}
        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
        
        {qrCodeUrl && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>Escaneie o QR Code:</Typography>
            <img src={qrCodeUrl} alt="QR Code Modal" style={{ maxWidth: 350, border: '1px solid #eee', borderRadius: 8, background: '#fff', padding: 8 }} />
          </Box>
        )}
        
        <Button onClick={onCloseQRModal} variant="outlined">Fechar</Button>
      </Box>
    </Modal>
  </Box>
);
export default InstanceQRCodePresentational;
