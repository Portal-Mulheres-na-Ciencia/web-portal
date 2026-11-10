import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Cientista } from '../../../core/cientista';
import { periodoDeVida } from '../../../util/cientista';
import { MonogramaComponent } from '../../compartilhado/monograma/monograma';

@Component({
  imports: [RouterLink, MatButtonModule, MatIconModule, MonogramaComponent],
  selector: 'app-hero',
  styleUrl: './hero.css',
  templateUrl: './hero.html',
})
export class HeroComponent {
  private readonly snackBar = inject(MatSnackBar);

  cientista = input.required<Cientista>();

  protected readonly periodo = computed(() => periodoDeVida(this.cientista()));

  protected readonly secoes = [
    { ancora: 'biografia', rotulo: 'Biografia' },
    { ancora: 'contribuicoes', rotulo: 'Contribuições' },
    { ancora: 'premios', rotulo: 'Prêmios' },
    { ancora: 'linha-do-tempo', rotulo: 'Linha do tempo' },
  ];

  /** Usa o compartilhamento nativo (celular) e, sem ele, copia o link com confirmação visível. */
  protected async compartilhar(): Promise<void> {
    const dados = { title: this.cientista().nome, url: location.href };
    if (navigator.share) {
      try {
        await navigator.share(dados);
      } catch {
        // Cancelado pela pessoa: nada a fazer.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(dados.url);
      this.snackBar.open('Link do perfil copiado', 'OK', { duration: 4000 });
    } catch {
      this.snackBar.open('Não foi possível copiar o link. Copie o endereço da barra do navegador.', 'OK');
    }
  }
}
