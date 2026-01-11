import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import LoginContainer from './containers/login/LoginContainer';
import MenuContainer from './containers/menu/MenuContainer';
import ChartsContainer from './containers/charts/ChartsContainer';
import AIPromptContainer from './containers/ai-prompt/AIPromptContainer';
import AgendaContainer from './containers/agenda/AgendaContainer';
import AdminContainer from './containers/admin/AdminContainer';
import CaixaContainer from './containers/caixa/CaixaContainer';
import UnitsContainer from './containers/units/UnitsContainer';
import { AuthProvider, useAuth } from './services/AuthContext';
import { ThemeContextProvider } from './services/ThemeContext';
import InstanceQRCodeContainer from './containers/configuracoes/InstanceQRCodeContainer';


function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <ThemeContextProvider>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/login" element={<LoginContainer />} />
            <Route path="/configuracoes/instance-qrcode" element={
              <ProtectedRoute>
                <InstanceQRCodeContainer />
              </ProtectedRoute>
            } />
            <Route path="/menu" element={
              <ProtectedRoute>
                <MenuContainer />
              </ProtectedRoute>
            } />
            <Route path="/charts" element={
              <ProtectedRoute>
                <ChartsContainer />
              </ProtectedRoute>
            } />
            <Route path="/ai-prompt" element={
              <ProtectedRoute>
                <AIPromptContainer />
              </ProtectedRoute>
            } />
            <Route path="/agenda" element={
              <ProtectedRoute>
                <AgendaContainer />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminContainer />
              </ProtectedRoute>
            } />
            <Route path="/caixa" element={
              <ProtectedRoute>
                <CaixaContainer />
              </ProtectedRoute>
            } />
            <Route path="/units" element={
              <ProtectedRoute>
                <UnitsContainer />
              </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/menu" />} />
          </Routes>
        </Router>
      </ThemeContextProvider>
    </AuthProvider>
  );
}

export default App;