import React, { useState, useEffect } from 'react';
import { chartService } from '../../services/chartService';
import ChartsPresentational from '../../components/presentational/ChartsPresentational';
import ToolbarContainer from '../toolbar/ToolbarContainer';

const ChartsContainer = () => {
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({});

  const loadChartData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const [barResponse, pieResponse] = await Promise.all([
        chartService.getBarChartData(filters),
        chartService.getPieChartData(filters)
      ]);
      
      setBarData(barResponse.data || []);
      setPieData(pieResponse.data || []);
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

  return (
    <>
      <ToolbarContainer onFilterChange={handleFilterChange} />
      <ChartsPresentational
        barData={barData}
        pieData={pieData}
        loading={loading}
        error={error}
        onRefresh={loadChartData}
      />
    </>
  );
};

export default ChartsContainer;