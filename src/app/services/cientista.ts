import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { Area } from '../core/area';
import { Cientista } from '../core/cientista';
import { API_URL } from './api';

/** Formatos devolvidos pela API (veja docs/API.md no repositório api-portal). */
interface AreaApi {
  id: number;
  nome: string;
  descricao?: string;
  totalCientistas?: number;
}

interface CientistaResumoApi {
  id: number;
  nome: string;
  resumoBiografia: string;
  instituicao: string;
  dataNascimento: string | null;
  dataFalecimento: string | null;
  nacionalidade: string;
  areasAtuacao: AreaApi[];
}

interface CientistaDetalheApi extends Omit<CientistaResumoApi, 'resumoBiografia'> {
  biografia: string;
  contribuicoes: { id: number; ano: number; titulo: string; descricao: string; linkReferencia: string | null }[];
  premios: { id: number; nome: string; concedente: string; ano: number }[];
}

/** "1867-11-07" → data local (sem o deslocamento de fuso que `new Date("1867-11-07")` causaria). */
export function lerData(texto: string | null): Date | undefined {
  if (!texto) return undefined;
  const [ano, mes, dia] = texto.split('-').map(Number);
  return new Date(ano, mes - 1, dia);
}

function paraArea(area: AreaApi): Area {
  return {
    id: area.id,
    nome: area.nome,
    descricao: area.descricao ?? '',
    totalCientistas: area.totalCientistas,
    cientistas: [],
  };
}

function paraCientista(dados: CientistaResumoApi | CientistaDetalheApi): Cientista {
  const cientista: Cientista = {
    id: dados.id,
    nome: dados.nome,
    biografia: 'biografia' in dados ? dados.biografia : dados.resumoBiografia,
    instituicao: dados.instituicao,
    dataNascimento: lerData(dados.dataNascimento) as Date,
    dataFalecimento: lerData(dados.dataFalecimento),
    nacionalidade: dados.nacionalidade,
    areas: dados.areasAtuacao.map(paraArea),
    contribuicoes: [],
    premios: [],
  };
  if ('contribuicoes' in dados) {
    cientista.contribuicoes = dados.contribuicoes.map((c) => ({
      id: c.id,
      ano: c.ano,
      titulo: c.titulo,
      descricao: c.descricao,
      linkReferencia: c.linkReferencia ?? '',
      autores: [],
    }));
    cientista.premios = dados.premios.map((p) => ({
      cientista,
      ano: p.ano,
      premio: { id: p.id, nome: p.nome, concedente: p.concedente },
    }));
  }
  return cientista;
}

/** Busca as cientistas na API do back-end. */
@Service()
export class CientistaService {
  private readonly http = inject(HttpClient);

  /** Perfil completo. Devolve `null` quando a cientista não existe (404); outros erros seguem adiante. */
  buscar(idCientista: number): Observable<Cientista | null> {
    return this.http.get<CientistaDetalheApi>(`${API_URL}/cientistas/${idCientista}`).pipe(
      map(paraCientista),
      catchError((erro: HttpErrorResponse) => (erro.status === 404 ? of(null) : throwError(() => erro))),
    );
  }
  /** Lista resumida, em ordem alfabética (a biografia vem resumida pela API). */
  listar(): Observable<Cientista[]> {
    return this.http
      .get<CientistaResumoApi[]>(`${API_URL}/cientistas`)
      .pipe(map((lista) => lista.map(paraCientista)));
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
  /** Áreas com o total de cientistas de cada uma. */
  listarAreas(): Observable<Area[]> {
    return this.http.get<AreaApi[]>(`${API_URL}/areas`).pipe(map((areas) => areas.map(paraArea)));
  }

  private filtrar(criterio: (cientista: Cientista) => boolean): Observable<Cientista[]> {
    return this.listar().pipe(map((lista) => lista.filter(criterio)));
  }
}
