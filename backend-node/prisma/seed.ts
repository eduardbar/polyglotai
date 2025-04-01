import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Crear idiomas de ejemplo
  const languages = [
    { code: 'en', name: 'English', isLowResource: false },
    { code: 'es', name: 'Español', isLowResource: false },
    { code: 'fr', name: 'Français', isLowResource: false },
    { code: 'de', name: 'Deutsch', isLowResource: false },
    { code: 'it', name: 'Italiano', isLowResource: false },
    { code: 'pt', name: 'Português', isLowResource: false },
    { code: 'nl', name: 'Nederlands', isLowResource: false },
    { code: 'ru', name: 'Русский', isLowResource: false },
    { code: 'ja', name: '日本語', isLowResource: false },
    { code: 'zh', name: '中文', isLowResource: false },
    { code: 'ar', name: 'العربية', isLowResource: true },
    { code: 'ibo', name: 'Igbo', isLowResource: true },
    { code: 'yo', name: 'Yoruba', isLowResource: true },
    { code: 'ha', name: 'Hausa', isLowResource: true },
    { code: 'sw', name: 'Swahili', isLowResource: true },
  ];

  console.log('📝 Creando idiomas...');
  
  for (const language of languages) {
    await prisma.language.upsert({
      where: { code: language.code },
      update: language,
      create: language,
    });
  }

  console.log('✅ Seed completado exitosamente');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

