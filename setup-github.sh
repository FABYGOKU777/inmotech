#!/bin/bash

if [ -z "$1" ]; then
    echo "❌ Error: Debes proporcionar tu nombre de usuario de GitHub"
    echo "Uso: ./setup-github.sh TU_USUARIO"
    exit 1
fi

GITHUB_USER=$1
REPO_NAME="inmotech"

echo "🔗 Conectando repositorio local con GitHub..."

# Verificar si ya existe el remote
if git remote get-url origin &>/dev/null; then
    echo "⚠️  Ya existe un remote 'origin'"
    read -p "¿Deseas reemplazarlo? (s/n): " response
    if [[ "$response" =~ ^[Ss]$ ]]; then
        git remote remove origin
    else
        echo "❌ Operación cancelada"
        exit 1
    fi
fi

# Agregar remote
echo "📡 Agregando remote origin..."
git remote add origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"

# Cambiar branch a main
echo "🌿 Cambiando branch a main..."
git branch -M main

# Push
echo "⬆️  Subiendo código a GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ¡Éxito! Tu código está en GitHub:"
    echo "   https://github.com/$GITHUB_USER/$REPO_NAME"
else
    echo ""
    echo "❌ Error al hacer push. Verifica:"
    echo "   1. Que el repositorio exista en GitHub"
    echo "   2. Que tengas permisos de escritura"
    echo "   3. Que tus credenciales estén configuradas"
fi

