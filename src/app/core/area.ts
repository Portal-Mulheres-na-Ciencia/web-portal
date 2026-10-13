import { Cientista } from './cientista';

export interface Area {
  id: number;
  nome: string;
  descricao: string;

  cientistas: Cientista[];
}
