# 🤖 Agente NMT - Traducción para Lenguajes de Bajos Recursos

Una aplicación completa de traducción neural para lenguajes de bajos recursos, construida con arquitectura de microservicios y diseño glassmorphism.

## 🚀 Características

- **Traducción Neural**: Soporte para múltiples idiomas incluyendo lenguajes de bajos recursos
- **Interfaz Moderna**: Diseño glassmorphism con componentes React optimizados
- **Arquitectura Microservicios**: Backend Node.js + Servicio Python NMT
- **Base de Datos**: MySQL con Prisma ORM
- **Dockerización Completa**: Todos los servicios containerizados
- **Medidor de Confianza**: Visualización en tiempo real de la calidad de traducción
- **Historial de Traducciones**: Persistencia de traducciones por usuario

## 🏗️ Arquitectura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   NMT Service   │
│   (Next.js)     │◄──►│   (Node.js)     │◄──►│   (Python)      │
│   Port: 3000    │    │   Port: 8000    │    │   Port: 8001    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Database      │
                       │   (MySQL)       │
                       │   Port: 3306    │
                       └─────────────────┘
```

## 🛠️ Tecnologías

### Frontend
- **Next.js 14** con App Router
- **TypeScript** para type safety
- **Tailwind CSS** para estilos
- **D3.js** para visualizaciones
- **Zustand** para estado global

### Backend
- **Node.js** con Express
- **TypeScript** para desarrollo
- **Prisma** como ORM
- **JWT** para autenticación
- **Zod** para validación

### Servicio NMT
- **FastAPI** para API REST
- **PyTorch** para modelos ML
- **Transformers** de Hugging Face
- **NumPy** para procesamiento

### Infraestructura
- **Docker** para containerización
- **Docker Compose** para orquestación
- **MySQL** como base de datos

## 📦 Instalación

### Prerrequisitos
- Node.js 18+
- Python 3.9+
- Docker y Docker Compose
- MySQL (opcional para desarrollo local)

### Desarrollo Local

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd agente-nmt
```

2. **Instalar dependencias del frontend**
```bash
npm install
```

3. **Instalar dependencias del backend**
```bash
cd backend-node
npm install
```

4. **Configurar base de datos**
```bash
# Generar cliente Prisma
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate

# Poblar con datos iniciales
npm run prisma:seed
```

5. **Ejecutar servicios**

**Opción A: Desarrollo local**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend Node.js
cd backend-node
npm run dev

# Terminal 3 - Servicio Python NMT
cd backend-python
python main.py
```

**Opción B: Con Docker**
```bash
# Construir y ejecutar todos los servicios
docker-compose up --build
```

## 🚀 Uso

1. **Acceder a la aplicación**: http://localhost:3000
2. **Seleccionar idiomas**: Origen y destino
3. **Ingresar texto**: En el panel izquierdo
4. **Traducir**: Hacer clic en "Traducir"
5. **Ver confianza**: Medidor visual de calidad
6. **Copiar resultado**: Botón de copiar en el panel derecho

## 📚 API Endpoints

### Idiomas
- `GET /api/v1/languages` - Listar todos los idiomas
- `GET /api/v1/languages/:code` - Obtener idioma específico

### Traducción
- `POST /api/v1/translate` - Realizar traducción
- `GET /api/v1/translations/history` - Historial de traducciones

### Salud
- `GET /health` - Estado de la API
- `GET /` - Información de la API

## 🔧 Configuración

### Variables de Entorno

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

**Backend Node.js (.env)**
```env
DATABASE_URL="mysql://user:password@localhost:3306/nmt_db"
JWT_SECRET="your-super-secret-jwt-key"
NMT_SERVICE_URL="http://localhost:8001"
CORS_ORIGIN="http://localhost:3000"
PORT=8000
NODE_ENV=development
```

**Servicio Python (.env)**
```env
MODEL_PATH=/app/models/nmt_v1.pt
```

## 🧪 Testing

### Frontend
```bash
npm run test
npm run test:watch
```

### Backend
```bash
cd backend-node
npm run test
```

### E2E
```bash
npm run test:e2e
```

## 📊 Monitoreo

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Servicio NMT**: http://localhost:8001
- **Base de datos**: localhost:3306
- **Prisma Studio**: `npm run prisma:studio`

## 🐳 Docker

### Construir imágenes
```bash
docker-compose build
```

### Ejecutar servicios
```bash
docker-compose up -d
```

### Ver logs
```bash
docker-compose logs -f
```

### Detener servicios
```bash
docker-compose down
```

## 📁 Estructura del Proyecto

```
agente-nmt/
├── src/                    # Frontend Next.js
│   ├── app/               # App Router
│   ├── components/        # Componentes React
│   │   ├── ui/           # Componentes base
│   │   ├── translation/   # Componentes de traducción
│   │   └── analytics/     # Componentes de análisis
│   ├── hooks/            # Hooks personalizados
│   ├── lib/              # Utilidades y API
│   └── types/            # Tipos TypeScript
├── backend-node/          # API Node.js
│   ├── src/
│   │   ├── controllers/  # Controladores
│   │   ├── middleware/   # Middleware
│   │   ├── routes/       # Rutas
│   │   ├── services/     # Servicios
│   │   ├── types/        # Tipos
│   │   └── utils/        # Utilidades
│   └── prisma/           # Esquema de BD
├── backend-python/        # Servicio NMT
│   └── main.py           # FastAPI service
├── docker-compose.yml     # Orquestación
├── Dockerfile.frontend    # Frontend Docker
└── README.md             # Documentación
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit los cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🙏 Agradecimientos

- **Hugging Face** por los modelos de transformers
- **Prisma** por el ORM moderno
- **Vercel** por Next.js
- **Tailwind CSS** por el framework de estilos

## 📞 Soporte

Para soporte, crear un issue en GitHub.

---

**Desarrollado con ❤️ para lenguajes de bajos recursos**

