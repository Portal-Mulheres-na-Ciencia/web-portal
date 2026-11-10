import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CientistaService } from '../../services/cientista';
import { cientistaDoDia, periodoDeVida } from '../../util/cientista';
import { aoFalhar } from '../../util/carregamento';
import { Area } from '../../core/area';
import { CardCientistaComponent } from '../compartilhado/card-cientista/card-cientista';
import { MonogramaComponent } from '../compartilhado/monograma/monograma';
import { ErroCarregamentoComponent } from '../compartilhado/erro-carregamento/erro-carregamento';

@Component({
  imports: [
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    CardCientistaComponent,
    MonogramaComponent,
    ErroCarregamentoComponent,
  ],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class HomePage {
  private readonly cientistaService = inject(CientistaService);
  private readonly router = inject(Router);

  /** Fica verdadeiro se a API não responder; a página mostra um aviso no lugar do conteúdo. */
  protected readonly erro = signal(false);
  protected readonly cientistas = toSignal(this.cientistaService.listar().pipe(aoFalhar(this.erro, [])));
  protected readonly areas = toSignal(this.cientistaService.listarAreas().pipe(aoFalhar(this.erro, [])));

  protected readonly destaqueDoDia = computed(() => cientistaDoDia(this.cientistas() ?? []));
  protected readonly periodoDestaque = computed(() => {
    const destaque = this.destaqueDoDia();
    return destaque ? periodoDeVida(destaque) : '';
  });

  /** Brasileiras primeiro: o portal quer dar visibilidade especialmente a elas. */
  protected readonly brasileiras = computed(() =>
    (this.cientistas() ?? [])
      .filter((c) => c.nacionalidade === 'Brasileira' && c !== this.destaqueDoDia())
      .slice(0, 3),
  );

  /** Total de cientistas da área: vem pronto da API ou é contado a partir da lista. */
  protected totalDe(area: Area): number {
    return area.totalCientistas ?? area.cientistas.length;
  }

  protected buscar(evento: Event, termo: string): void {
    evento.preventDefault();
    const busca = termo.trim();
    this.router.navigate(['/cientistas'], { queryParams: busca ? { busca } : {} });
  }
}
