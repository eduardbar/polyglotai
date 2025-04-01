"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Iniciando seed de la base de datos...');
    const languages = [
        { code: 'en', name: 'English', isLowResource: false },
        { code: 'es', name: 'Español', isLowResource: false },
        { code: 'fr', name: 'Français', isLowResource: false },
        { code: 'de', name: 'Deutsch', isLowResource: false },
        { code: 'ibo', name: 'Igbo', isLowResource: true },
        { code: 'yo', name: 'Yoruba', isLowResource: true },
        { code: 'ha', name: 'Hausa', isLowResource: true },
        { code: 'sw', name: 'Swahili', isLowResource: true },
        { code: 'pt', name: 'Português', isLowResource: false },
        { code: 'it', name: 'Italiano', isLowResource: false },
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
//# sourceMappingURL=seed.js.map