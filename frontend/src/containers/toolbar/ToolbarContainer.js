import React from 'react';
import { useAuth } from '../../services/AuthContext';
import ToolbarPresentational from '../../components/presentational/ToolbarPresentational';

const ToolbarContainer = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <ToolbarPresentational
      user={user}
      onLogout={handleLogout}
    />
  );
};

export default ToolbarContainer;