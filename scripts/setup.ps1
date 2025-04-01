# Script de inicialización para Agente NMT (Windows PowerShell)
Write-Host "🚀 Iniciando setup de Agente NMT..." -ForegroundColor Green

# Función para imprimir mensajes
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Verificar prerrequisitos
Write-Status "Verificando prerrequisitos..."

# Verificar Node.js
try {
    $nodeVersion = node --version
    Write-Status "Node.js encontrado: $nodeVersion"
} catch {
    Write-Error "Node.js no está instalado. Por favor instala Node.js 18+"
    exit 1
}

# Verificar npm
try {
    $npmVersion = npm --version
    Write-Status "npm encontrado: $npmVersion"
} catch {
    Write-Error "npm no está instalado"
    exit 1
}

# Verificar Python
try {
    $pythonVersion = python --version
    Write-Status "Python encontrado: $pythonVersion"
} catch {
    Write-Error "Python no está instalado. Por favor instala Python 3.9+"
    exit 1
}

# Verificar Docker
try {
    $dockerVersion = docker --version
    Write-Status "Docker encontrado: $dockerVersion"
} catch {
    Write-Warning "Docker no está instalado. Algunas funcionalidades pueden no estar disponibles"
}

Write-Status "Prerrequisitos verificados ✅"

# Instalar dependencias del frontend
Write-Status "Instalando dependencias del frontend..."
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Status "Dependencias del frontend instaladas ✅"
} else {
    Write-Error "Error instalando dependencias del frontend"
    exit 1
}

# Instalar dependencias del backend Node.js
Write-Status "Instalando dependencias del backend Node.js..."
Set-Location backend-node
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Status "Dependencias del backend Node.js instaladas ✅"
} else {
    Write-Error "Error instalando dependencias del backend Node.js"
    exit 1
}

# Generar cliente Prisma
Write-Status "Generando cliente Prisma..."
npm run prisma:generate

if ($LASTEXITCODE -eq 0) {
    Write-Status "Cliente Prisma generado ✅"
} else {
    Write-Error "Error generando cliente Prisma"
    exit 1
}

Set-Location ..

# Instalar dependencias del servicio Python
Write-Status "Instalando dependencias del servicio Python..."
Set-Location backend-python

try {
    pip install -r requirements.txt
    Write-Status "Dependencias del servicio Python instaladas ✅"
} catch {
    Write-Error "Error instalando dependencias del servicio Python"
    exit 1
}

Set-Location ..

# Crear archivos de configuración
Write-Status "Creando archivos de configuración..."

# Crear .env.local para frontend
if (-not (Test-Path ".env.local")) {
    "NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1" | Out-File -FilePath ".env.local" -Encoding UTF8
    Write-Status "Archivo .env.local creado ✅"
}

# Crear .env para backend
if (-not (Test-Path "backend-node/.env")) {
    @"
DATABASE_URL="mysql://user:password@localhost:3306/nmt_db"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
NMT_SERVICE_URL="http://localhost:8001"
CORS_ORIGIN="http://localhost:3000"
PORT=8000
NODE_ENV=development
"@ | Out-File -FilePath "backend-node/.env" -Encoding UTF8
    Write-Status "Archivo .env del backend creado ✅"
}

Write-Status "Setup completado exitosamente! 🎉"
Write-Host ""
Write-Host "📋 Próximos pasos:" -ForegroundColor Cyan
Write-Host "1. Configurar base de datos MySQL"
Write-Host "2. Ejecutar migraciones: cd backend-node && npm run prisma:migrate"
Write-Host "3. Poblar datos iniciales: npm run prisma:seed"
Write-Host "4. Iniciar servicios:"
Write-Host "   - Frontend: npm run dev"
Write-Host "   - Backend: cd backend-node && npm run dev"
Write-Host "   - NMT Service: cd backend-python && python main.py"
Write-Host ""
Write-Host "🌐 O usar Docker: docker-compose up --build" -ForegroundColor Yellow

