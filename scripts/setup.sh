#!/bin/bash

# Script de inicialización para Agente NMT
echo "🚀 Iniciando setup de Agente NMT..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar prerrequisitos
print_status "Verificando prerrequisitos..."

# Verificar Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js no está instalado. Por favor instala Node.js 18+"
    exit 1
fi

# Verificar npm
if ! command -v npm &> /dev/null; then
    print_error "npm no está instalado"
    exit 1
fi

# Verificar Python
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 no está instalado. Por favor instala Python 3.9+"
    exit 1
fi

# Verificar Docker
if ! command -v docker &> /dev/null; then
    print_warning "Docker no está instalado. Algunas funcionalidades pueden no estar disponibles"
fi

print_status "Prerrequisitos verificados ✅"

# Instalar dependencias del frontend
print_status "Instalando dependencias del frontend..."
npm install

if [ $? -eq 0 ]; then
    print_status "Dependencias del frontend instaladas ✅"
else
    print_error "Error instalando dependencias del frontend"
    exit 1
fi

# Instalar dependencias del backend Node.js
print_status "Instalando dependencias del backend Node.js..."
cd backend-node
npm install

if [ $? -eq 0 ]; then
    print_status "Dependencias del backend Node.js instaladas ✅"
else
    print_error "Error instalando dependencias del backend Node.js"
    exit 1
fi

# Generar cliente Prisma
print_status "Generando cliente Prisma..."
npm run prisma:generate

if [ $? -eq 0 ]; then
    print_status "Cliente Prisma generado ✅"
else
    print_error "Error generando cliente Prisma"
    exit 1
fi

cd ..

# Instalar dependencias del servicio Python
print_status "Instalando dependencias del servicio Python..."
cd backend-python

# Verificar si pip está disponible
if command -v pip3 &> /dev/null; then
    pip3 install -r requirements.txt
elif command -v pip &> /dev/null; then
    pip install -r requirements.txt
else
    print_error "pip no está instalado"
    exit 1
fi

if [ $? -eq 0 ]; then
    print_status "Dependencias del servicio Python instaladas ✅"
else
    print_error "Error instalando dependencias del servicio Python"
    exit 1
fi

cd ..

# Crear archivos de configuración
print_status "Creando archivos de configuración..."

# Crear .env.local para frontend
if [ ! -f .env.local ]; then
    echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1" > .env.local
    print_status "Archivo .env.local creado ✅"
fi

# Crear .env para backend
if [ ! -f backend-node/.env ]; then
    cat > backend-node/.env << EOF
DATABASE_URL="mysql://user:password@localhost:3306/nmt_db"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
NMT_SERVICE_URL="http://localhost:8001"
CORS_ORIGIN="http://localhost:3000"
PORT=8000
NODE_ENV=development"
EOF
    print_status "Archivo .env del backend creado ✅"
fi

print_status "Setup completado exitosamente! 🎉"
echo ""
echo "📋 Próximos pasos:"
echo "1. Configurar base de datos MySQL"
echo "2. Ejecutar migraciones: cd backend-node && npm run prisma:migrate"
echo "3. Poblar datos iniciales: npm run prisma:seed"
echo "4. Iniciar servicios:"
echo "   - Frontend: npm run dev"
echo "   - Backend: cd backend-node && npm run dev"
echo "   - NMT Service: cd backend-python && python main.py"
echo ""
echo "🌐 O usar Docker: docker-compose up --build"

