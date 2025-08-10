import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, source_lang, target_lang } = body;

    if (!text || !source_lang || !target_lang) {
      return NextResponse.json(
        { success: false, error: 'Faltan parámetros requeridos' },
        { status: 400 }
      );
    }

    // Simulación de traducción
    const translatedText = `[Traducido de ${source_lang} a ${target_lang}] ${text}`;
    
    return NextResponse.json({
      success: true,
      data: {
        translatedText,
        confidenceScore: 0.85,
        sourceLanguage: source_lang,
        targetLanguage: target_lang
      }
    });
  } catch (error) {
    console.error('Error en traducción:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
