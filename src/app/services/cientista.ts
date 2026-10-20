import { Service } from '@angular/core';
import { Cientista } from '../core/cientista';
import { delay, Observable, of } from 'rxjs';

@Service()
export class CientistaService {
  private mockCientista = {
    id: 1,
    areas: [
      { id: 1, nome: 'Física', descricao: '', cientistas: [] },
      { id: 2, nome: 'Química', descricao: '', cientistas: [] },
    ],
    biografia:
      'A primeira mulher a ganhar o premio nobel e revolucionar o estudo da radioatividade.',
    contribuicoes: [
      {
        id: 1,
        ano: 1898,
        titulo: 'Descoberta do Polônio e do Rádio',
        descricao: 'Isolamento de elementos químicos fundamentais para a radioatividade.',
        autores: [],
        linkReferencia: '',
      },
      {
        id: 2,
        ano: 1910,
        titulo: 'Isolamento do Rádio Puro',
        descricao: 'Comprovação definitiva do rádio como elemento metálico puro.',
        autores: [],
        linkReferencia: '',
      },
      {
        id: 3,
        ano: 1915,
        titulo: 'Isolamento do Rádio Puro',
        descricao: 'Comprovação definitiva do rádio como elemento metálico puro.',
        autores: [],
        linkReferencia: '',
      },
    ],
    dataFalecimento: new Date('07/11/1867'),
    dataNascimento: new Date('04/07/1934'),
    instituicao: 'Universidade de Paris',
    nacionalidade: 'Francesa',
    nome: 'Maria Salomea Skłodowska-Curie',
    premios: [
      {
        ano: 1903,
        cientista: null as any,
        premio: {
          id: 1,
          nome: 'Prêmio Nobel de Física',
          concedente: 'Academia Real das Ciências da Suécia',
        },
      },
      {
        ano: 1911,
        cientista: null as any,
        premio: {
          id: 2,
          nome: 'Prêmio Nobel de Química',
          concedente: 'Academia Real das Ciências da Suécia',
        },
      },
      {
        ano: 1912,
        cientista: null as any,
        premio: {
          id: 3,
          nome: 'Prêmio Nobel de Química',
          concedente: 'Academia Real das Ciências da Suécia',
        },
      },
      {
        ano: 1912,
        cientista: null as any,
        premio: {
          id: 3,
          nome: 'Prêmio Nobel de Química',
          concedente: 'Academia Real das Ciências da Suécia',
        },
      },
      {
        ano: 1912,
        cientista: null as any,
        premio: {
          id: 3,
          nome: 'Prêmio Nobel de Química',
          concedente: 'Academia Real das Ciências da Suécia',
        },
      },
      {
        ano: 1912,
        cientista: null as any,
        premio: {
          id: 3,
          nome: 'Prêmio Nobel de Química',
          concedente: 'Academia Real das Ciências da Suécia',
        },
      },
      {
        ano: 1912,
        cientista: null as any,
        premio: {
          id: 3,
          nome: 'Prêmio Nobel de Química',
          concedente: 'Academia Real das Ciências da Suécia',
        },
      },
      {
        ano: 1912,
        cientista: null as any,
        premio: {
          id: 3,
          nome: 'Prêmio Nobel de Química',
          concedente: 'Academia Real das Ciências da Suécia',
        },
      },
    ],
  } as Cientista;

  buscar(idCientista: number): Observable<Cientista | null> {
    return of(this.mockCientista);
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
