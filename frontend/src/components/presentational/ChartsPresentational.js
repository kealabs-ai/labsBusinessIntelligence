import React from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent
} from '@mui/material';
import { Refresh, TrendingUp, AttachMoney, Assessment } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { LineChart, PieChart as MuiPieChart, ScatterChart } from '@mui/x-charts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const ChartsPresentational = ({ barData, pieData, lineData, areaData, scatterData, kpiData, loading, error, onRefresh }) => {
  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Carregando gráficos...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" action={
          <Button color="inherit" size="small" onClick={onRefresh}>
            Tentar Novamente
          </Button>
        }>
          {error}
        </Alert>
      </Box>
    );
  }

  const kpiCards = [
    { title: 'Receita Total', value: kpiData.revenue || 0, icon: <AttachMoney />, color: '#10b981' },
    { title: 'Crescimento', value: `${kpiData.growth || 0}%`, icon: <TrendingUp />, color: '#3b82f6' },
    { title: 'Performance', value: kpiData.performance || 0, icon: <Assessment />, color: '#8b5cf6' }
  ];

  return (
    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 'bold' }}>
          Business Intelligence Dashboard
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={onRefresh}
          sx={{
            color: 'white',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.5)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          Atualizar
        </Button>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {kpiCards.map((kpi, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)'
              }
            }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                <Box sx={{ 
                  backgroundColor: kpi.color, 
                  borderRadius: 2, 
                  p: 1.5, 
                  mr: 2,
                  color: 'white'
                }}>
                  {kpi.icon}
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
                    {kpi.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    {kpi.title}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts Grid */}
      <Grid container spacing={4} sx={{ flexGrow: 1, maxWidth: '100%', margin: 0 }}>
        <Grid item xs={12} lg={6} sx={{ display: 'flex' }}>
          <Paper sx={{ 
            p: 3, 
            height: { xs: 400, md: 450 },
            width: '100%',
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)'
            }
          }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1e293b', mb: 2 }}>
              Gráfico de Barras
            </Typography>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis dataKey="category" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                />
                <Legend />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={6} sx={{ display: 'flex' }}>
          <Paper sx={{ 
            p: 3, 
            height: { xs: 400, md: 450 },
            width: '100%',
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)'
            }
          }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1e293b', mb: 2 }}>
              Gráfico de Linha
            </Typography>
            <LineChart
              width={undefined}
              height={350}
              series={[{
                data: lineData.map(item => item.value) || [],
                color: '#10b981'
              }]}
              xAxis={[{
                scaleType: 'point',
                data: lineData.map(item => item.month) || []
              }]}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} lg={6} sx={{ display: 'flex' }}>
          <Paper sx={{ 
            p: 3, 
            height: { xs: 400, md: 450 },
            width: '100%',
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)'
            }
          }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1e293b', mb: 2 }}>
              Gráfico de Pizza (MUI)
            </Typography>
            <MuiPieChart
              series={[{
                data: pieData.map((item, index) => ({
                  id: index,
                  value: item.percentage,
                  label: item.label
                })) || []
              }]}
              width={undefined}
              height={350}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} lg={6} sx={{ display: 'flex' }}>
          <Paper sx={{ 
            p: 3, 
            height: { xs: 400, md: 450 },
            width: '100%',
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)'
            }
          }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1e293b', mb: 2 }}>
              Gráfico de Dispersão
            </Typography>
            <ScatterChart
              width={undefined}
              height={350}
              series={[{
                data: scatterData.map(item => ({ x: item.x, y: item.y, id: item.id })) || [],
                color: '#f59e0b'
              }]}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ChartsPresentational;