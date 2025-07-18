import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { setAuthenticated, setUser } from './store/authSlice';
import LandingPage from './pages/LandingPage';
import DemoPage from './pages/DemoPage';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import './index.css';
import api from './services/api';
import Layout from './components/Layout/Layout';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// App Content Component (needs to be inside Provider to use hooks)
const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const authSuccess = searchParams.get('auth') === 'success';

  useEffect(() => {
    // Verifica autenticación al cargar la app o cuando viene de OAuth success
    const checkAuth = async () => {
      try {
        const response = await api.get('/auth/profile');
        // Si responde correctamente, actualiza el estado
        dispatch(setAuthenticated(true));
        dispatch(setUser(response.data.user));
      } catch (error) {
        console.error('Auth check failed:', error);
        dispatch(setAuthenticated(false));
      }
    };
    
    // Ejecutar checkAuth siempre al cargar el componente
    // y también cuando venga de OAuth success
    checkAuth();
    
    // Si venimos de OAuth success, limpiamos la URL después de verificar
    if (authSuccess) {
      // Eliminar el parámetro de la URL sin recargar la página
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, [dispatch]);

  return (
    <div className="App min-h-screen bg-spotify-black">
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
