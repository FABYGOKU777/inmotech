import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Home from './pages/Home';
import NuevaIncidencia from './pages/NuevaIncidencia';
import MisIncidencias from './pages/MisIncidencias';
import IncidenciaDetail from './pages/IncidenciaDetail';
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
            <Route index element={<Home />} />
            <Route path="nueva" element={<NuevaIncidencia />} />
            <Route path="mis-incidencias" element={<MisIncidencias />} />
            <Route path="incidencias/:id" element={<IncidenciaDetail />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

