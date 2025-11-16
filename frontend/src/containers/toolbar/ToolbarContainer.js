import React, { useState } from 'react';
import { useAuth } from '../../services/AuthContext';
import ToolbarPresentational from '../../components/presentational/ToolbarPresentational';

const ToolbarContainer = ({ onFilterChange }) => {
  const { user, logout } = useAuth();
  const [filters, setFilters] = useState({});

  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <ToolbarPresentational
      user={user}
      filters={filters}
      onFilterChange={handleFilterChange}
      onLogout={handleLogout}
    />
  );
};

export default ToolbarContainer;