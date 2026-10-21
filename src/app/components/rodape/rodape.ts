import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [RouterLink, MatIconModule],
  selector: 'app-rodape',
  styleUrl: './rodape.css',
  templateUrl: './rodape.html',
})
export class RodapeComponent {
  protected readonly equipe = [
    'Arthur Vieira',
    'Cleber Borges',
    'Davi Vinicius',
    'Enzo Theodoro',
    'Guilherme Rodrigues',
    'Jonathan Santos',
  ];
}
