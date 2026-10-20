import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { ItemLinhaDoTempo } from '../../../core/item-linha-do-tempo';
import { Contribuicao } from '../../../core/contribuicao';
import { PremioRecebido } from '../../../core/premio-recebido';

interface ItemPrototipo {
  id: number;
  ano: number;
  icone: string;
  titulo: string;
}

@Component({
  imports: [MatIconModule, MatChipsModule],
  selector: 'app-linha-do-tempo',
  styleUrl: './linha-do-tempo.css',
  templateUrl: './linha-do-tempo.html',
})
export class LinhaDoTempoComponent {
  readonly itens = input.required<ItemLinhaDoTempo[]>();

  /**
   * Calcula a cor dinâmica proporcional ao longo do gradiente
   */
  protected calcularCor(index: number, total: number): string {
    if (total <= 1) return 'var(--grad-inicio)';
    const p = index / (total - 1);

    if (p <= 0.5) {
      const pct = (p / 0.5) * 100;
      return `color-mix(in srgb, var(--grad-meio) ${pct}%, var(--grad-inicio))`;
    } else {
      const pct = ((p - 0.5) / 0.5) * 100;
      return `color-mix(in srgb, var(--grad-fim) ${pct}%, var(--grad-meio))`;
    }
  }

  isPremioRecebido(value: ItemLinhaDoTempo): value is PremioRecebido {
    return "premio" in value;
  }
}
