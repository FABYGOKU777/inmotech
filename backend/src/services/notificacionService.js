import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import pool from '../db/connection.js';

dotenv.config();

// Configurar transporter de email (simulado si no hay credenciales)
let transporter = null;

if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

// Enviar email
const enviarEmail = async (to, subject, html) => {
  if (!transporter) {
    console.log('📧 [SIMULADO] Email enviado a:', to);
    console.log('📧 Asunto:', subject);
    return true;
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      html
    });
    console.log('✅ Email enviado a:', to);
    return true;
  } catch (error) {
    console.error('❌ Error enviando email:', error);
    return false;
  }
};

// Notificar cambio de estado de incidencia
export const notificarCambioEstado = async (incidenciaId, nuevoEstado) => {
  try {
    // Obtener información de la incidencia
    const incidenciaResult = await pool.query(
      `SELECT i.*, u.nombre as usuario_nombre, u.email as usuario_email,
              e.nombre as edificio_nombre, p.nombre_empresa as proveedor_nombre
       FROM incidencias i
       JOIN usuarios u ON i.usuario_id = u.id
       LEFT JOIN edificios e ON i.edificio_id = e.id
       LEFT JOIN proveedores p ON i.proveedor_id = p.id
       WHERE i.id = $1`,
      [incidenciaId]
    );

    if (incidenciaResult.rows.length === 0) return;

    const incidencia = incidenciaResult.rows[0];

    // Email al residente
    const estadoTextos = {
      'pendiente': 'Pendiente',
      'en_proceso': 'En Proceso',
      'resuelto': 'Resuelta'
    };

    const html = `
      <h2>Actualización de Incidencia #${incidencia.id}</h2>
      <p>Estimado/a ${incidencia.usuario_nombre},</p>
      <p>Su incidencia ha cambiado de estado a: <strong>${estadoTextos[nuevoEstado] || nuevoEstado}</strong></p>
      <p><strong>Categoría:</strong> ${incidencia.tipo}</p>
      <p><strong>Descripción:</strong> ${incidencia.descripcion}</p>
      ${incidencia.proveedor_nombre ? `<p><strong>Proveedor asignado:</strong> ${incidencia.proveedor_nombre}</p>` : ''}
      <p>Puede ver el estado actualizado en su panel de incidencias.</p>
    `;

    await enviarEmail(
      incidencia.usuario_email,
      `Incidencia #${incidencia.id} - Estado: ${estadoTextos[nuevoEstado]}`,
      html
    );

    // Notificar al proveedor si está asignado
    if (incidencia.proveedor_id && nuevoEstado === 'en_proceso') {
      const proveedorResult = await pool.query(
        'SELECT contacto FROM proveedores WHERE id = $1',
        [incidencia.proveedor_id]
      );

      if (proveedorResult.rows.length > 0) {
        const proveedorEmail = proveedorResult.rows[0].contacto;
        const htmlProveedor = `
          <h2>Nueva Incidencia Asignada</h2>
          <p>Se le ha asignado una nueva incidencia:</p>
          <p><strong>ID:</strong> #${incidencia.id}</p>
          <p><strong>Categoría:</strong> ${incidencia.tipo}</p>
          <p><strong>Descripción:</strong> ${incidencia.descripcion}</p>
          <p><strong>Edificio:</strong> ${incidencia.edificio_nombre}</p>
          <p><strong>Prioridad:</strong> ${incidencia.prioridad}</p>
        `;

        await enviarEmail(
          proveedorEmail,
          `Nueva Incidencia Asignada #${incidencia.id}`,
          htmlProveedor
        );
      }
    }

    return true;
  } catch (error) {
    console.error('Error en notificación:', error);
    return false;
  }
};

// Notificar nueva incidencia a administradores
export const notificarNuevaIncidencia = async (incidenciaId) => {
  try {
    const incidenciaResult = await pool.query(
      `SELECT i.*, u.nombre as usuario_nombre, e.nombre as edificio_nombre
       FROM incidencias i
       JOIN usuarios u ON i.usuario_id = u.id
       LEFT JOIN edificios e ON i.edificio_id = e.id
       WHERE i.id = $1`,
      [incidenciaId]
    );

    if (incidenciaResult.rows.length === 0) return;

    const incidencia = incidenciaResult.rows[0];

    // Obtener todos los administradores
    const adminsResult = await pool.query(
      'SELECT email, nombre FROM usuarios WHERE rol = $1',
      ['admin']
    );

    for (const admin of adminsResult.rows) {
      const html = `
        <h2>Nueva Incidencia Reportada</h2>
        <p>Se ha reportado una nueva incidencia:</p>
        <p><strong>ID:</strong> #${incidencia.id}</p>
        <p><strong>Categoría:</strong> ${incidencia.tipo}</p>
        <p><strong>Prioridad:</strong> ${incidencia.prioridad}</p>
        <p><strong>Descripción:</strong> ${incidencia.descripcion}</p>
        <p><strong>Reportado por:</strong> ${incidencia.usuario_nombre}</p>
        <p><strong>Edificio:</strong> ${incidencia.edificio_nombre || 'N/A'}</p>
      `;

      await enviarEmail(
        admin.email,
        `Nueva Incidencia #${incidencia.id} - ${incidencia.tipo}`,
        html
      );
    }

    return true;
  } catch (error) {
    console.error('Error notificando nueva incidencia:', error);
    return false;
  }
};

// Simular push notification (placeholder)
export const enviarPushNotification = async (userId, titulo, mensaje) => {
  console.log('📱 [SIMULADO] Push notification enviada:');
  console.log(`   Usuario: ${userId}`);
  console.log(`   Título: ${titulo}`);
  console.log(`   Mensaje: ${mensaje}`);
  return true;
};

