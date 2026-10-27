import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RodapeComponent } from './components/rodape/rodape';
import { CabecalhoComponent } from './components/compartilhado/cabecalho/cabecalho';

@Component({
  imports: [RouterOutlet, CabecalhoComponent, RodapeComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('portal-mulheres-na-ciencia');
}
