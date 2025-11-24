import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../config/axios';
import './IncidenciaDetail.css';

const IncidenciaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [incidencia, setIncidencia] = useState(null);
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    estado: '',
    proveedor_id: '',
    prioridad: ''
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [incidenciaRes, proveedoresRes] = await Promise.all([
        api.get(`/api/incidencias/${id}`),
        api.get('/api/proveedores/list')
      ]);

      setIncidencia(incidenciaRes.data.incidencia);
      setProveedores(proveedoresRes.data.proveedores);
      setFormData({
        estado: incidenciaRes.data.incidencia.estado,
        proveedor_id: incidenciaRes.data.incidencia.proveedor_id || '',
        prioridad: incidenciaRes.data.incidencia.prioridad
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      await api.put(`/api/incidencias/${id}`, formData);
      await fetchData();
      alert('Incidencia actualizada exitosamente');
    } catch (error) {
      alert('Error al actualizar incidencia');
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (!incidencia) {
    return <div className="error">Incidencia no encontrada</div>;
  }

  const getEstadoColor = (estado) => {
    const colors = {
      pendiente: '#f59e0b',
      en_proceso: '#3b82f6',
      resuelto: '#10b981'
    };
    return colors[estado] || '#666';
  };

  const getPrioridadColor = (prioridad) => {
    const colors = {
      baja: '#10b981',
      media: '#f59e0b',
      alta: '#ef4444'
    };
    return colors[prioridad] || '#666';
  };

  return (
    <div className="incidencia-detail">
      <button onClick={() => navigate('/incidencias')} className="back-btn">
        ← Volver
      </button>

      <div className="detail-header">
        <div>
          <h1>Incidencia #{incidencia.id}</h1>
          <div className="badges">
            <span
              className="estado-badge"
              style={{ backgroundColor: getEstadoColor(incidencia.estado) }}
            >
              {incidencia.estado}
            </span>
            <span
              className="prioridad-badge"
              style={{ backgroundColor: getPrioridadColor(incidencia.prioridad) }}
            >
              {incidencia.prioridad}
            </span>
            <span className="tipo-badge">{incidencia.tipo}</span>
          </div>
        </div>
      </div>

      <div className="detail-content">
        <div className="detail-main">
          <div className="section">
            <h2>Descripción</h2>
            <p>{incidencia.descripcion}</p>
          </div>

          {incidencia.imagen_url && (
            <div className="section">
              <h2>Imagen</h2>
              <div className="imagen-container">
                <img
                  src={`http://localhost:3000${incidencia.imagen_url}`}
                  alt="Incidencia"
                />
              </div>
            </div>
          )}

          <div className="section">
            <h2>Información</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Reportado por:</label>
                <p>{incidencia.usuario_nombre}</p>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <p>{incidencia.usuario_email}</p>
              </div>
              {incidencia.edificio_nombre && (
                <div className="info-item">
                  <label>Edificio:</label>
                  <p>{incidencia.edificio_nombre}</p>
                </div>
              )}
              {incidencia.proveedor_nombre && (
                <div className="info-item">
                  <label>Proveedor:</label>
                  <p>{incidencia.proveedor_nombre}</p>
                </div>
              )}
              <div className="info-item">
                <label>Fecha de creación:</label>
                <p>{new Date(incidencia.fecha_creacion).toLocaleString()}</p>
              </div>
              <div className="info-item">
                <label>Última actualización:</label>
                <p>{new Date(incidencia.fecha_actualizacion).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="detail-sidebar">
          <div className="section">
            <h2>Actualizar Incidencia</h2>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Estado</label>
                <select
                  value={formData.estado}
                  onChange={(e) =>
                    setFormData({ ...formData, estado: e.target.value })
                  }
                  required
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="en_proceso">En Proceso</option>
                  <option value="resuelto">Resuelto</option>
                </select>
              </div>

              <div className="form-group">
                <label>Prioridad</label>
                <select
                  value={formData.prioridad}
                  onChange={(e) =>
                    setFormData({ ...formData, prioridad: e.target.value })
                  }
                  required
                >
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                </select>
              </div>

              <div className="form-group">
                <label>Proveedor</label>
                <select
                  value={formData.proveedor_id}
                  onChange={(e) =>
                    setFormData({ ...formData, proveedor_id: e.target.value })
                  }
                >
                  <option value="">Sin asignar</option>
                  {proveedores.map((proveedor) => (
                    <option key={proveedor.id} value={proveedor.id}>
                      {proveedor.nombre_empresa} - {proveedor.especialidad}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" disabled={updating} className="update-btn">
                {updating ? 'Actualizando...' : 'Actualizar'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidenciaDetail;

