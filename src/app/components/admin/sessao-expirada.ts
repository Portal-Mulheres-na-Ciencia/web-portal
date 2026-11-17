import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../services/auth';
import { API_URL } from '../../services/api';

/** Se a sessão expirar no meio do uso, leva para a tela de entrar e depois volta para a mesma página. */
export const sessaoExpiradaInterceptor: HttpInterceptorFn = (requisicao, proximo) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return proximo(requisicao).pipe(
    catchError((erro: unknown) => {
      if (erro instanceof HttpErrorResponse && erro.status === 401 && requisicao.url.startsWith(`${API_URL}/admin`)) {
        auth.limpar();
        router.navigate(['/admin/entrar'], { queryParams: { voltar: router.url } });
      }
      return throwError(() => erro);
    }),
  );
};
