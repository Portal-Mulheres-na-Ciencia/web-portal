import { Cientista } from '../core/cientista';

/**
 * "1867–1934" para quem já faleceu; "Nascida em 1947" para quem está viva.
 * Sem data de nascimento: "Falecida em 1958" ou texto vazio.
 */
export function periodoDeVida(cientista: Cientista): string {
  const nascimento = cientista.dataNascimento?.getFullYear();
  const falecimento = cientista.dataFalecimento?.getFullYear();
  if (nascimento && falecimento) return `${nascimento}–${falecimento}`;
  if (nascimento) return `Nascida em ${nascimento}`;
  if (falecimento) return `Falecida em ${falecimento}`;
  return '';
}

/** Junta os textos que existem com " · ", ignorando os vazios. */
export function juntarInfo(...partes: (string | undefined | null)[]): string {
  return partes.filter((parte) => !!parte).join(' · ');
}

/** Remove acentos e caixa para que "nise" encontre "Nise" e "dobereiner" encontre "Döbereiner". */
export function normalizarTexto(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('pt-BR')
    .trim();
}

/** Escolhe a mesma cientista durante o dia inteiro e troca no dia seguinte. */
export function cientistaDoDia(cientistas: Cientista[], data = new Date()): Cientista | null {
  if (cientistas.length === 0) return null;
  const dia = Math.floor(
    Date.UTC(data.getFullYear(), data.getMonth(), data.getDate()) / 86_400_000,
  );
  return cientistas[dia % cientistas.length];
}
