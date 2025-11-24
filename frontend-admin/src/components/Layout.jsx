import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>Inmotech</h1>
          <p>Panel Admin</p>
        </div>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>
            📊 Dashboard
          </Link>
          <Link to="/incidencias" className={isActive('/incidencias') ? 'active' : ''}>
            🎫 Incidencias
          </Link>
          <Link to="/proveedores" className={isActive('/proveedores') ? 'active' : ''}>
            🏢 Proveedores
          </Link>
          <Link to="/analytics" className={isActive('/analytics') ? 'active' : ''}>
            📈 Analytics
          </Link>
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <p><strong>{user?.nombre}</strong></p>
            <p className="user-role">{user?.rol}</p>
          </div>
          <button onClick={logout} className="logout-btn">
            Cerrar Sesión
          </button>
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

