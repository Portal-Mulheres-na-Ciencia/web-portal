import { Cientista } from './cientista';

export interface Contribuicao {
  id: number;
  ano: number;
  titulo: string;
  descricao: string;
  autores: Cientista[];
  linkReferencia: string;
}
