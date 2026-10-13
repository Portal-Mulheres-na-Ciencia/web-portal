import { Cientista } from './cientista';

export interface Contribuicao {
  id: number;
  titulo: string;
  descricao: string;
  ano: Date;
  autores: Cientista[];
  linkReferencia: string;
}
