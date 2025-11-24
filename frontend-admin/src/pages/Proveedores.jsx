import { useState, useEffect } from 'react';
import api from '../config/axios';
import './Proveedores.css';

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre_empresa: '',
    especialidad: '',
    contacto: '',
    tiempo_respuesta_est: 24
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProveedores();
  }, []);

  const fetchProveedores = async () => {
    try {
      const response = await api.get('/api/proveedores/list');
      setProveedores(response.data.proveedores);
    } catch (error) {
      console.error('Error fetching proveedores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/api/proveedores/${editingId}`, formData);
      } else {
        await api.post('/api/proveedores/create', formData);
      }
      await fetchProveedores();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        nombre_empresa: '',
        especialidad: '',
        contacto: '',
        tiempo_respuesta_est: 24
      });
    } catch (error) {
      alert('Error al guardar proveedor');
      console.error(error);
    }
  };

  const handleEdit = (proveedor) => {
    setFormData({
      nombre_empresa: proveedor.nombre_empresa,
      especialidad: proveedor.especialidad,
      contacto: proveedor.contacto,
      tiempo_respuesta_est: proveedor.tiempo_respuesta_est
    });
    setEditingId(proveedor.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Está seguro de eliminar este proveedor?')) return;

    try {
      await api.delete(`/api/proveedores/${id}`);
      await fetchProveedores();
    } catch (error) {
      alert('Error al eliminar proveedor');
      console.error(error);
    }
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="proveedores-page">
      <div className="page-header">
        <h1>Proveedores</h1>
        <button onClick={() => setShowForm(!showForm)} className="add-btn">
          {showForm ? 'Cancelar' : '+ Nuevo Proveedor'}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h2>{editingId ? 'Editar' : 'Nuevo'} Proveedor</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Nombre de Empresa</label>
                <input
                  type="text"
                  value={formData.nombre_empresa}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre_empresa: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Especialidad</label>
                <select
                  value={formData.especialidad}
                  onChange={(e) =>
                    setFormData({ ...formData, especialidad: e.target.value })
                  }
                  required
                >
                  <option value="">Seleccionar...</option>
                  <option value="Ascensores">Ascensores</option>
                  <option value="Electricidad">Electricidad</option>
                  <option value="Plomería">Plomería</option>
                  <option value="Seguridad">Seguridad</option>
                  <option value="Limpieza">Limpieza</option>
                  <option value="General">General</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Contacto (Email)</label>
                <input
                  type="email"
                  value={formData.contacto}
                  onChange={(e) =>
                    setFormData({ ...formData, contacto: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Tiempo de Respuesta Estimado (horas)</label>
                <input
                  type="number"
                  value={formData.tiempo_respuesta_est}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tiempo_respuesta_est: parseInt(e.target.value)
                    })
                  }
                  required
                  min="1"
                />
              </div>
            </div>
            <button type="submit" className="submit-btn">
              {editingId ? 'Actualizar' : 'Crear'} Proveedor
            </button>
          </form>
        </div>
      )}

      <div className="proveedores-grid">
        {proveedores.length === 0 ? (
          <p className="no-data">No hay proveedores registrados</p>
        ) : (
          proveedores.map((proveedor) => (
            <div key={proveedor.id} className="proveedor-card">
              <div className="card-header">
                <h3>{proveedor.nombre_empresa}</h3>
                <div className="card-actions">
                  <button
                    onClick={() => handleEdit(proveedor)}
                    className="edit-btn"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(proveedor.id)}
                    className="delete-btn"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <div className="card-body">
                <div className="info-item">
                  <label>Especialidad:</label>
                  <span className="especialidad-badge">{proveedor.especialidad}</span>
                </div>
                <div className="info-item">
                  <label>Contacto:</label>
                  <span>{proveedor.contacto}</span>
                </div>
                <div className="info-item">
                  <label>Tiempo de Respuesta:</label>
                  <span>{proveedor.tiempo_respuesta_est} horas</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Proveedores;

