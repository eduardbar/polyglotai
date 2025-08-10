import { NextResponse } from 'next/server';

export async function GET() {
  const languages = [
    { id: 1, code: 'en', name: 'English', nativeName: 'English', isLowResource: false },
    { id: 2, code: 'es', name: 'Español', nativeName: 'Español', isLowResource: false },
    { id: 3, code: 'fr', name: 'Français', nativeName: 'Français', isLowResource: false },
    { id: 4, code: 'de', name: 'Deutsch', nativeName: 'Deutsch', isLowResource: false },
    { id: 5, code: 'it', name: 'Italiano', nativeName: 'Italiano', isLowResource: false },
    { id: 6, code: 'pt', name: 'Português', nativeName: 'Português', isLowResource: false },
    { id: 7, code: 'ru', name: 'Russian', nativeName: 'Русский', isLowResource: false },
    { id: 8, code: 'ja', name: 'Japanese', nativeName: '日本語', isLowResource: false },
    { id: 9, code: 'ko', name: 'Korean', nativeName: '한국어', isLowResource: false },
    { id: 10, code: 'zh', name: 'Chinese (Simplified)', nativeName: '中文 (简体)', isLowResource: false },
  ];

  return NextResponse.json({
    success: true,
    data: languages,
    count: languages.length
  });
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
