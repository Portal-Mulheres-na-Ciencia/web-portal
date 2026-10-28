import { Component, computed, input } from '@angular/core';

/** Pares container/on-container do tema (contraste AA); a cor é fixa por id. */
const TONS = ['primary', 'tertiary', 'secondary'] as const;

/**
 * Iniciais da cientista. Substitui fotos, que ainda não existem no modelo de dados,
 * sem inventar imagens.
 */
@Component({
  selector: 'app-monograma',
  template: `<span aria-hidden="true">{{ iniciais() }}</span>`,
  styleUrl: './monograma.css',
  host: {
    '[class]': '"tom-" + tom() + " tamanho-" + tamanho()',
  },
})
export class MonogramaComponent {
  readonly nome = input.required<string>();
  readonly id = input(0);
  readonly tamanho = input<'p' | 'm' | 'g'>('m');

  protected readonly iniciais = computed(() => {
    const partes = this.nome()
      .split(/\s+/)
      .filter((parte) => parte.length > 2 || parte === this.nome());
    const primeira = partes[0]?.[0] ?? '';
    const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
    return (primeira + ultima).toLocaleUpperCase('pt-BR');
  });

  protected readonly tom = computed(() => TONS[this.id() % TONS.length]);
}
