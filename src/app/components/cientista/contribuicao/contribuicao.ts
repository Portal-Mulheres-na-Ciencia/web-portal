import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Contribuicao } from '../../../core/contribuicao';

@Component({
  imports: [MatIconModule],
  selector: 'app-contribuicao',
  styleUrl: './contribuicao.css',
  templateUrl: './contribuicao.html',
})
export class ContribuicaoComponent {
  readonly contribuicao = input.required<Contribuicao>();
}
