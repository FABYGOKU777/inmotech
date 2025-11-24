import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Incidencias from './pages/Incidencias';
import IncidenciaDetail from './pages/IncidenciaDetail';
import Proveedores from './pages/Proveedores';
import Analytics from './pages/Analytics';
import Layout from './components/Layout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="incidencias" element={<Incidencias />} />
            <Route path="incidencias/:id" element={<IncidenciaDetail />} />
            <Route path="proveedores" element={<Proveedores />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

