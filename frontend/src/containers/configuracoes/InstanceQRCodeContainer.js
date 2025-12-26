import React, { useState } from 'react';
import InstanceQRCodePresentational from '../../components/presentational/configuracoes/InstanceQRCodePresentational';
import ToolbarContainer from '../toolbar/ToolbarContainer';
import { instanceService } from '../../services/instanceService';
import { whatsappInstanceService } from '../../services/whatsappInstanceService';
import { useAuth } from '../../services/AuthContext';

const InstanceQRCodeContainer = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const handleCreateInstance = async () => {
    setLoading(true);
    setError(null);
    setQrCodeUrl(null);
    try {
      // 1. Criar instância na Evolution API
      const result = await instanceService.createInstance();
      
      // 2. Processar QR code
      if (result.qrcode && result.qrcode.base64) {
        setQrCodeUrl(result.qrcode.base64);
        
        // 3. Salvar instância no banco de dados
        const instanceData = {
          user_id: user?.id,
          kea_client_id: localStorage.getItem('kea_client_id') || null,
          instance_name: result.instanceName,
          qr_code: result.qrcode.base64,
          status: false
        };
        
        await whatsappInstanceService.createInstance(instanceData);
        console.log('Instância salva no banco de dados');
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
