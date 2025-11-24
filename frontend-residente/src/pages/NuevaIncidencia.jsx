import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NuevaIncidencia.css';

const NuevaIncidencia = () => {
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('descripcion', descripcion);
      if (imagen) {
        formData.append('imagen', imagen);
      }

      const response = await axios.post('/api/incidencias/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('Incidencia reportada exitosamente');
      navigate(`/incidencias/${response.data.incidencia.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al reportar incidencia');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nueva-incidencia-page">
      <h1>Reportar Nueva Incidencia</h1>

      <form onSubmit={handleSubmit} className="incidencia-form">
        <div className="form-group">
          <label>Descripción del Problema *</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
            rows="6"
            placeholder="Describe el problema detalladamente. Por ejemplo: 'El ascensor del piso 3 no funciona, está atascado'"
          />
          <small>
            Nuestro sistema clasificará automáticamente tu incidencia usando IA
          </small>
        </div>

        <div className="form-group">
          <label>Imagen (Opcional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file-input"
          />
          {preview && (
            <div className="image-preview">
              <img src={preview} alt="Preview" />
              <button
                type="button"
                onClick={() => {
                  setImagen(null);
                  setPreview(null);
                }}
                className="remove-image"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="cancel-btn"
          >
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Enviando...' : 'Reportar Incidencia'}
          </button>
        </div>
      </form>

      <div className="info-box">
        <h3>💡 Consejos para reportar</h3>
        <ul>
          <li>Sé específico sobre la ubicación del problema</li>
          <li>Incluye detalles relevantes (piso, área, etc.)</li>
          <li>Una foto ayuda mucho a entender el problema</li>
          <li>El sistema asignará automáticamente un proveedor</li>
        </ul>
      </div>
    </div>
  );
};

export default NuevaIncidencia;

