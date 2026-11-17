/** Tipos da área da equipe (veja docs/API.md no repositório api-portal). */

export type StatusSugestao = 'PENDENTE' | 'APROVADA' | 'RECUSADA';

/** Sugestão como a equipe vê: inclui o e-mail de quem sugeriu, para responder. */
export interface SugestaoAdmin {
  id: number;
  nomeCientista: string;
  justificativa: string;
  nomeSugestor: string;
  emailSugestor: string;
  /** Data no formato AAAA-MM-DD. */
  dataSugestao: string;
  status: StatusSugestao;
  revisor: string | null;
  idCientista: number | null;
}

export interface ContribuicaoForm {
  /** Vazio quando a contribuição é nova. */
  id: number | null;
  titulo: string;
  descricao: string;
  ano: number | null;
  linkReferencia: string;
}

export interface PremioRecebidoForm {
  idPremio: number | null;
  ano: number | null;
}

/** Corpo enviado para cadastrar ou editar uma cientista. */
export interface CientistaForm {
  nome: string;
  biografia: string;
  instituicao: string;
  /** Datas no formato AAAA-MM-DD, ou vazio. */
  dataNascimento: string | null;
  dataFalecimento: string | null;
  nacionalidade: string;
  idsAreas: number[];
  contribuicoes: ContribuicaoForm[];
  premios: PremioRecebidoForm[];
  /** Preenchido quando o cadastro nasce de uma sugestão. */
  idSugestao: number | null;
}
