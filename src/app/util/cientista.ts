import { Cientista } from '../core/cientista';

/** "1867–1934" para quem já faleceu; "Nascida em 1947" para quem está viva. */
export function periodoDeVida(cientista: Cientista): string {
  const nascimento = cientista.dataNascimento.getFullYear();
  return cientista.dataFalecimento
    ? `${nascimento}–${cientista.dataFalecimento.getFullYear()}`
    : `Nascida em ${nascimento}`;
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
