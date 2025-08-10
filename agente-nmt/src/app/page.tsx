import { TranslationWorkspace } from '@/components/translation/TranslationWorkspace';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="glass-card border border-surface-glass-border/60 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-text-primary tracking-tight">
                PolyglotAI
              </h1>
              <p className="text-text-secondary text-sm">
                El políglota digital - Traductor inteligente con IA
              </p>
            </div>
            <div className="text-right">
              <p className="text-text-secondary text-xs">
                Powered by AI
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <div className="py-8">
        <TranslationWorkspace />
      </div>

      {/* Footer */}
      <footer className="glass-card border border-surface-glass-border/60 mt-auto">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="text-center">
            <p className="text-text-secondary text-sm">
              © 2025 PolyglotAI - El políglota digital que conecta culturas
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
