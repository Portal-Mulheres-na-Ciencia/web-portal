import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {
  provideRouter,
  TitleStrategy,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';
import { routes } from './app.routes';
import { TituloPaginaStrategy } from './titulo-pagina';
import { sessaoExpiradaInterceptor } from './components/admin/sessao-expirada';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay()),
    // O HttpClient já envia o token CSRF (cookie XSRF-TOKEN) nos pedidos que alteram dados.
    provideHttpClient(withFetch(), withInterceptors([sessaoExpiradaInterceptor])),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
    ),
    { provide: TitleStrategy, useClass: TituloPaginaStrategy },
  ],
};
