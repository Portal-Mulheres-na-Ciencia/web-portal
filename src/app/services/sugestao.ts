import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { NovaSugestao, SugestaoCriada } from '../core/sugestao';
import { API_URL } from './api';

/** Envia sugestões de novas cientistas para a API, que grava no banco. */
@Service()
export class SugestaoService {
  private readonly http = inject(HttpClient);

  enviar(sugestao: NovaSugestao): Observable<SugestaoCriada> {
    return this.http.post<SugestaoCriada>(`${API_URL}/sugestoes`, sugestao);
  }
}
