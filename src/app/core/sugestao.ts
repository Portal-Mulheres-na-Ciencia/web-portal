/** Dados do formulário "Sugerir cientista" (POST /api/sugestoes). */
export interface NovaSugestao {
  nomeCientista: string;
  justificativa: string;
  nomeSugestor: string;
  emailSugestor: string;
  consentimento: boolean;
}

/** Resposta da API quando a sugestão é gravada. */
export interface SugestaoCriada {
  id: number;
  nomeCientista: string;
  status: string;
  dataSugestao: string;
  mensagem: string;
}

/** Erro devolvido pela API; em erros de validação, `campos` traz a mensagem de cada campo. */
export interface ErroApi {
  status: number;
  mensagem: string;
  campos: Record<string, string>;
}
