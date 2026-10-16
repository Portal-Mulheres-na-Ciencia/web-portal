import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { Cientista } from '../../../core/cientista';

@Component({
  imports: [MatButtonModule, MatIconModule, MatChipsModule, MatCardModule],
  selector: 'app-hero',
  styleUrl: './hero.css',
  templateUrl: './hero.html',
})
export class Hero {
  cientista = input.required<Cientista>();

  protected rolarParaSecao(id: string) {
    const secao = document.getElementById(id);
    if (secao) {
      secao.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
