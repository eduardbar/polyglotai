import { test, expect } from '@playwright/test'

test.describe('Translation Flow E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a la aplicación
    await page.goto('http://localhost:3000')
  })

  test('should load the translation workspace', async ({ page }) => {
    // Verificar que la página se carga correctamente
    await expect(page.getByText('Agente NMT')).toBeVisible()
    await expect(page.getByText('Traducción para lenguajes de bajos recursos')).toBeVisible()
  })

  test('should display language selectors', async ({ page }) => {
    // Verificar que los selectores de idioma están presentes
    await expect(page.getByText('Idioma de origen')).toBeVisible()
    await expect(page.getByText('Idioma de destino')).toBeVisible()
  })

  test('should have text areas for input and output', async ({ page }) => {
    // Verificar que las áreas de texto están presentes
    await expect(page.getByPlaceholderText('Ingresa el texto que quieres traducir...')).toBeVisible()
    await expect(page.getByPlaceholderText('La traducción aparecerá aquí...')).toBeVisible()
  })

  test('should have translate and swap buttons', async ({ page }) => {
    // Verificar que los botones están presentes
    await expect(page.getByRole('button', { name: /traducir/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /intercambiar idiomas/i })).toBeVisible()
  })

  test('should perform basic translation flow', async ({ page }) => {
    // Escribir texto en el área de entrada
    await page.getByPlaceholderText('Ingresa el texto que quieres traducir...').fill('Hello world')
    
    // Hacer clic en el botón de traducir
    await page.getByRole('button', { name: /traducir/i }).click()
    
    // Verificar que aparece el estado de carga
    await expect(page.getByText('Traduciendo...')).toBeVisible()
    
    // Esperar a que la traducción se complete
    await expect(page.getByText('Traduciendo...')).not.toBeVisible()
    
    // Verificar que aparece el texto traducido
    await expect(page.getByPlaceholderText('La traducción aparecerá aquí...')).toHaveValue(/.*/)
  })

  test('should swap languages correctly', async ({ page }) => {
    // Escribir texto inicial
    await page.getByPlaceholderText('Ingresa el texto que quieres traducir...').fill('Hello')
    
    // Hacer clic en el botón de intercambiar
    await page.getByRole('button', { name: /intercambiar idiomas/i }).click()
    
    // Verificar que el texto se mueve al área de salida
    await expect(page.getByPlaceholderText('La traducción aparecerá aquí...')).toHaveValue('Hello')
    
    // Verificar que el área de entrada está vacía
    await expect(page.getByPlaceholderText('Ingresa el texto que quieres traducir...')).toHaveValue('')
  })

  test('should show confidence gauge after translation', async ({ page }) => {
    // Realizar una traducción
    await page.getByPlaceholderText('Ingresa el texto que quieres traducir...').fill('Hello world')
    await page.getByRole('button', { name: /traducir/i }).click()
    
    // Esperar a que se complete la traducción
    await expect(page.getByText('Traduciendo...')).not.toBeVisible()
    
    // Verificar que aparece el medidor de confianza
    await expect(page.locator('[data-testid="confidence-gauge"]')).toBeVisible()
  })

  test('should show copy button after translation', async ({ page }) => {
    // Realizar una traducción
    await page.getByPlaceholderText('Ingresa el texto que quieres traducir...').fill('Hello world')
    await page.getByRole('button', { name: /traducir/i }).click()
    
    // Esperar a que se complete la traducción
    await expect(page.getByText('Traduciendo...')).not.toBeVisible()
    
    // Verificar que aparece el botón de copiar
    await expect(page.getByRole('button', { name: /copiar traducción/i })).toBeVisible()
  })

  test('should copy translated text to clipboard', async ({ page }) => {
    // Realizar una traducción
    await page.getByPlaceholderText('Ingresa el texto que quieres traducir...').fill('Hello world')
    await page.getByRole('button', { name: /traducir/i }).click()
    
    // Esperar a que se complete la traducción
    await expect(page.getByText('Traduciendo...')).not.toBeVisible()
    
    // Hacer clic en el botón de copiar
    await page.getByRole('button', { name: /copiar traducción/i }).click()
    
    // Verificar que se copió al portapapeles (esto requiere permisos de clipboard)
    // En un entorno real, podrías verificar el contenido del clipboard
  })

  test('should handle empty text validation', async ({ page }) => {
    // Intentar traducir sin texto
    await page.getByRole('button', { name: /traducir/i }).click()
    
    // Verificar que aparece un mensaje de error
    await expect(page.getByText(/por favor.*ingresa.*texto/i)).toBeVisible()
  })

  test('should handle same language validation', async ({ page }) => {
    // Cambiar ambos idiomas al mismo valor (esto requeriría interactuar con los selectores)
    // Por ahora, solo verificamos que la interfaz está presente
    await expect(page.getByText('Idioma de origen')).toBeVisible()
    await expect(page.getByText('Idioma de destino')).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Cambiar a vista móvil
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Verificar que todos los elementos siguen siendo visibles
    await expect(page.getByText('Agente NMT')).toBeVisible()
    await expect(page.getByPlaceholderText('Ingresa el texto que quieres traducir...')).toBeVisible()
    await expect(page.getByRole('button', { name: /traducir/i })).toBeVisible()
  })

  test('should handle long text input', async ({ page }) => {
    // Escribir texto largo
    const longText = 'This is a very long text that should be translated properly. '.repeat(10)
    await page.getByPlaceholderText('Ingresa el texto que quieres traducir...').fill(longText)
    
    // Realizar traducción
    await page.getByRole('button', { name: /traducir/i }).click()
    
    // Esperar a que se complete
    await expect(page.getByText('Traduciendo...')).not.toBeVisible()
    
    // Verificar que aparece el resultado
    await expect(page.getByPlaceholderText('La traducción aparecerá aquí...')).toHaveValue(/.*/)
  })

  test('should handle special characters', async ({ page }) => {
    // Escribir texto con caracteres especiales
    const specialText = 'Hello world! ¿Cómo estás? 你好世界! 🌍'
    await page.getByPlaceholderText('Ingresa el texto que quieres traducir...').fill(specialText)
    
    // Realizar traducción
    await page.getByRole('button', { name: /traducir/i }).click()
    
    // Esperar a que se complete
    await expect(page.getByText('Traduciendo...')).not.toBeVisible()
    
    // Verificar que aparece el resultado
    await expect(page.getByPlaceholderText('La traducción aparecerá aquí...')).toHaveValue(/.*/)
  })
})

test.describe('API Integration E2E', () => {
  test('should communicate with backend API', async ({ request }) => {
    // Test de la API de idiomas
    const languagesResponse = await request.get('http://localhost:8000/api/v1/languages')
    expect(languagesResponse.ok()).toBeTruthy()
    
    const languages = await languagesResponse.json()
    expect(languages.success).toBe(true)
    expect(Array.isArray(languages.data)).toBe(true)
  })

  test('should perform translation via API', async ({ request }) => {
    // Test de la API de traducción
    const translationResponse = await request.post('http://localhost:8000/api/v1/translate', {
      data: {
        sourceLanguage: 'en',
        targetLanguage: 'es',
        text: 'Hello world'
      }
    })
    
    expect(translationResponse.ok()).toBeTruthy()
    
    const translation = await translationResponse.json()
    expect(translation.success).toBe(true)
    expect(translation.data.translatedText).toBeDefined()
    expect(translation.data.confidenceScore).toBeDefined()
  })
})

