import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

/**
 * Cabeçalho fixo com a marca e a navegação principal.
 * Com só dois destinos, a navegação continua visível no celular em vez de ir para um menu oculto.
 */
@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-cabecalho',
  styleUrl: './cabecalho.css',
  templateUrl: './cabecalho.html',
})
export class CabecalhoComponent {
  protected readonly links = [
    { rota: '/', rotulo: 'Início', exato: true },
    { rota: '/cientistas', rotulo: 'Cientistas', exato: false },
  ];
}
