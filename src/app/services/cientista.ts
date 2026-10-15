import { Service } from '@angular/core';
import { Cientista } from '../core/cientista';
import { Observable, of } from 'rxjs';

@Service()
export class CientistaService {
  buscar(idCientista: number): Observable<Cientista | null> {
    return of(null);
  }
  listar(): Observable<Cientista[]> {
    return of([]);
  }
  listarPorArea(idArea: number): Observable<Cientista[]> {
    return of([]);
  }
  listarPorInstituicao(instituicao: string): Observable<Cientista[]> {
    return of([]);
  }
  listarPorEpoca(dataInicio: Date, dataFim: Date): Observable<Cientista[]> {
    return of([]);
  }
  listarPorNacionalidade(nacionalidade: string): Observable<Cientista[]> {
    return of([]);
  }
}
