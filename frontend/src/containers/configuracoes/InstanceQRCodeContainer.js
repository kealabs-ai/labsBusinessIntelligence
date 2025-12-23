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
      const result = await instanceService.createInstance({});
      setQrCodeUrl(result.qrCodeUrl || result.qr_code_url || result.qrcode_url || result.qr_code || result.qr);
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
