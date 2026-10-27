import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Cientista } from '../../../core/cientista';
import { periodoDeVida } from '../../../util/cientista';
import { MonogramaComponent } from '../monograma/monograma';

/** Resumo da cientista usado no catálogo e na página inicial. O card inteiro leva ao perfil. */
@Component({
  imports: [RouterLink, MonogramaComponent],
  selector: 'app-card-cientista',
  styleUrl: './card-cientista.css',
  templateUrl: './card-cientista.html',
})
export class CardCientistaComponent {
  readonly cientista = input.required<Cientista>();

  protected readonly periodo = computed(() => periodoDeVida(this.cientista()));
}
