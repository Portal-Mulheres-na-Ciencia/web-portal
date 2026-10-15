import { Premio } from './premio';
import { Cientista } from './cientista';

export interface PremioRecebido{
  cientista: Cientista;
  premio: Premio;
  ano: number;
}
