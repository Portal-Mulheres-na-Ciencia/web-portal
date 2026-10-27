import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

/**
 * Padrão único para telas sem conteúdo: lista vazia, busca sem resultado ou erro.
 * Ações (botões/links) entram por projeção de conteúdo.
 */
@Component({
  imports: [MatIconModule],
  selector: 'app-estado-vazio',
  template: `
    <mat-icon class="icone" aria-hidden="true">{{ icone() }}</mat-icon>
    <h2 class="titulo">{{ titulo() }}</h2>
    @if (mensagem()) {
      <p class="mensagem">{{ mensagem() }}</p>
    }
    <div class="acoes"><ng-content /></div>
  `,
  styleUrl: './estado-vazio.css',
})
export class EstadoVazioComponent {
  readonly icone = input('search_off');
  readonly titulo = input.required<string>();
  readonly mensagem = input('');
}
