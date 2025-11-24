import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import MenuPresentational from '../../components/presentational/MenuPresentational';
import ToolbarContainer from '../toolbar/ToolbarContainer';

const MenuContainer = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const menuItems = [
    {
      title: 'Dashboards',
      description: 'Visualize dados em Dashboards interativos',
      path: '/charts',
      icon: 'BarChart'
    },
    {
      title: 'AI Assistant',
      description: 'Interaja com agentes de IA para análise de dados',
      path: '/ai-prompt',
      icon: 'SmartToy'
    },
    {
      title: 'Agenda',
      description: 'Gerencie compromissos, calendário e notificações WhatsApp',
      path: '/agenda',
      icon: 'CalendarToday'
    },
    {
      title: 'Administrador',
      description: 'Gerencie usuários, permissões e módulos do sistema',
      path: '/admin',
      icon: 'AdminPanelSettings',
      adminOnly: true
    }
  ];

  const handleMenuClick = (path) => {
    navigate(path);
  };

  return (
    <>
      <ToolbarContainer />
      <MenuPresentational
        menuItems={menuItems}
        onMenuClick={handleMenuClick}
        user={user}
      />
    </>
  );
};

export default MenuContainer;