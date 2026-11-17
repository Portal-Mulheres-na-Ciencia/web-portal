import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../../services/auth';

/** Só deixa abrir a área da equipe com login; sem login, vai para a tela de entrar e depois volta. */
export const autenticadoGuard: CanActivateFn = (_rota, estado) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.usuario()) {
    return true;
  }
  return auth
    .verificarSessao()
    .pipe(map((logado) => logado || router.createUrlTree(['/admin/entrar'], { queryParams: { voltar: estado.url } })));
};
