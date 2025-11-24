# 🚀 Inicio Rápido - Inmotech

## Opción 1: Docker (Más Fácil) ⭐

```bash
# 1. Clonar o navegar al proyecto
cd inmotech

# 2. Iniciar todo con Docker
docker-compose up -d

# 3. Esperar ~30 segundos para que todo inicie

# 4. Abrir en el navegador:
#    - Admin: http://localhost:5173
#    - Residente: http://localhost:5174
```

**Credenciales:**
- Admin: `admin@inmotech.com` / `admin123`
- Residente: `juan@example.com` / `residente123`

---

## Opción 2: Manual (Sin Docker)

### 1. PostgreSQL

```bash
# Opción A: Docker solo para PostgreSQL
docker run -d \
  --name inmotech-postgres \
  -e POSTGRES_DB=inmotech \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:15-alpine

# Opción B: PostgreSQL local
createdb inmotech
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# Editar .env si es necesario
npm run db:migrate
npm run db:seed
npm run dev
```

### 3. Frontend Admin

```bash
cd frontend-admin
npm install
npm run dev
```

### 4. Frontend Residente

```bash
cd frontend-residente
npm install
npm run dev
```

---

## Verificar que todo funciona

1. ✅ Backend: http://localhost:3000/health
2. ✅ Admin: http://localhost:5173
3. ✅ Residente: http://localhost:5174

---

## Problemas Comunes

### Puerto 5432 en uso
```bash
# Cambiar puerto en docker-compose.yml o .env
DB_PORT=5433
```

### Error de permisos en uploads
```bash
mkdir -p backend/uploads
chmod 755 backend/uploads
```

### Base de datos no existe
```bash
# Crear manualmente
createdb inmotech
# O ejecutar migración
cd backend && npm run db:migrate
```

---

## Comandos Útiles

```bash
# Ver logs de Docker
docker-compose logs -f

# Detener servicios
docker-compose down

# Reiniciar servicios
docker-compose restart

# Ver estado
docker-compose ps
```

---

¡Listo para usar! 🎉

