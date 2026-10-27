import { Service } from '@angular/core';
import { Cientista } from '../core/cientista';
import { Area } from '../core/area';
import { delay, Observable, of } from 'rxjs';
import { AREAS, CIENTISTAS } from './dados-exemplo';

/** Simula a latência da rede para que os estados de carregamento apareçam. */
const LATENCIA_MS = 300;

@Service()
export class CientistaService {
  buscar(idCientista: number): Observable<Cientista | null> {
    const cientista = CIENTISTAS.find((c) => c.id === idCientista) ?? null;
    return of(cientista).pipe(delay(LATENCIA_MS));
  }
  listar(): Observable<Cientista[]> {
    return this.filtrar(() => true);
  }
  listarPorArea(idArea: number): Observable<Cientista[]> {
    return this.filtrar((c) => c.areas.some((area) => area.id === idArea));
  }
  listarPorInstituicao(instituicao: string): Observable<Cientista[]> {
    return this.filtrar((c) => c.instituicao === instituicao);
  }
  listarPorEpoca(dataInicio: Date, dataFim: Date): Observable<Cientista[]> {
    return this.filtrar((c) => c.dataNascimento >= dataInicio && c.dataNascimento <= dataFim);
  }
  listarPorNacionalidade(nacionalidade: string): Observable<Cientista[]> {
    return this.filtrar((c) => c.nacionalidade === nacionalidade);
  }
  listarAreas(): Observable<Area[]> {
    return of(AREAS).pipe(delay(LATENCIA_MS));
  }

  private filtrar(criterio: (cientista: Cientista) => boolean): Observable<Cientista[]> {
    return of(CIENTISTAS.filter(criterio)).pipe(delay(LATENCIA_MS));
  }
}
