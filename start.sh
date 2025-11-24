#!/bin/bash

echo "🚀 Iniciando Inmotech MVP..."

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor instala Docker primero."
    exit 1
fi

# Verificar si docker-compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose no está instalado. Por favor instala docker-compose primero."
    exit 1
fi

echo "📦 Iniciando servicios con Docker Compose..."
docker-compose up -d

echo "⏳ Esperando a que los servicios estén listos..."
sleep 10

echo "✅ Servicios iniciados!"
echo ""
echo "📍 URLs disponibles:"
echo "   - Backend API: http://localhost:3000"
echo "   - Frontend Admin: http://localhost:5173"
echo "   - Frontend Residente: http://localhost:5174"
echo ""
echo "📋 Credenciales de prueba:"
echo "   Admin: admin@inmotech.com / admin123"
echo "   Residente: juan@example.com / residente123"
echo ""
echo "Para ver los logs: docker-compose logs -f"
echo "Para detener: docker-compose down"

