# 🌍 PolyglotAI - El Políglota Digital

**Traductor inteligente con IA para 100+ idiomas** - Una aplicación moderna de traducción con integración de Google Gemini AI, búsqueda inteligente de idiomas y diseño glassmorphism.

## ✨ Características Principales

- 🤖 **Inteligencia Artificial**: Integración con Google Gemini AI para traducciones precisas
- 🔍 **Búsqueda Inteligente**: Encuentra idiomas rápidamente con búsqueda en tiempo real
- 🌐 **100+ Idiomas**: Soporte extenso incluyendo idiomas de bajos recursos
- 🎨 **Diseño Glassmorphism**: Interface moderna con efectos de cristal y animaciones suaves
- 📱 **Responsive**: Optimizado para todos los dispositivos
- ⚡ **Detección Automática**: Identifica automáticamente el idioma de origen
- 📊 **Métricas de Confianza**: Visualización del nivel de certeza de las traducciones
- 🎯 **UX Optimizada**: Navegación intuitiva con teclado y accesos directos

## 🚀 Demo en Vivo

🌟 **[Ver PolyglotAI en Vercel →](https://agente-241x7uwlu-eduardbars-projects.vercel.app)**

## 🛠️ Tecnologías

### Frontend
- **Next.js 15** con App Router
- **TypeScript** para type safety
- **Tailwind CSS** para estilos modernos
- **React Hooks** para estado
- **Glassmorphism UI** con efectos visuales

### Backend & AI
- **Google Gemini AI** para traducción inteligente
- **Next.js API Routes** como serverless functions
- **Vercel Edge Functions** para rendimiento global

### UI/UX
- **Diseño Glassmorphism** con backdrop-filter
- **Animaciones CSS** suaves y modernas
- **Paleta de colores** profesional y accesible
- **Responsive Design** mobile-first

## 📦 Instalación Local

### Prerrequisitos
- Node.js 18+
- API Key de Google Gemini

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/eduardbar/polyglotai.git
cd polyglotai
```

2. **Instalar dependencias**
```bash
cd agente-nmt
npm install
```

3. **Configurar variables de entorno**
```bash
cp env.example .env.local
```

Editar `.env.local`:
```env
GEMINI_API_KEY=tu_api_key_de_gemini_aqui
```

4. **Ejecutar en modo desarrollo**
```bash
npm run dev
```

5. **Acceder a la aplicación**
Abrir http://localhost:3000

## 🌐 Deployment en Vercel

1. **Fork el repositorio** en GitHub
2. **Conectar con Vercel** desde tu dashboard
3. **Configurar variables de entorno** en Vercel:
   - `GEMINI_API_KEY`: Tu API key de Google Gemini
4. **Deploy automático** en cada push

## 🎯 Uso

1. **Seleccionar idiomas**: Usa los selectores con búsqueda inteligente
2. **Escribir texto**: En el panel de entrada
3. **Traducir**: Click en el botón o presiona Ctrl+Enter
4. **Ver resultado**: Con métricas de confianza
5. **Copiar**: Resultado con un click

## 🔧 API de Google Gemini

Para obtener tu API key:

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crea una nueva API key
3. Agrégala a tu archivo `.env.local`

## 📊 Características Técnicas

### Idiomas Soportados
- **100+ idiomas** incluyendo:
  - Idiomas principales (Inglés, Español, Francés, etc.)
  - Idiomas asiáticos (Chino, Japonés, Coreano, etc.)
  - Idiomas de bajos recursos (Quechua, Guaraní, etc.)

### Rendimiento
- **Traducción en tiempo real** con Gemini AI
- **Búsqueda instantánea** de idiomas
- **Carga optimizada** con Next.js
- **Edge Functions** para baja latencia

### Accesibilidad
- **Navegación con teclado** completa
- **Colores de alto contraste**
- **Texto legible** en todos los tamaños
- **Responsive** en todos los dispositivos

## 🏗️ Arquitectura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Routes    │    │   Gemini AI     │
│   (Next.js)     │◄──►│   (Serverless)  │◄──►│   (Google)      │
│   Vercel        │    │   Vercel Edge   │    │   Cloud         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🧪 Testing

```bash
# Ejecutar tests
npm run test

# Tests en modo watch
npm run test:watch

# Build de producción
npm run build
```

## 📁 Estructura del Proyecto

```
polyglotai/
├── agente-nmt/                # Frontend Next.js
│   ├── src/
│   │   ├── app/              # App Router & API Routes
│   │   │   ├── api/          # Serverless functions
│   │   │   ├── globals.css   # Estilos globales
│   │   │   └── page.tsx      # Página principal
│   │   ├── components/       # Componentes React
│   │   │   ├── ui/          # Componentes base
│   │   │   └── translation/  # Lógica de traducción
│   │   ├── data/            # Datos de idiomas
│   │   ├── hooks/           # Hooks personalizados
│   │   └── types/           # Tipos TypeScript
│   ├── public/              # Archivos estáticos
│   ├── package.json         # Dependencias
│   └── next.config.ts       # Configuración Next.js
└── README.md               # Este archivo
```

## 🤝 Contribución

¡Las contribuciones son bienvenidas!

1. **Fork** el proyecto
2. **Crear** una rama feature (`git checkout -b feature/NuevaCaracteristica`)
3. **Commit** los cambios (`git commit -m 'feat: agregar nueva característica'`)
4. **Push** a la rama (`git push origin feature/NuevaCaracteristica`)
5. **Abrir** un Pull Request

## 🎨 Personalización

### Colores
Los colores se pueden personalizar en `src/app/globals.css`:
```css
:root {
  --background: 255 255 255;    /* Blanco */
  --surface: 248 250 252;       /* Gris claro */
  --primary-500: 59 130 246;    /* Azul */
}
```

### Idiomas
Agregar nuevos idiomas en `src/data/languages.ts`:
```typescript
{
  id: 'nuevo',
  code: 'xx',
  name: 'Nuevo Idioma',
  nativeName: 'Native Name',
  isLowResource: false
}
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver [LICENSE](LICENSE) para detalles.

## 🙏 Agradecimientos

- **Google Gemini AI** - Por la tecnología de traducción
- **Vercel** - Por el hosting y deployment
- **Next.js** - Por el framework
- **Tailwind CSS** - Por los estilos

## 📞 Soporte

- 🐛 **Issues**: [GitHub Issues](https://github.com/eduardbar/polyglotai/issues)
- 💬 **Discusiones**: [GitHub Discussions](https://github.com/eduardbar/polyglotai/discussions)
- 📧 **Email**: [eduardo@ejemplo.com](mailto:eduardo@ejemplo.com)

---

**Desarrollado con ❤️ para conectar culturas a través del lenguaje**

[![Vercel](https://img.shields.io/badge/deployed%20on-Vercel-000000?style=flat-square&logo=vercel)](https://vercel.com)
[![Next.js](https://img.shields.io/badge/built%20with-Next.js-000000?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/typed%20with-TypeScript-3178C6?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/styled%20with-Tailwind%20CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)