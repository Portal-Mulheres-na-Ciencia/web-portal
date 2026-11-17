import { RenderMode, ServerRoute } from '@angular/ssr';
import { CIENTISTAS } from './services/dados-exemplo';

export const serverRoutes: ServerRoute[] = [
  // Área da equipe: somente no cliente (autenticação por cookie)
  { path: 'admin/**', renderMode: RenderMode.Client },

  // Rotas públicas estáticas
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'cientistas', renderMode: RenderMode.Prerender },
  { path: 'sugerir', renderMode: RenderMode.Prerender },
  { path: 'cores', renderMode: RenderMode.Prerender },

  // Perfil dinâmico de cada cientista
  {
    path: 'cientista/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      // 1. Tenta buscar da API se informada e acessível
      const apiUrl = process.env['BUILD_API_URL'];
      if (apiUrl) {
        try {
          const res = await fetch(`${apiUrl}/cientistas`);
          if (res.ok) {
            const lista = await res.json();
            return lista.map((c: { id: number }) => ({ id: String(c.id) }));
          }
        } catch {
          // Fallback silencioso para dados locais
        }
      }
      // 2. Fallback resiliente usando dados-exemplo (garante build offline e em Docker)
      return CIENTISTAS.map((c) => ({ id: String(c.id) }));
    },
  },

  // Fallback para rotas desconhecidas (404)
  { path: '**', renderMode: RenderMode.Client },
];
