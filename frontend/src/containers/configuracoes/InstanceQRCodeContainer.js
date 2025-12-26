import React, { useState } from 'react';
import InstanceQRCodePresentational from '../../components/presentational/configuracoes/InstanceQRCodePresentational';
import ToolbarContainer from '../toolbar/ToolbarContainer';
import { instanceService } from '../../services/instanceService';

const InstanceQRCodeContainer = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateInstance = async () => {
    setLoading(true);
    setError(null);
    setQrCodeUrl(null);
    try {
      const result = await instanceService.createInstance();
      // Processa o QR code base64 da resposta
      if (result.qrcode && result.qrcode.base64) {
        // O base64 já vem com o prefixo data:image/png;base64,
        setQrCodeUrl(result.qrcode.base64);
      } else {
        setError('QR Code não encontrado na resposta');
      }
    } catch (err) {
      setError(err.message || 'Erro ao criar instância');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToolbarContainer />
      <InstanceQRCodePresentational
        onCreate={handleCreateInstance}
        qrCodeUrl={qrCodeUrl}
        loading={loading}
        error={error}
      />
    </>
  );
};

export default InstanceQRCodeContainer;
