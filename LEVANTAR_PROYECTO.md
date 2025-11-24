# 🚀 Cómo Levantar el Proyecto Inmotech

## Requisitos Previos

- Docker Desktop instalado y corriendo
- Git (opcional, solo si necesitas actualizar el código)

## Pasos para Levantar el Proyecto

### 1. Abrir Docker Desktop
Asegúrate de que Docker Desktop esté corriendo en tu computadora.

### 2. Navegar al directorio del proyecto
```powershell
cd C:\Users\fabyx\inmotech
```

### 3. Levantar todos los servicios
```powershell
docker-compose up -d
```

Este comando:
- Descargará las imágenes necesarias (si no están)
- Construirá los contenedores
- Iniciará todos los servicios en segundo plano
- Ejecutará las migraciones de base de datos
- Poblará la base de datos con datos de prueba

### 4. Esperar a que todo esté listo
Espera aproximadamente 30-60 segundos para que todos los servicios se inicialicen.

### 5. Verificar que todo esté corriendo
```powershell
docker-compose ps
```

Deberías ver 4 contenedores corriendo:
- `inmotech-postgres` (PostgreSQL)
- `inmotech-backend` (API Backend)
- `inmotech-admin` (Frontend Admin)
- `inmotech-residente` (Frontend Residente)

### 6. Acceder a las aplicaciones

Una vez que todo esté corriendo, abre tu navegador en:

- **Panel Administrador**: http://localhost:5173
  - Email: `admin@inmotech.com`
  - Password: `admin123`

- **Portal Residente**: http://localhost:5174
  - Email: `juan@example.com`
  - Password: `residente123`

- **API Backend**: http://localhost:3000
  - Health Check: http://localhost:3000/health

## Comandos Útiles

### Ver logs en tiempo real
```powershell
docker-compose logs -f
```

### Ver logs de un servicio específico
```powershell
docker-compose logs -f backend
docker-compose logs -f frontend-admin
docker-compose logs -f frontend-residente
```

### Reiniciar un servicio específico
```powershell
docker-compose restart backend
```

### Detener todos los servicios
```powershell
docker-compose down
```

### Detener y eliminar volúmenes (⚠️ Esto borra la base de datos)
```powershell
docker-compose down -v
```

### Reconstruir los contenedores (si hay cambios en el código)
```powershell
docker-compose up -d --build
```

## Solución de Problemas

### Si Docker Desktop no está corriendo
1. Abre Docker Desktop
2. Espera a que aparezca "Docker Desktop is running"
3. Vuelve a ejecutar `docker-compose up -d`

### Si los puertos están en uso
Si obtienes un error de puerto en uso, puedes:
1. Detener otros servicios que usen esos puertos (3000, 5173, 5174, 5432)
2. O cambiar los puertos en `docker-compose.yml`

### Si hay errores de conexión
1. Verifica que todos los contenedores estén corriendo: `docker-compose ps`
2. Revisa los logs: `docker-compose logs backend`
3. Reinicia los servicios: `docker-compose restart`

### Si necesitas resetear la base de datos
```powershell
docker-compose down -v
docker-compose up -d
```

Esto eliminará todos los datos y volverá a crear la base de datos desde cero.

## Notas Importantes

✅ **Los datos se guardan automáticamente** en el volumen de Docker `inmotech_postgres_data`
✅ **No necesitas reinstalar dependencias** - todo está en los contenedores
✅ **El código está sincronizado** - los cambios en los archivos se reflejan automáticamente
✅ **Puedes apagar tu computadora** - los datos están seguros en el volumen de Docker

## Estado Actual

- ✅ Proyecto detenido correctamente
- ✅ Base de datos guardada en volumen de Docker
- ✅ Código actualizado en GitHub
- ✅ Listo para volver a levantar cuando lo necesites

---

**¡Listo!** Cuando quieras volver a trabajar, solo ejecuta `docker-compose up -d` y todo estará funcionando en menos de un minuto. 🚀

