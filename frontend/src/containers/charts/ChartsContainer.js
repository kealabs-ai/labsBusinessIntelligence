import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  IconButton,
  Typography,
  CssBaseline
} from '@mui/material';
import { Menu as MenuIcon, ChevronLeft, Dashboard, BarChart, PieChart } from '@mui/icons-material';
import { chartService } from '../../services/chartService';
import ChartsPresentational from '../../components/presentational/ChartsPresentational';
import ToolbarContainer from '../toolbar/ToolbarContainer';

const drawerWidth = 240;

const ChartsContainer = () => {
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [areaData, setAreaData] = useState([]);
  const [scatterData, setScatterData] = useState([]);
  const [kpiData, setKpiData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeKPI, setActiveKPI] = useState('gastos');

  const loadChartData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const [barResponse, pieResponse, lineResponse, areaResponse, scatterResponse, kpiResponse] = await Promise.all([
        chartService.getBarChartData(filters),
        chartService.getPieChartData(filters),
        chartService.getLineChartData(filters),
        chartService.getAreaChartData(filters),
        chartService.getScatterChartData(filters),
        chartService.getKPIData(filters)
      ]);
      
      setBarData(barResponse.data || []);
      setPieData(pieResponse.data || []);
      setLineData(lineResponse.data || []);
      setAreaData(areaResponse.data || []);
      setScatterData(scatterResponse.data || []);
      setKpiData(kpiResponse.data || {});
    } catch (err) {
      setError('Erro ao carregar dados dos gráficos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChartData();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const menuItems = [
    { id: 'gastos', label: 'KPIs de Gastos', icon: <Dashboard /> },
    { id: 'consumo', label: 'KPIs de Consumo', icon: <BarChart /> },
    { id: 'receita', label: 'KPIs de Receita e Despesa', icon: <PieChart /> }
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: '100%',
          margin: 0,
          backgroundColor: '#1e293b',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Business Intelligence Dashboard
          </Typography>
          <ToolbarContainer onFilterChange={handleFilterChange} />
        </Toolbar>
      </AppBar>
      
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#1e293b',
            color: 'white',
          },
        }}
        variant="temporary"
        anchor="left"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
            KeaLabs
          </Typography>
        </Toolbar>
        <List sx={{ pt: 0, px: 1 }}>
          {menuItems.map((item) => (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={activeKPI === item.id}
                onClick={() => setActiveKPI(item.id)}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(59, 130, 246, 0.12)',
                    color: '#3b82f6',
                    '&:hover': {
                      backgroundColor: 'rgba(59, 130, 246, 0.16)',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: 2,
                  },
                  py: 1.5,
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <ListItemIcon sx={{ 
                  color: activeKPI === item.id ? '#3b82f6' : 'rgba(255, 255, 255, 0.7)',
                  minWidth: 40
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label} 
                  sx={{ 
                    '& .MuiListItemText-primary': {
                      fontSize: '0.875rem',
                      fontWeight: activeKPI === item.id ? 600 : 400,
                      color: activeKPI === item.id ? '#3b82f6' : 'rgba(255, 255, 255, 0.9)',
                    }
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
          p: 3,
          width: '100%',
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100vh',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)',
            pointerEvents: 'none'
          }
        }}
      >
        <Toolbar />
        <ChartsPresentational
          barData={barData}
          pieData={pieData}
          lineData={lineData}
          areaData={areaData}
          scatterData={scatterData}
          kpiData={kpiData}
          loading={loading}
          error={error}
          onRefresh={loadChartData}
          activeKPI={activeKPI}
        />
      </Box>
    </Box>
  );
};

export default ChartsContainer;