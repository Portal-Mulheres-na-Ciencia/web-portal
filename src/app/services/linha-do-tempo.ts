import { Service } from '@angular/core';
import { Contribuicao } from '../core/contribuicao';
import { Observable, of } from 'rxjs';
import { PremioRecebido } from '../core/premio-recebido';
import { ItemLinhaDoTempo } from '../core/item-linha-do-tempo';

@Service()
export class LinhaDoTempoService {
  /**
   * Constrói a linha do tempo geral de uma cientista.
   *
   * @param idCientista Identificador único da cientista.
   * @returns Uma lista unificada de contribuições e prêmios, ordenada cronologicamente pelo ano.
   */
  public buscarDe(idCientista: number): Observable<ItemLinhaDoTempo[]> {
    return of([]);
  }

  /**
   * Constrói a linha do tempo de contribuições de uma cientista.
   *
   * @param idCientista Identificador único da cientista.
   * @returns Uma lista unificada de contribuições, ordenada cronologicamente pelo ano.
   */
  buscarContribuicoesDe(idCientista: number): Observable<Contribuicao[]> {
    return of([]);
  }

  /**
   * Constrói a linha do tempo de premiações de uma cientista.
   *
   * @param idCientista Identificador único da cientista.
   * @returns Uma lista unificada de premiações, ordenada cronologicamente pelo ano.
   */
  buscarPremiosDe(idCientista: number): Observable<PremioRecebido[]> {
    return of([]);
  }
}
