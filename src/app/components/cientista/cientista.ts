import { Component, computed, effect, inject, input, numberAttribute, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { startWith, switchMap } from 'rxjs';
import { HeroComponent } from './hero/hero';
import { CientistaService } from '../../services/cientista';
import { LinhaDoTempoComponent } from './linha-do-tempo/linha-do-tempo';
import { ContribuicaoComponent } from './contribuicao/contribuicao';
import { PremiacaoComponent } from './premiacao/premiacao';
import { EstadoVazioComponent } from '../compartilhado/estado-vazio/estado-vazio';
import { ErroCarregamentoComponent } from '../compartilhado/erro-carregamento/erro-carregamento';
import { aoFalhar } from '../../util/carregamento';
import { NOME_SITE } from '../../titulo-pagina';
import { ItemLinhaDoTempo } from '../../core/item-linha-do-tempo';

@Component({
  imports: [
    RouterLink,
    MatButtonModule,
    HeroComponent,
    LinhaDoTempoComponent,
    ContribuicaoComponent,
    PremiacaoComponent,
    EstadoVazioComponent,
    ErroCarregamentoComponent,
  ],
  selector: 'app-cientista',
  styleUrl: './cientista.css',
  templateUrl: './cientista.html',
})
export class CientistaPage {
  private readonly cientistaService = inject(CientistaService);
  private readonly title = inject(Title);

  public readonly id = input.required({ transform: numberAttribute });

  // switchMap recarrega quando só o :id muda (o Angular reaproveita o componente nesse caso).
  private readonly id$ = toObservable(this.id);

  /** Fica verdadeiro se a API não responder (diferente de "não encontrada"). */
  protected readonly erro = signal(false);

  /** `undefined` enquanto carrega, `null` quando o id não existe. */
  protected readonly cientista = toSignal(
    this.id$.pipe(
      switchMap((id) =>
        this.cientistaService.buscar(id).pipe(aoFalhar(this.erro, null), startWith(undefined)),
      ),
    ),
  );

  protected readonly contribuicoes = computed(() =>
    [...(this.cientista()?.contribuicoes ?? [])].sort((a, b) => a.ano - b.ano),
  );
  protected readonly premios = computed(() =>
    [...(this.cientista()?.premios ?? [])].sort((a, b) => a.ano - b.ano),
  );

  /** Contribuições e prêmios juntos, em ordem cronológica (sem uma segunda chamada à API). */
  protected readonly linhaDoTempo = computed<ItemLinhaDoTempo[]>(() =>
    [...this.contribuicoes(), ...this.premios()].sort((a, b) => a.ano - b.ano),
  );

  constructor() {
    effect(() => {
      const cientista = this.cientista();
      if (cientista) this.title.setTitle(`${cientista.nome} · ${NOME_SITE}`);
    });
  }
}
