// Configuración global para tests del backend

// Mock de variables de entorno
process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test-secret-key'
process.env.DATABASE_URL = 'mysql://test:test@localhost:3306/test_db'
process.env.NMT_SERVICE_URL = 'http://localhost:8001'
process.env.CORS_ORIGIN = 'http://localhost:3000'
process.env.PORT = '8000'

// Mock de console para tests
const originalConsoleError = console.error
const originalConsoleWarn = console.warn

beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning:')
    ) {
      return
    }
    originalConsoleError.call(console, ...args)
  }
  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning:')
    ) {
      return
    }
    originalConsoleWarn.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalConsoleError
  console.warn = originalConsoleWarn
})

// Mock de fetch global
global.fetch = jest.fn()

// Mock de Prisma usando ruta relativa para evitar problemas de alias
jest.mock('./src/utils/prisma', () => ({
  __esModule: true,
  default: {
    language: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    translationHistory: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    $disconnect: jest.fn(),
  },
}))
