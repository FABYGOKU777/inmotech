import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import incidenciasRoutes from './routes/incidencias.js';
import proveedoresRoutes from './routes/proveedores.js';
import edificiosRoutes from './routes/edificios.js';
import iaRoutes from './routes/ia.js';
import analyticsRoutes from './routes/analytics.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_ADMIN_URL || 'http://localhost:5173',
    process.env.FRONTEND_RESIDENTE_URL || 'http://localhost:5174'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Inmotech API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/incidencias', incidenciasRoutes);
app.use('/api/proveedores', proveedoresRoutes);
app.use('/api/edificios', edificiosRoutes);
app.use('/api/ia', iaRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error handler
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

