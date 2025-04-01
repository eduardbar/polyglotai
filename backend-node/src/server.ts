import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Importar rutas
import languageRoutes from './routes/languageRoutes';
import translationRoutes from './routes/translationRoutes';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware de seguridad
app.use(helmet());

// Middleware de CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

// Middleware de logging
app.use(morgan('combined'));

// Middleware para parsear JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rutas de la API
app.use('/api/v1/languages', languageRoutes);
app.use('/api/v1', translationRoutes);

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Agente NMT API funcionando correctamente',
    timestamp: new Date().toISOString(),
  });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Bienvenido a la API de Agente NMT',
    version: '1.0.0',
    endpoints: {
      languages: '/api/v1/languages',
      translate: '/api/v1/translate',
      history: '/api/v1/translations/history',
    },
  });
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada',
  });
});

// Middleware de manejo de errores global (debe ir después de las rutas)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Errores de parseo de JSON (body-parser)
  if (err && (err.type === 'entity.parse.failed' || err instanceof SyntaxError)) {
    return res.status(400).json({
      success: false,
      error: 'JSON inválido en el cuerpo de la solicitud',
    });
  }

  console.error('Error no manejado:', err);

  const status = (typeof err?.statusCode === 'number' && err.statusCode >= 400 && err.statusCode < 600)
    ? err.statusCode
    : 500;
  const message = (err && err.expose && typeof err.message === 'string')
    ? err.message
    : 'Error interno del servidor';

  return res.status(status).json({
    success: false,
    error: message,
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor Agente NMT ejecutándose en puerto ${PORT}`);
  console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
});

export default app;

