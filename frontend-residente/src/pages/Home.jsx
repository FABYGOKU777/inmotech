import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <div className="welcome-section">
        <h1>Bienvenido, {user?.nombre}</h1>
        <p>Gestiona tus incidencias de manera rápida y sencilla</p>
      </div>

      <div className="quick-actions">
        <Link to="/nueva" className="action-card primary">
          <div className="action-icon">➕</div>
          <h2>Reportar Nueva Incidencia</h2>
          <p>Reporta un problema en tu edificio</p>
        </Link>
        <Link to="/mis-incidencias" className="action-card">
          <div className="action-icon">📋</div>
          <h2>Mis Incidencias</h2>
          <p>Ver el estado de tus solicitudes</p>
        </Link>
      </div>

      <div className="info-section">
        <h2>¿Cómo funciona?</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Reporta</h3>
            <p>Describe el problema y sube una foto si es necesario</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Clasificación Automática</h3>
            <p>Nuestro sistema clasifica y prioriza tu incidencia</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Seguimiento</h3>
            <p>Recibe notificaciones sobre el estado de tu incidencia</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

