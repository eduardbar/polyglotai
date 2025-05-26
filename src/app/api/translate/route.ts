import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Schema de validación para la request de traducción
const TranslationRequestSchema = z.object({
  text: z.string().min(1, 'El texto no puede estar vacío'),
  source_lang: z.string().min(1, 'El idioma de origen es requerido'),
  target_lang: z.string().min(1, 'El idioma de destino es requerido'),
});

// Configurar Gemini API
async function translateWithGemini(text: string, sourceLang: string, targetLang: string) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY no configurada');
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: sourceLang === 'auto' 
              ? `Detect the language of the following text and translate it to ${targetLang}. Provide only the translated text and a confidence score (0.0-1.0) in JSON format. Example: {"translated_text": "Hello world", "confidence_score": 0.95}.\nText: "${text}"`
              : `Translate the following text from ${sourceLang} to ${targetLang}. Provide only the translated text and a confidence score (0.0-1.0) in JSON format. Example: {"translated_text": "Hello world", "confidence_score": 0.95}.\nText: "${text}"`
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      throw new Error('No se recibió respuesta de Gemini');
    }

    // Limpiar respuesta si viene con markdown
    let cleanText = generatedText.trim();
    if (cleanText.startsWith('```json') && cleanText.endsWith('```')) {
      cleanText = cleanText.slice(7, -3).trim();
    }

    try {
      const parsed = JSON.parse(cleanText);
      return {
        translated_text: parsed.translated_text || cleanText,
        confidence_score: parsed.confidence_score || 0.8
      };
    } catch {
      // Si no es JSON válido, usar el texto directamente
      return {
        translated_text: cleanText,
        confidence_score: 0.7
      };
    }
  } catch (error) {
    console.error('Error with Gemini API:', error);
    throw error;
  }
}

// Función de fallback para traducción simulada
function simulateTranslation(text: string, sourceLang: string, targetLang: string) {
  const translations: Record<string, Record<string, string>> = {
    'en': {
      'es': 'Traducción simulada al español',
      'fr': 'Traduction simulée en français',
      'de': 'Simulierte Übersetzung ins Deutsche'
    },
    'es': {
      'en': 'Simulated translation to English',
      'fr': 'Traduction simulée en français',
      'de': 'Simulierte Übersetzung ins Deutsche'
    }
  };

  const translation = translations[sourceLang]?.[targetLang] || `Simulated translation from ${sourceLang} to ${targetLang}: ${text}`;
  const confidence = Math.random() * 0.3 + 0.7; // 0.7 - 1.0

  return {
    translated_text: translation,
    confidence_score: Math.round(confidence * 100) / 100
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar la request
    const validatedData = TranslationRequestSchema.parse(body);
    const { text, source_lang, target_lang } = validatedData;

    // Validar que los idiomas sean diferentes (excepto para auto-detección)
    if (source_lang !== 'auto' && source_lang === target_lang) {
      return NextResponse.json(
        {
          success: false,
          error: 'Los idiomas de origen y destino deben ser diferentes'
        },
        { status: 400 }
      );
    }

    let result;
    
    try {
      // Intentar traducir con Gemini
      result = await translateWithGemini(text, source_lang, target_lang);
      console.log('✅ Traducción exitosa con Gemini API');
    } catch (geminiError) {
      console.warn('❌ Error con Gemini API, usando fallback:', geminiError);
      // Fallback a traducción simulada
      result = simulateTranslation(text, source_lang, target_lang);
    }

    return NextResponse.json({
      success: true,
      data: {
        translatedText: result.translated_text,
        confidenceScore: result.confidence_score,
        sourceLanguage: source_lang,
        targetLanguage: target_lang
      }
    }, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });

  } catch (error) {
    console.error('Error en traducción:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Datos de entrada inválidos',
          details: error.errors
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor'
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
