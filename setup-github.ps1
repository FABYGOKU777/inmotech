param(
    [Parameter(Mandatory=$true)]
    [string]$GitHubUser
)

$RepoName = "inmotech"

Write-Host "🔗 Conectando repositorio local con GitHub..." -ForegroundColor Cyan

# Verificar si ya existe el remote
$existingRemote = git remote get-url origin 2>$null
if ($existingRemote) {
    Write-Host "⚠️  Ya existe un remote 'origin': $existingRemote" -ForegroundColor Yellow
    $response = Read-Host "¿Deseas reemplazarlo? (s/n)"
    if ($response -eq "s" -or $response -eq "S") {
        git remote remove origin
    } else {
        Write-Host "❌ Operación cancelada" -ForegroundColor Red
        exit 1
    }
}

# Agregar remote
Write-Host "📡 Agregando remote origin..." -ForegroundColor Cyan
git remote add origin "https://github.com/$GitHubUser/$RepoName.git"

# Cambiar branch a main
Write-Host "🌿 Cambiando branch a main..." -ForegroundColor Cyan
git branch -M main

# Push
Write-Host "⬆️  Subiendo código a GitHub..." -ForegroundColor Cyan
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ ¡Éxito! Tu código está en GitHub:" -ForegroundColor Green
    Write-Host "   https://github.com/$GitHubUser/$RepoName" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "❌ Error al hacer push. Verifica:" -ForegroundColor Red
    Write-Host "   1. Que el repositorio exista en GitHub" -ForegroundColor Yellow
    Write-Host "   2. Que tengas permisos de escritura" -ForegroundColor Yellow
    Write-Host "   3. Que tus credenciales estén configuradas" -ForegroundColor Yellow
}

