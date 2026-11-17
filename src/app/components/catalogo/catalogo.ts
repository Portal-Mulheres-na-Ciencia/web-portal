import { Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CientistaService } from '../../services/cientista';
import { normalizarTexto } from '../../util/cientista';
import { CardCientistaComponent } from '../compartilhado/card-cientista/card-cientista';
import { EstadoVazioComponent } from '../compartilhado/estado-vazio/estado-vazio';

/**
 * Catálogo com busca e filtro por área.
 * O estado dos filtros fica na URL (?busca=…&area=…): o link pode ser compartilhado
 * e o botão voltar do navegador desfaz o filtro.
 */
@Component({
  imports: [
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    CardCientistaComponent,
    EstadoVazioComponent,
  ],
  selector: 'app-catalogo',
  styleUrl: './catalogo.css',
  templateUrl: './catalogo.html',
})
export class CatalogoPage {
  private readonly cientistaService = inject(CientistaService);
  private readonly router = inject(Router);

  /** Preenchidos pelos parâmetros de consulta da URL (withComponentInputBinding). */
  readonly busca = input<string>();
  readonly area = input<string>();

  protected readonly cientistas = toSignal(this.cientistaService.listar());
  protected readonly areas = toSignal(this.cientistaService.listarAreas(), { initialValue: [] });

  protected readonly idArea = computed(() => {
    const id = Number(this.area());
    return Number.isInteger(id) && id > 0 ? id : null;
  });

  protected readonly nomeArea = computed(
    () => this.areas().find((a) => a.id === this.idArea())?.nome ?? null,
  );

  protected readonly temFiltro = computed(() => !!this.busca()?.trim() || this.idArea() !== null);

  protected readonly resultado = computed(() => {
    const todas = this.cientistas();
    if (!todas) return null;
    const termo = normalizarTexto(this.busca() ?? '');
    const idArea = this.idArea();
    return todas
      .filter((c) => idArea === null || c.areas.some((a) => a.id === idArea))
      .filter(
        (c) =>
          !termo ||
          normalizarTexto(c.nome).includes(termo) ||
          normalizarTexto(c.instituicao).includes(termo),
      )
      .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  });

  protected readonly resumo = computed(() => {
    const total = this.resultado()?.length ?? 0;
    const plural = total === 1 ? 'cientista encontrada' : 'cientistas encontradas';
    return `${total} ${plural}`;
  });

  protected alterarBusca(termo: string): void {
    // replaceUrl: digitar não deve criar uma entrada no histórico para cada letra.
    this.atualizarFiltros({ busca: termo.trim() || null }, true);
  }

  protected alterarArea(id: number | null): void {
    this.atualizarFiltros({ area: id });
  }

  protected limparFiltros(): void {
    this.atualizarFiltros({ busca: null, area: null });
  }

  private atualizarFiltros(filtros: Record<string, string | number | null>, substituir = false) {
    this.router.navigate([], {
      queryParams: filtros,
      queryParamsHandling: 'merge',
      replaceUrl: substituir,
    });
  }
}
