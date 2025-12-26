import React, { useState } from 'react';
import InstanceQRCodePresentational from '../../components/presentational/configuracoes/InstanceQRCodePresentational';
import ToolbarContainer from '../toolbar/ToolbarContainer';
import { instanceService } from '../../services/instanceService';

const InstanceQRCodeContainer = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);

  const handleCreateInstance = async () => {
    setLoading(true);
    setError(null);
    setQrCodeUrl(null);
    try {
      const result = await instanceService.createInstance();
      
      if (result.qrcode) {
        setQrCodeUrl(result.qrcode);
      } else {
        setError('QR Code não encontrado na resposta');
      }
    } catch (err) {
      setError(err.message || 'Erro ao criar instância');
    } finally {
      setLoading(false);
    }
  };

  const handleShowQRModal = () => setShowQRModal(true);
  const handleCloseQRModal = () => setShowQRModal(false);

  return (
    <>
      <ToolbarContainer />
      <InstanceQRCodePresentational
        onCreate={handleCreateInstance}
        qrCodeUrl={qrCodeUrl}
        loading={loading}
        error={error}
        onShowQRModal={handleShowQRModal}
        showQRModal={showQRModal}
        onCloseQRModal={handleCloseQRModal}
      />
    </>
  );
};

export default InstanceQRCodeContainer;
