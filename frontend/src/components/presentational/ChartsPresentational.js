import React from 'react';
import {
  Grid,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent
} from '@mui/material';
import { Refresh, TrendingUp, AttachMoney, Assessment } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LineChart, PieChart as MuiPieChart, ScatterChart } from '@mui/x-charts';
import { chartsPresentationalStyles } from './ChartsPresentational.styles';

const ChartsPresentational = ({ barData, pieData, lineData, areaData, scatterData, kpiData, loading, error, onRefresh }) => {
  if (loading) {
    return (
      <Box sx={chartsPresentationalStyles.loadingContainer}>
        <CircularProgress size={60} sx={chartsPresentationalStyles.loadingSpinner} />
        <Typography variant="h6" sx={chartsPresentationalStyles.loadingText}>
          Carregando gráficos...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={chartsPresentationalStyles.errorContainer}>
        <Alert 
          severity="error" 
          sx={chartsPresentationalStyles.errorAlert}
          action={
            <Button color="inherit" size="small" onClick={onRefresh}>
              Tentar Novamente
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  const kpiCards = [
    { title: 'Receita Total', value: kpiData.revenue || 0, icon: <AttachMoney />, color: '#667eea' },
    { title: 'Crescimento', value: `${kpiData.growth || 0}%`, icon: <TrendingUp />, color: '#10b981' },
    { title: 'Performance', value: kpiData.performance || 0, icon: <Assessment />, color: '#764ba2' }
  ];

  return (
    <Box sx={chartsPresentationalStyles.container}>
      <Box sx={chartsPresentationalStyles.header}>
        <Typography variant="h4" component="h1" sx={chartsPresentationalStyles.title}>
          Business Intelligence Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={onRefresh}
          sx={chartsPresentationalStyles.refreshButton}
        >
          Atualizar
        </Button>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {kpiCards.map((kpi, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={chartsPresentationalStyles.kpiCard}>
              <CardContent sx={chartsPresentationalStyles.kpiContent}>
                <Box sx={{ 
                  ...chartsPresentationalStyles.kpiIcon,
                  backgroundColor: kpi.color
                }}>
                  {kpi.icon}
                </Box>
                <Box>
                  <Typography variant="h4" sx={chartsPresentationalStyles.kpiValue}>
                    {kpi.value}
                  </Typography>
                  <Typography variant="body2" sx={chartsPresentationalStyles.kpiTitle}>
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
          <Card sx={{ ...chartsPresentationalStyles.chartCard, height: { xs: 400, md: 450 } }}>
            <Typography variant="h6" sx={chartsPresentationalStyles.chartTitle}>
              Gráfico de Barras
            </Typography>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis dataKey="category" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={chartsPresentationalStyles.tooltip} />
                <Legend />
                <Bar dataKey="value" fill="#667eea" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        <Grid item xs={12} lg={6} sx={{ display: 'flex' }}>
          <Card sx={{ ...chartsPresentationalStyles.chartCard, height: { xs: 400, md: 450 } }}>
            <Typography variant="h6" sx={chartsPresentationalStyles.chartTitle}>
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
          </Card>
        </Grid>

        <Grid item xs={12} lg={6} sx={{ display: 'flex' }}>
          <Card sx={{ ...chartsPresentationalStyles.chartCard, height: { xs: 400, md: 450 } }}>
            <Typography variant="h6" sx={chartsPresentationalStyles.chartTitle}>
              Gráfico de Pizza
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
          </Card>
        </Grid>

        <Grid item xs={12} lg={6} sx={{ display: 'flex' }}>
          <Card sx={{ ...chartsPresentationalStyles.chartCard, height: { xs: 400, md: 450 } }}>
            <Typography variant="h6" sx={chartsPresentationalStyles.chartTitle}>
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
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ChartsPresentational;