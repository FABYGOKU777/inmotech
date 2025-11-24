import bcrypt from 'bcryptjs';
import pool from '../db/connection.js';
import dotenv from 'dotenv';

dotenv.config();

async function seed() {
  try {
    console.log('🌱 Iniciando seed de datos...');

    // Crear edificios
    const edificio1 = await pool.query(
      'INSERT INTO edificios (nombre, direccion) VALUES ($1, $2) RETURNING id',
      ['Edificio Central', 'Av. Principal 123, Ciudad']
    );
    const edificio2 = await pool.query(
      'INSERT INTO edificios (nombre, direccion) VALUES ($1, $2) RETURNING id',
      ['Torre Norte', 'Calle Secundaria 456, Ciudad']
    );

    const edificio1Id = edificio1.rows[0].id;
    const edificio2Id = edificio2.rows[0].id;

    console.log('✅ Edificios creados');

    // Crear usuarios admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    await pool.query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES ($1, $2, $3, $4)',
      ['Admin Principal', 'admin@inmotech.com', adminPassword, 'admin']
    );

    // Crear residentes
    const residente1Password = await bcrypt.hash('residente123', 10);
    const residente1 = await pool.query(
      'INSERT INTO usuarios (nombre, email, password, rol, edificio_id) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      ['Juan Pérez', 'juan@example.com', residente1Password, 'residente', edificio1Id]
    );

    const residente2Password = await bcrypt.hash('residente123', 10);
    const residente2 = await pool.query(
      'INSERT INTO usuarios (nombre, email, password, rol, edificio_id) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      ['María García', 'maria@example.com', residente2Password, 'residente', edificio1Id]
    );

    console.log('✅ Usuarios creados');

    // Crear proveedores
    const proveedor1 = await pool.query(
      'INSERT INTO proveedores (nombre_empresa, especialidad, contacto, tiempo_respuesta_est) VALUES ($1, $2, $3, $4) RETURNING id',
      ['Ascensores Express', 'Ascensores', 'ascensores@example.com', 2]
    );

    const proveedor2 = await pool.query(
      'INSERT INTO proveedores (nombre_empresa, especialidad, contacto, tiempo_respuesta_est) VALUES ($1, $2, $3, $4) RETURNING id',
      ['Electricidad Pro', 'Electricidad', 'electricidad@example.com', 4]
    );

    const proveedor3 = await pool.query(
      'INSERT INTO proveedores (nombre_empresa, especialidad, contacto, tiempo_respuesta_est) VALUES ($1, $2, $3, $4) RETURNING id',
      ['Plomería Rápida', 'Plomería', 'plomeria@example.com', 6]
    );

    const proveedor4 = await pool.query(
      'INSERT INTO proveedores (nombre_empresa, especialidad, contacto, tiempo_respuesta_est) VALUES ($1, $2, $3, $4) RETURNING id',
      ['Servicios Generales', 'General', 'general@example.com', 12]
    );

    const proveedor5 = await pool.query(
      'INSERT INTO proveedores (nombre_empresa, especialidad, contacto, tiempo_respuesta_est) VALUES ($1, $2, $3, $4) RETURNING id',
      ['Seguridad Total', 'Seguridad', 'seguridad@example.com', 3]
    );

    console.log('✅ Proveedores creados');

    // Crear incidencias de ejemplo
    const incidencias = [
      {
        usuario_id: residente1.rows[0].id,
        edificio_id: edificio1Id,
        tipo: 'Ascensor',
        descripcion: 'El ascensor del piso 3 no funciona, está atascado',
        prioridad: 'alta',
        estado: 'en_proceso',
        proveedor_id: proveedor1.rows[0].id
      },
      {
        usuario_id: residente2.rows[0].id,
        edificio_id: edificio1Id,
        tipo: 'Electricidad',
        descripcion: 'Falta luz en el pasillo del segundo piso',
        prioridad: 'media',
        estado: 'pendiente',
        proveedor_id: proveedor2.rows[0].id
      },
      {
        usuario_id: residente1.rows[0].id,
        edificio_id: edificio1Id,
        tipo: 'Plomería',
        descripcion: 'Goteo constante en el baño del apartamento 301',
        prioridad: 'media',
        estado: 'resuelto',
        proveedor_id: proveedor3.rows[0].id
      },
      {
        usuario_id: residente2.rows[0].id,
        edificio_id: edificio1Id,
        tipo: 'Filtraciones',
        descripcion: 'Mancha de humedad en el techo del living',
        prioridad: 'alta',
        estado: 'pendiente',
        proveedor_id: proveedor3.rows[0].id
      }
    ];

    for (const incidencia of incidencias) {
      await pool.query(
        `INSERT INTO incidencias 
         (usuario_id, edificio_id, tipo, descripcion, prioridad, estado, proveedor_id, fecha_creacion, fecha_actualizacion)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW() - INTERVAL '${Math.floor(Math.random() * 7)} days', NOW() - INTERVAL '${Math.floor(Math.random() * 3)} days')`,
        [
          incidencia.usuario_id,
          incidencia.edificio_id,
          incidencia.tipo,
          incidencia.descripcion,
          incidencia.prioridad,
          incidencia.estado,
          incidencia.proveedor_id
        ]
      );
    }

    console.log('✅ Incidencias de ejemplo creadas');
    console.log('\n📋 Credenciales de prueba:');
    console.log('Admin: admin@inmotech.com / admin123');
    console.log('Residente 1: juan@example.com / residente123');
    console.log('Residente 2: maria@example.com / residente123');
    console.log('\n✅ Seed completado exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  }
}

seed();

