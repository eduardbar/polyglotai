import { NextResponse } from 'next/server';

export async function GET() {
  const languages = [
    { id: 1, code: 'en', name: 'English', nativeName: 'English', isLowResource: false },
    { id: 2, code: 'es', name: 'Español', nativeName: 'Español', isLowResource: false },
    { id: 3, code: 'fr', name: 'Français', nativeName: 'Français', isLowResource: false },
  ];

  return NextResponse.json({
    success: true,
    data: languages,
    count: languages.length
  });
}