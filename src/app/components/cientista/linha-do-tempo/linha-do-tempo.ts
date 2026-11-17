import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ItemLinhaDoTempo } from '../../../core/item-linha-do-tempo';
import { PremioRecebido } from '../../../core/premio-recebido';

/**
 * Contribuições e prêmios em ordem cronológica.
 * A cor indica o tipo do marco (contribuição = primária, prêmio = terciária) e vem sempre
 * acompanhada de ícone e rótulo, para não depender só da cor.
 */
@Component({
  imports: [MatIconModule],
  selector: 'app-linha-do-tempo',
  styleUrl: './linha-do-tempo.css',
  templateUrl: './linha-do-tempo.html',
})
export class LinhaDoTempoComponent {
  readonly itens = input.required<ItemLinhaDoTempo[]>();

  isPremioRecebido(value: ItemLinhaDoTempo): value is PremioRecebido {
    return 'premio' in value;
  }
}
