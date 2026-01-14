import React, { useState, useEffect } from 'react';
import { useAuth } from '../../services/AuthContext';
import { colorPaletteService } from '../../services/colorPaletteService';
import ToolbarPresentational from '../../components/presentational/ToolbarPresentational';

const ToolbarContainer = () => {
  const { user, logout } = useAuth();
  const [colorPalette, setColorPalette] = useState('KEA_LABS');

  useEffect(() => {
    const fetchColorPalette = async () => {
      const palette = await colorPaletteService.getColorPalette();
      setColorPalette(palette);
    };
    
    fetchColorPalette();
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <ToolbarPresentational
      user={user}
      onLogout={handleLogout}
      colorPalette={colorPalette}
    />
  );
};

export default ToolbarContainer;