import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, source_lang, target_lang } = body;

    // Simulación simple
    const translatedText = `Traducción de "${text}" de ${source_lang} a ${target_lang}`;
    
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
    return NextResponse.json(
      { success: false, error: 'Error en traducción' },
      { status: 500 }
    );
  }
}