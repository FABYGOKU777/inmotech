import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-content">
          <div className="nav-brand">
            <h1>Inmotech</h1>
            <p>Residente</p>
          </div>
          <div className="nav-links">
            <Link to="/" className={isActive('/') ? 'active' : ''}>
              🏠 Inicio
            </Link>
            <Link to="/nueva" className={isActive('/nueva') ? 'active' : ''}>
              ➕ Reportar Incidencia
            </Link>
            <Link
              to="/mis-incidencias"
              className={isActive('/mis-incidencias') ? 'active' : ''}
            >
              📋 Mis Incidencias
            </Link>
          </div>
          <div className="nav-user">
            <span>{user?.nombre}</span>
            <button onClick={logout} className="logout-btn">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

