import axios from 'axios';

// Configurar la URL base de la API
// En Docker, usa el nombre del servicio, en desarrollo local usa localhost
// Si estamos en el navegador (cliente), siempre usa localhost
const isBrowser = typeof window !== 'undefined';
const API_URL = isBrowser 
  ? 'http://localhost:3000' 
  : (import.meta.env.VITE_API_URL || 'http://backend:3000');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

