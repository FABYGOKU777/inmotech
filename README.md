# Inmotech - Sistema de Gestión de Incidencias con IA

MVP completo y funcional de una plataforma digital con asistente virtual de IA para gestión de incidencias en edificios.

## 🎯 Características

- ✅ **Reporte de Incidencias**: Los residentes pueden reportar problemas con texto y fotos
- ✅ **Clasificación Automática con IA**: El sistema clasifica automáticamente las incidencias
- ✅ **Asignación Automática**: Asigna proveedores según la categoría y disponibilidad
- ✅ **Notificaciones en Tiempo Real**: Email y push notifications (simuladas)
- ✅ **Panel de Administración**: Dashboard completo con analytics
- ✅ **Portal Residente**: Interfaz simple para reportar y seguir incidencias
- ✅ **Sistema de Roles**: Residente, Administrador y Proveedor
- ✅ **Analytics**: Métricas y estadísticas en tiempo real

## 🏗️ Arquitectura

```
inmotech/
├── backend/              # API Node.js + Express
│   ├── src/
│   │   ├── db/          # Conexión a PostgreSQL
│   │   ├── middleware/  # Auth, upload, error handling
│   │   ├── routes/       # Rutas de la API
│   │   └── services/    # Lógica de negocio (IA, notificaciones, asignación)
│   ├── sql/             # Esquema de base de datos
│   └── scripts/         # Migraciones y seeders
├── frontend-admin/       # Panel de administración (React + Vite)
├── frontend-residente/   # Portal para residentes (React + Vite)
└── docker-compose.yml    # Configuración Docker
```

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+
- PostgreSQL 15+ (o usar Docker)
- npm o yarn

### Opción 1: Con Docker (Recomendado)

```bash
# Clonar el repositorio
git clone <repo-url>
cd inmotech

# Iniciar todos los servicios
docker-compose up -d

# Los servicios estarán disponibles en:
# - Backend: http://localhost:3000
# - Frontend Admin: http://localhost:5173
# - Frontend Residente: http://localhost:5174
# - PostgreSQL: localhost:5432
```

### Opción 2: Instalación Manual

#### 1. Base de Datos

```bash
# Crear base de datos PostgreSQL
createdb inmotech

# O usar Docker solo para PostgreSQL
docker run -d \
  --name inmotech-postgres \
  -e POSTGRES_DB=inmotech \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:15-alpine
```

#### 2. Backend

```bash
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp env.example .env
# Editar .env con tus credenciales

# Ejecutar migraciones
npm run db:migrate

# Poblar base de datos con datos de prueba
npm run db:seed

# Iniciar servidor
npm run dev
```

#### 3. Frontend Admin

```bash
cd frontend-admin

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

#### 4. Frontend Residente

```bash
cd frontend-residente

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## 📋 Credenciales de Prueba

### Administrador
- Email: `admin@inmotech.com`
- Password: `admin123`

### Residente 1
- Email: `juan@example.com`
- Password: `residente123`

### Residente 2
- Email: `maria@example.com`
- Password: `residente123`

## 🔌 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/auth/me` - Obtener usuario actual

### Incidencias
- `POST /api/incidencias/create` - Crear incidencia (con imagen opcional)
- `GET /api/incidencias/list` - Listar incidencias (con filtros)
- `GET /api/incidencias/:id` - Obtener incidencia por ID
- `PUT /api/incidencias/:id` - Actualizar incidencia
- `DELETE /api/incidencias/:id` - Eliminar incidencia (solo admin)

### Proveedores
- `GET /api/proveedores/list` - Listar proveedores
- `POST /api/proveedores/create` - Crear proveedor (solo admin)
- `PUT /api/proveedores/:id` - Actualizar proveedor (solo admin)
- `DELETE /api/proveedores/:id` - Eliminar proveedor (solo admin)

### IA
- `POST /api/ia/clasificar` - Clasificar texto de incidencia

### Analytics
- `GET /api/analytics/dashboard` - Dashboard de analytics (solo admin)

## 🤖 Sistema de IA

El sistema incluye un módulo de clasificación automática que:

1. **Clasifica** la incidencia en categorías:
   - Ascensor
   - Electricidad
   - Plomería
   - Filtraciones
   - Seguridad
   - Limpieza
   - Otros

2. **Asigna prioridad** automáticamente:
   - Ascensor → Alta
   - Filtraciones → Alta
   - Electricidad → Media/Alta
   - Otros → Baja

3. **Asigna proveedor** automáticamente según especialidad y disponibilidad

### Configuración de OpenAI (Opcional)

Para usar OpenAI en lugar del clasificador simple:

1. Obtén una API key de OpenAI
2. Agrega `OPENAI_API_KEY=sk-...` al archivo `.env` del backend
3. El sistema usará GPT-3.5-turbo para clasificación

## 🔔 Notificaciones

El sistema envía notificaciones automáticas cuando:

- Se crea una nueva incidencia (a administradores)
- Cambia el estado de una incidencia (a residentes y proveedores)
- Se asigna un proveedor (a proveedores)

### Configuración de Email

Para habilitar emails reales, configura en `.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-password-app
```

Sin configuración, los emails se simulan en la consola.

## 📊 Analytics

El panel de analytics incluye:

- Incidencias por categoría
- Incidencias por estado y prioridad
- Tiempo promedio de resolución
- Ranking de proveedores
- Gráficos interactivos

## 🗄️ Base de Datos

### Tablas Principales

- **usuarios**: Usuarios del sistema (residentes, admins, proveedores)
- **edificios**: Edificios registrados
- **proveedores**: Proveedores de servicios
- **incidencias**: Incidencias reportadas

Ver `backend/sql/schema.sql` para el esquema completo.

## 🛠️ Scripts Disponibles

### Backend
- `npm start` - Iniciar servidor en producción
- `npm run dev` - Iniciar servidor en desarrollo
- `npm run db:migrate` - Ejecutar migraciones
- `npm run db:seed` - Poblar base de datos con datos de prueba

## 🔐 Seguridad

- Autenticación JWT
- Passwords hasheados con bcrypt
- Validación de entrada con express-validator
- CORS configurado
- Middleware de autorización por roles

## 📱 Frontends

### Admin Panel (`http://localhost:5173`)
- Dashboard con métricas
- Gestión de incidencias
- Gestión de proveedores
- Analytics y reportes

### Portal Residente (`http://localhost:5174`)
- Reportar nuevas incidencias
- Ver estado de incidencias
- Seguimiento en tiempo real

## 🐛 Troubleshooting

### Error de conexión a PostgreSQL
- Verifica que PostgreSQL esté corriendo
- Revisa las credenciales en `.env`
- Asegúrate de que la base de datos `inmotech` exista

### Error de CORS
- Verifica las URLs en `FRONTEND_ADMIN_URL` y `FRONTEND_RESIDENTE_URL` en `.env`

### Imágenes no se cargan
- Verifica que el directorio `backend/uploads` exista
- Revisa los permisos del directorio

## 📝 Próximas Mejoras

- [ ] App móvil nativa (React Native)
- [ ] Notificaciones push reales
- [ ] Chat en tiempo real
- [ ] Sistema de comentarios en incidencias
- [ ] Exportación de reportes PDF
- [ ] Integración con más proveedores de IA
- [ ] Sistema de calificaciones

## 📄 Licencia

ISC

## 👥 Contribuidores

Desarrollado como MVP funcional para Inmotech.

---

**¿Necesitas ayuda?** Revisa la documentación de la API o abre un issue.

