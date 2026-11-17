import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { CientistaForm, StatusSugestao, SugestaoAdmin } from '../core/curadoria';
import { Premio } from '../core/premio';
import { API_URL } from './api';
import { CientistaDetalheApi } from './cientista';

/** Chamadas da área da equipe (todas exigem login). */
@Service()
export class CuradoriaService {
  private readonly http = inject(HttpClient);

  /** Dados completos da cientista, no formato da API, para preencher o formulário de edição. */
  buscarCientista(id: number): Observable<CientistaDetalheApi> {
    return this.http.get<CientistaDetalheApi>(`${API_URL}/cientistas/${id}`);
  }

  criarCientista(dados: CientistaForm): Observable<CientistaDetalheApi> {
    return this.http.post<CientistaDetalheApi>(`${API_URL}/admin/cientistas`, dados);
  }

  atualizarCientista(id: number, dados: CientistaForm): Observable<CientistaDetalheApi> {
    return this.http.put<CientistaDetalheApi>(`${API_URL}/admin/cientistas/${id}`, dados);
  }

  excluirCientista(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/admin/cientistas/${id}`);
  }

  listarPremios(): Observable<Premio[]> {
    return this.http.get<Premio[]>(`${API_URL}/admin/premios`);
  }

  criarPremio(nome: string, concedente: string): Observable<Premio> {
    return this.http.post<Premio>(`${API_URL}/admin/premios`, { nome, concedente });
  }

  /** Sem status, traz todas as sugestões. */
  listarSugestoes(status?: StatusSugestao): Observable<SugestaoAdmin[]> {
    const params = status ? new HttpParams().set('status', status) : undefined;
    return this.http.get<SugestaoAdmin[]>(`${API_URL}/admin/sugestoes`, { params });
  }

  revisarSugestao(id: number, status: Exclude<StatusSugestao, 'PENDENTE'>): Observable<SugestaoAdmin> {
    return this.http.patch<SugestaoAdmin>(`${API_URL}/admin/sugestoes/${id}`, { status });
  }
}
