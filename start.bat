@echo off
echo 🚀 Iniciando Inmotech MVP...

REM Verificar si Docker está instalado
where docker >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Docker no está instalado. Por favor instala Docker Desktop primero.
    exit /b 1
)

echo 📦 Iniciando servicios con Docker Compose...
docker-compose up -d

echo ⏳ Esperando a que los servicios estén listos...
timeout /t 10 /nobreak >nul

echo ✅ Servicios iniciados!
echo.
echo 📍 URLs disponibles:
echo    - Backend API: http://localhost:3000
echo    - Frontend Admin: http://localhost:5173
echo    - Frontend Residente: http://localhost:5174
echo.
echo 📋 Credenciales de prueba:
echo    Admin: admin@inmotech.com / admin123
echo    Residente: juan@example.com / residente123
echo.
echo Para ver los logs: docker-compose logs -f
echo Para detener: docker-compose down

pause

