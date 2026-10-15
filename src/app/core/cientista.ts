import { Area } from './area';
import { PremioRecebido } from './premio-recebido';
import { Contribuicao } from './contribuicao';

export interface Cientista {
  id: number;
  nome: string;
  biografia: string;
  instituicao: string;
  dataNascimento: Date;
  dataFalecimento?: Date;
  nacionalidade: string;

  areas: Area[];
  contribuicoes: Contribuicao[];
  premios: PremioRecebido[];
}
