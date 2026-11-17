import { Area } from './area';
import { PremioRecebido } from './premio-recebido';
import { Contribuicao } from './contribuicao';

export interface Cientista {
  id: number;
  nome: string;
  biografia: string;
  instituicao: string;
  /** Pode faltar quando a data não é conhecida. */
  dataNascimento?: Date;
  dataFalecimento?: Date;
  nacionalidade: string;

  areas: Area[];
  contribuicoes: Contribuicao[];
  premios: PremioRecebido[];
}
