import { Component, signal } from '@angular/core';
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
  protected cientista = signal<Cientista>({
    id: 1,
    areas: [
      { id: 1, nome: 'Física', descricao: '', cientistas: [] },
      { id: 2, nome: 'Química', descricao: '', cientistas: [] },
    ],
    biografia:
      'A primeira mulher a ganhar o premio nobel e revolucionar o estudo da radioatividade.',
    contribuicoes: [],
    dataFalecimento: new Date('07/11/1867'),
    dataNascimento: new Date('04/07/1934'),
    instituicao: 'Universidade de Paris',
    nacionalidade: 'Francesa',
    nome: 'Maria Salomea Skłodowska-Curie',
    premios: [],
  });

  protected rolarParaSecao(id: string) {
    const secao = document.getElementById(id);
    if (secao) {
      secao.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
