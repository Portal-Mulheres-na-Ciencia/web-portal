import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { map } from 'rxjs';
import { AuthService } from '../../../services/auth';
import { CientistaService } from '../../../services/cientista';
import { CuradoriaService } from '../../../services/curadoria';
import { aoFalhar } from '../../../util/carregamento';
import { ErroCarregamentoComponent } from '../../compartilhado/erro-carregamento/erro-carregamento';

/** Primeira tela da área da equipe: números do portal e atalhos. */
@Component({
  imports: [RouterLink, MatButtonModule, MatIconModule, ErroCarregamentoComponent],
  selector: 'app-painel',
  styleUrl: './painel.css',
  template: `
    <div class="container pagina-admin">
      <header class="cabecalho-admin">
        <div>
          <p class="sobretitulo">Painel</p>
          <h1 class="titulo-pagina">Olá, {{ auth.usuario()?.nome }}</h1>
        </div>
      </header>

      @if (erro()) {
        <app-erro-carregamento />
      } @else {
        <ul class="indicadores">
          <li class="cartao-admin">
            <mat-icon aria-hidden="true">groups</mat-icon>
            <strong>{{ totalCientistas() ?? '…' }}</strong>
            <span>{{ totalCientistas() === 1 ? 'cientista no portal' : 'cientistas no portal' }}</span>
            <a matButton routerLink="/admin/cientistas">Gerenciar cientistas</a>
          </li>
          <li class="cartao-admin">
            <mat-icon aria-hidden="true">inbox</mat-icon>
            <strong>{{ sugestoesPendentes() ?? '…' }}</strong>
            <span>{{ sugestoesPendentes() === 1 ? 'sugestão aguardando avaliação' : 'sugestões aguardando avaliação' }}</span>
            <a matButton routerLink="/admin/sugestoes">Avaliar sugestões</a>
          </li>
        </ul>

        <div class="acoes">
          <a matButton="filled" routerLink="/admin/cientistas/nova">
            <mat-icon aria-hidden="true">add</mat-icon>Cadastrar cientista
          </a>
          <a matButton="outlined" routerLink="/cientistas">
            <mat-icon aria-hidden="true">visibility</mat-icon>Ver o site
          </a>
        </div>
      }
    </div>
  `,
})
export class PainelPage {
  protected readonly auth = inject(AuthService);
  protected readonly erro = signal(false);

  protected readonly totalCientistas = toSignal(
    inject(CientistaService)
      .listar()
      .pipe(map((lista) => lista.length), aoFalhar(this.erro, 0)),
  );

  protected readonly sugestoesPendentes = toSignal(
    inject(CuradoriaService)
      .listarSugestoes('PENDENTE')
      .pipe(map((lista) => lista.length), aoFalhar(this.erro, 0)),
  );
}
