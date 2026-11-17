import { isPlatformServer } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, makeStateKey, PLATFORM_ID, Service, TransferState } from '@angular/core';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { Area } from '../core/area';
import { Cientista } from '../core/cientista';
import { API_URL } from './api';
import { AREAS, CIENTISTAS } from './dados-exemplo';

/** Formatos devolvidos pela API (veja docs/API.md no repositório api-portal). */
export interface AreaApi {
  id: number;
  nome: string;
  descricao?: string;
  totalCientistas?: number;
}

export interface CientistaResumoApi {
  id: number;
  nome: string;
  resumoBiografia: string;
  instituicao: string;
  dataNascimento: string | null;
  dataFalecimento: string | null;
  nacionalidade: string;
  areasAtuacao: AreaApi[];
}

export interface CientistaDetalheApi extends Omit<CientistaResumoApi, 'resumoBiografia'> {
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
    dataNascimento: lerData(dados.dataNascimento),
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

function formatarData(data: Date | undefined): string | null {
  if (!data) return null;
  const ano = String(data.getFullYear()).padStart(4, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

function paraAreaApi(area: Area): AreaApi {
  return {
    id: area.id,
    nome: area.nome,
    descricao: area.descricao,
    totalCientistas: area.totalCientistas ?? area.cientistas.length,
  };
}

function paraDetalheApi(c: Cientista): CientistaDetalheApi {
  return {
    id: c.id,
    nome: c.nome,
    biografia: c.biografia,
    instituicao: c.instituicao ?? '',
    dataNascimento: formatarData(c.dataNascimento),
    dataFalecimento: formatarData(c.dataFalecimento),
    nacionalidade: c.nacionalidade,
    areasAtuacao: c.areas.map(paraAreaApi),
    contribuicoes: c.contribuicoes.map((item) => ({
      id: item.id,
      ano: item.ano,
      titulo: item.titulo,
      descricao: item.descricao,
      linkReferencia: item.linkReferencia || null,
    })),
    premios: c.premios.map((p) => ({
      id: p.premio.id,
      nome: p.premio.nome,
      concedente: p.premio.concedente,
      ano: p.ano,
    })),
  };
}

const CHAVE_LISTA_CIENTISTAS = makeStateKey<CientistaDetalheApi[]>('cientistas-lista');
const CHAVE_LISTA_AREAS = makeStateKey<AreaApi[]>('areas-lista');
const chaveCientista = (id: number) => makeStateKey<CientistaDetalheApi | null>(`cientista-${id}`);

/** Busca as cientistas na API do back-end. */
@Service()
export class CientistaService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly transferState = inject(TransferState);

  private urlApiServidor(): string | null {
    const proc = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process;
    return proc?.env?.['BUILD_API_URL'] ?? null;
  }

  /** Perfil completo. Devolve `null` quando a cientista não existe (404); outros erros seguem adiante. */
  buscar(idCientista: number): Observable<Cientista | null> {
    const chave = chaveCientista(idCientista);

    if (isPlatformServer(this.platformId)) {
      const local = CIENTISTAS.find((c) => c.id === idCientista) ?? null;
      const fallback = () => {
        this.transferState.set(chave, local ? paraDetalheApi(local) : null);
        return of(local);
      };
      const apiUrl = this.urlApiServidor();
      if (!apiUrl) return fallback();
      return this.http.get<CientistaDetalheApi>(`${apiUrl}/cientistas/${idCientista}`).pipe(
        tap((dados) => this.transferState.set(chave, dados)),
        map(paraCientista),
        catchError((erro: HttpErrorResponse) => {
          if (erro.status === 404) {
            this.transferState.set(chave, null);
            return of(null);
          }
          return fallback();
        }),
      );
    }

    if (this.transferState.hasKey(chave)) {
      const dados = this.transferState.get(chave, null);
      this.transferState.remove(chave);
      return of(dados ? paraCientista(dados) : null);
    }

    return this.http.get<CientistaDetalheApi>(`${API_URL}/cientistas/${idCientista}`).pipe(
      map(paraCientista),
      catchError((erro: HttpErrorResponse) => (erro.status === 404 ? of(null) : throwError(() => erro))),
    );
  }
  /** Lista resumida, em ordem alfabética (a biografia vem resumida pela API). */
  listar(): Observable<Cientista[]> {
    if (isPlatformServer(this.platformId)) {
      const fallback = () => {
        this.transferState.set(CHAVE_LISTA_CIENTISTAS, CIENTISTAS.map(paraDetalheApi));
        return of(CIENTISTAS);
      };
      const apiUrl = this.urlApiServidor();
      if (!apiUrl) return fallback();
      return this.http.get<CientistaResumoApi[]>(`${apiUrl}/cientistas`).pipe(
        map((lista) => lista.map(paraCientista)),
        tap((lista) => this.transferState.set(CHAVE_LISTA_CIENTISTAS, lista.map(paraDetalheApi))),
        catchError(() => fallback()),
      );
    }

    if (this.transferState.hasKey(CHAVE_LISTA_CIENTISTAS)) {
      const lista = this.transferState.get(CHAVE_LISTA_CIENTISTAS, []);
      this.transferState.remove(CHAVE_LISTA_CIENTISTAS);
      return of(lista.map(paraCientista));
    }

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
    return this.filtrar((c) => !!c.dataNascimento && c.dataNascimento >= dataInicio && c.dataNascimento <= dataFim);
  }
  listarPorNacionalidade(nacionalidade: string): Observable<Cientista[]> {
    return this.filtrar((c) => c.nacionalidade === nacionalidade);
  }
  /** Áreas com o total de cientistas de cada uma. */
  listarAreas(): Observable<Area[]> {
    if (isPlatformServer(this.platformId)) {
      const fallback = () => {
        this.transferState.set(CHAVE_LISTA_AREAS, AREAS.map(paraAreaApi));
        return of(AREAS);
      };
      const apiUrl = this.urlApiServidor();
      if (!apiUrl) return fallback();
      return this.http.get<AreaApi[]>(`${apiUrl}/areas`).pipe(
        tap((areas) => this.transferState.set(CHAVE_LISTA_AREAS, areas)),
        map((areas) => areas.map(paraArea)),
        catchError(() => fallback()),
      );
    }

    if (this.transferState.hasKey(CHAVE_LISTA_AREAS)) {
      const areas = this.transferState.get(CHAVE_LISTA_AREAS, []);
      this.transferState.remove(CHAVE_LISTA_AREAS);
      return of(areas.map(paraArea));
    }

    return this.http.get<AreaApi[]>(`${API_URL}/areas`).pipe(map((areas) => areas.map(paraArea)));
  }

  private filtrar(criterio: (cientista: Cientista) => boolean): Observable<Cientista[]> {
    return this.listar().pipe(map((lista) => lista.filter(criterio)));
  }
}
