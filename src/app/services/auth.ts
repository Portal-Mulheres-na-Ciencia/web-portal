import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { catchError, finalize, map, Observable, of, tap } from 'rxjs';
import { Usuario } from '../core/usuario';
import { API_URL } from './api';

/**
 * Login da equipe. A sessão fica num cookie que só o navegador envia;
 * aqui guardamos apenas quem está logado, para mostrar na tela.
 */
@Service()
export class AuthService {
  private readonly http = inject(HttpClient);

  /** `undefined`: ainda não conferiu; `null`: ninguém logado. */
  readonly usuario = signal<Usuario | null | undefined>(undefined);

  /** Pergunta à API se a sessão ainda vale. Nunca dá erro: devolve `true` ou `false`. */
  verificarSessao(): Observable<boolean> {
    return this.http.get<Usuario>(`${API_URL}/auth/eu`).pipe(
      tap((usuario) => this.usuario.set(usuario)),
      map(() => true),
      catchError(() => {
        this.usuario.set(null);
        return of(false);
      }),
    );
  }

  entrar(email: string, senha: string): Observable<Usuario> {
    return this.http
      .post<Usuario>(`${API_URL}/auth/login`, { email, senha })
      .pipe(tap((usuario) => this.usuario.set(usuario)));
  }

  sair(): Observable<void> {
    return this.http.post<void>(`${API_URL}/auth/logout`, {}).pipe(finalize(() => this.limpar()));
  }

  /** Esquece o usuário (por exemplo, quando a sessão expira). */
  limpar(): void {
    this.usuario.set(null);
  }
}
