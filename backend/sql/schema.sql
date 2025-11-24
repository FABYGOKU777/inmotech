-- Base de datos Inmotech
-- Crear base de datos (ejecutar manualmente si es necesario)
-- CREATE DATABASE inmotech;

-- Tabla de Edificios
CREATE TABLE IF NOT EXISTS edificios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    direccion TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(50) NOT NULL CHECK (rol IN ('residente', 'admin', 'proveedor')),
    edificio_id INTEGER REFERENCES edificios(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Proveedores
CREATE TABLE IF NOT EXISTS proveedores (
    id SERIAL PRIMARY KEY,
    nombre_empresa VARCHAR(255) NOT NULL,
    especialidad VARCHAR(100) NOT NULL,
    contacto VARCHAR(255) NOT NULL,
    tiempo_respuesta_est INTEGER DEFAULT 24, -- horas estimadas
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Incidencias
CREATE TABLE IF NOT EXISTS incidencias (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    edificio_id INTEGER REFERENCES edificios(id) ON DELETE SET NULL,
    tipo VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    imagen_url VARCHAR(500),
    prioridad VARCHAR(50) NOT NULL CHECK (prioridad IN ('baja', 'media', 'alta')),
    estado VARCHAR(50) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_proceso', 'resuelto')),
    proveedor_id INTEGER REFERENCES proveedores(id) ON DELETE SET NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_incidencias_usuario ON incidencias(usuario_id);
CREATE INDEX IF NOT EXISTS idx_incidencias_edificio ON incidencias(edificio_id);
CREATE INDEX IF NOT EXISTS idx_incidencias_estado ON incidencias(estado);
CREATE INDEX IF NOT EXISTS idx_incidencias_proveedor ON incidencias(proveedor_id);
CREATE INDEX IF NOT EXISTS idx_incidencias_tipo ON incidencias(tipo);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios(rol);

-- Trigger para actualizar fecha_actualizacion automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_incidencias_updated_at BEFORE UPDATE ON incidencias
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

