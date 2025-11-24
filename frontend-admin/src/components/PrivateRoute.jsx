import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.rol !== 'admin') {
    return <div>Acceso denegado. Se requiere rol de administrador.</div>;
  }

  return children;
};

export default PrivateRoute;

