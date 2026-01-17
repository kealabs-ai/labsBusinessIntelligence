import React, { useState, useEffect } from 'react';
import { useAuth } from '../../services/AuthContext';
import { useColorPalette } from '../../utils/useColorPalette';
import ToolbarPresentational from '../../components/presentational/ToolbarPresentational';

const ToolbarContainer = () => {
  const { user, logout } = useAuth();
  const colorPalette = useColorPalette();

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