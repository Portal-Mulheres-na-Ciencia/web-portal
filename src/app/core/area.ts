import { Cientista } from './cientista';

export interface Area {
  id: number;
  nome: string;
  descricao: string;

  /** Quantas cientistas atuam na área (vem pronto da API em GET /areas). */
  totalCientistas?: number;
  cientistas: Cientista[];
}
