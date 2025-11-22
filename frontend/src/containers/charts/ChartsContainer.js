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
import { Menu as MenuIcon, Dashboard, BarChart, PieChart } from '@mui/icons-material';
import { chartService } from '../../services/chartService';
import ChartsPresentational from '../../components/presentational/ChartsPresentational';
import ToolbarContainer from '../toolbar/ToolbarContainer';
import { chartsStyles } from './ChartsContainer.styles';

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
    <Box sx={chartsStyles.container}>
      <CssBaseline />
      <AppBar position="fixed" sx={chartsStyles.appBar}>
        <Toolbar sx={chartsStyles.toolbar}>
          <IconButton
            onClick={() => setSidebarOpen(!sidebarOpen)}
            edge="start"
            sx={chartsStyles.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={chartsStyles.appTitle}>
            Business Intelligence Dashboard
          </Typography>
          <ToolbarContainer />
        </Toolbar>
      </AppBar>
      
      <Drawer
        sx={chartsStyles.drawer}
        variant="temporary"
        anchor="left"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <Box sx={chartsStyles.drawerHeader}>
          <Typography variant="h6" sx={chartsStyles.drawerTitle}>
            Labs BI
          </Typography>
        </Box>
        <List sx={chartsStyles.menuList}>
          {menuItems.map((item) => (
            <ListItem key={item.id} disablePadding sx={chartsStyles.menuItem}>
              <ListItemButton
                selected={activeKPI === item.id}
                onClick={() => setActiveKPI(item.id)}
                sx={chartsStyles.menuButton}
              >
                <ListItemIcon sx={chartsStyles.menuIcon}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label} 
                  sx={chartsStyles.menuText}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      
      <Box component="main" sx={chartsStyles.mainContent}>
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