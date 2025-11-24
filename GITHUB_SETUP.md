# 🚀 Configuración de GitHub

## Paso 1: Crear el repositorio en GitHub

1. Ve a https://github.com/new
2. Nombre del repositorio: `inmotech` (o el nombre que prefieras)
3. Descripción: "Sistema de gestión de incidencias con IA para edificios"
4. **NO marques** "Initialize this repository with a README" (ya tenemos uno)
5. Elige si será público o privado
6. Haz clic en **"Create repository"**

## Paso 2: Conectar el repositorio local con GitHub

Después de crear el repositorio, GitHub te mostrará comandos. Ejecuta estos comandos:

```bash
# Reemplaza TU_USUARIO con tu nombre de usuario de GitHub
git remote add origin https://github.com/TU_USUARIO/inmotech.git
git branch -M main
git push -u origin main
```

O si prefieres usar SSH:

```bash
git remote add origin git@github.com:TU_USUARIO/inmotech.git
git branch -M main
git push -u origin main
```

## Alternativa: Script Automático

Si ya creaste el repositorio, puedes ejecutar:

**Windows:**
```powershell
.\setup-github.ps1 TU_USUARIO
```

**Linux/Mac:**
```bash
chmod +x setup-github.sh
./setup-github.sh TU_USUARIO
```

Reemplaza `TU_USUARIO` con tu nombre de usuario de GitHub.

## Verificar

Después de hacer push, verifica en:
https://github.com/TU_USUARIO/inmotech

¡Tu código debería estar visible! 🎉

