import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PremioRecebido } from '../../../core/premio-recebido';

@Component({
  imports: [MatIconModule],
  selector: 'app-premiacao',
  styleUrl: './premiacao.css',
  templateUrl: './premiacao.html',
})
export class PremiacaoComponent {
  readonly premio = input.required<PremioRecebido>();
}
