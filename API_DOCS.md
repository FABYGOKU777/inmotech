# Documentación de la API - Inmotech

Base URL: `http://localhost:3000/api`

## Autenticación

Todas las rutas protegidas requieren un token JWT en el header:
```
Authorization: Bearer <token>
```

---

## Autenticación

### POST /auth/register
Registrar un nuevo usuario.

**Body:**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "rol": "residente",
  "edificio_id": 1
}
```

**Response:**
```json
{
  "message": "Usuario registrado exitosamente",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "rol": "residente",
    "edificio_id": 1
  }
}
```

### POST /auth/login
Iniciar sesión.

**Body:**
```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login exitoso",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "rol": "residente",
    "edificio_id": 1
  }
}
```

### GET /auth/me
Obtener información del usuario actual.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "user": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "rol": "residente",
    "edificio_id": 1
  }
}
```

---

## Incidencias

### POST /incidencias/create
Crear una nueva incidencia.

**Headers:** `Authorization: Bearer <token>`

**Body (multipart/form-data):**
- `descripcion` (string, requerido): Descripción del problema
- `imagen` (file, opcional): Imagen de la incidencia
- `edificio_id` (integer, opcional): ID del edificio

**Response:**
```json
{
  "message": "Incidencia creada exitosamente",
  "incidencia": {
    "id": 1,
    "usuario_id": 1,
    "edificio_id": 1,
    "tipo": "Ascensor",
    "descripcion": "El ascensor no funciona",
    "imagen_url": "/uploads/incidencia-123.jpg",
    "prioridad": "alta",
    "estado": "pendiente",
    "proveedor_id": 1,
    "fecha_creacion": "2024-01-01T00:00:00.000Z",
    "fecha_actualizacion": "2024-01-01T00:00:00.000Z"
  },
  "clasificacion": {
    "categoria": "Ascensor",
    "prioridad": "alta",
    "confianza": 0.9
  }
}
```

### GET /incidencias/list
Listar incidencias con filtros opcionales.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `estado` (string, opcional): pendiente | en_proceso | resuelto
- `tipo` (string, opcional): Categoría de la incidencia
- `prioridad` (string, opcional): baja | media | alta
- `limit` (integer, opcional, default: 50)
- `offset` (integer, opcional, default: 0)

**Response:**
```json
{
  "incidencias": [
    {
      "id": 1,
      "tipo": "Ascensor",
      "descripcion": "El ascensor no funciona",
      "prioridad": "alta",
      "estado": "pendiente",
      "usuario_nombre": "Juan Pérez",
      "edificio_nombre": "Edificio Central",
      "proveedor_nombre": "Ascensores Express"
    }
  ],
  "total": 1
}
```

### GET /incidencias/:id
Obtener detalles de una incidencia.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "incidencia": {
    "id": 1,
    "usuario_id": 1,
    "edificio_id": 1,
    "tipo": "Ascensor",
    "descripcion": "El ascensor no funciona",
    "imagen_url": "/uploads/incidencia-123.jpg",
    "prioridad": "alta",
    "estado": "pendiente",
    "proveedor_id": 1,
    "usuario_nombre": "Juan Pérez",
    "usuario_email": "juan@example.com",
    "edificio_nombre": "Edificio Central",
    "proveedor_nombre": "Ascensores Express",
    "fecha_creacion": "2024-01-01T00:00:00.000Z",
    "fecha_actualizacion": "2024-01-01T00:00:00.000Z"
  }
}
```

### PUT /incidencias/:id
Actualizar una incidencia (solo admin y proveedores).

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "estado": "en_proceso",
  "proveedor_id": 1,
  "prioridad": "alta"
}
```

**Response:**
```json
{
  "message": "Incidencia actualizada exitosamente",
  "incidencia": {
    "id": 1,
    "estado": "en_proceso",
    ...
  }
}
```

### DELETE /incidencias/:id
Eliminar una incidencia (solo admin).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Incidencia eliminada exitosamente"
}
```

---

## Proveedores

### GET /proveedores/list
Listar proveedores.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `especialidad` (string, opcional): Filtrar por especialidad

**Response:**
```json
{
  "proveedores": [
    {
      "id": 1,
      "nombre_empresa": "Ascensores Express",
      "especialidad": "Ascensores",
      "contacto": "ascensores@example.com",
      "tiempo_respuesta_est": 2,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### POST /proveedores/create
Crear un proveedor (solo admin).

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "nombre_empresa": "Ascensores Express",
  "especialidad": "Ascensores",
  "contacto": "ascensores@example.com",
  "tiempo_respuesta_est": 2
}
```

### PUT /proveedores/:id
Actualizar un proveedor (solo admin).

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "nombre_empresa": "Nuevo Nombre",
  "especialidad": "Electricidad",
  "contacto": "nuevo@example.com",
  "tiempo_respuesta_est": 4
}
```

### DELETE /proveedores/:id
Eliminar un proveedor (solo admin).

**Headers:** `Authorization: Bearer <token>`

---

## Edificios

### GET /edificios/list
Listar edificios.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "edificios": [
    {
      "id": 1,
      "nombre": "Edificio Central",
      "direccion": "Av. Principal 123",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### POST /edificios/create
Crear un edificio (solo admin).

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "nombre": "Edificio Central",
  "direccion": "Av. Principal 123"
}
```

---

## IA

### POST /ia/clasificar
Clasificar texto de incidencia usando IA.

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "texto": "El ascensor del piso 3 no funciona"
}
```

**Response:**
```json
{
  "categoria": "Ascensor",
  "prioridad": "alta",
  "confianza": 0.9
}
```

---

## Analytics

### GET /analytics/dashboard
Obtener métricas del dashboard (solo admin).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "porCategoria": [
    {
      "tipo": "Ascensor",
      "cantidad": 10,
      "resueltas": 8,
      "pendientes": 1,
      "en_proceso": 1
    }
  ],
  "porEstado": [
    {
      "estado": "pendiente",
      "cantidad": 5
    }
  ],
  "porPrioridad": [
    {
      "prioridad": "alta",
      "cantidad": 8
    }
  ],
  "tiempoPromedioHoras": 24.5,
  "rankingProveedores": [
    {
      "nombre_empresa": "Ascensores Express",
      "especialidad": "Ascensores",
      "total_incidencias": 10,
      "resueltas": 8,
      "horas_promedio_resolucion": 12.5
    }
  ],
  "incidenciasRecientes": 15
}
```

---

## Códigos de Error

- `400` - Bad Request (datos inválidos)
- `401` - Unauthorized (token inválido o faltante)
- `403` - Forbidden (permisos insuficientes)
- `404` - Not Found (recurso no encontrado)
- `500` - Internal Server Error (error del servidor)

---

## Ejemplos de Uso

### Crear incidencia con imagen (cURL)

```bash
curl -X POST http://localhost:3000/api/incidencias/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "descripcion=El ascensor no funciona" \
  -F "imagen=@/path/to/image.jpg"
```

### Listar incidencias pendientes

```bash
curl -X GET "http://localhost:3000/api/incidencias/list?estado=pendiente" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

