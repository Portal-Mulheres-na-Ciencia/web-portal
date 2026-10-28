import { cientistaDoDia, normalizarTexto, periodoDeVida } from './cientista';
import { CIENTISTAS } from '../services/dados-exemplo';

describe('utilitários de cientista', () => {
  it('periodoDeVida trata quem está viva', () => {
    expect(periodoDeVida(CIENTISTAS[0])).toBe('1867–1934');
    const viva = CIENTISTAS.find((c) => !c.dataFalecimento)!;
    expect(periodoDeVida(viva)).toMatch(/^Nascida em \d{4}$/);
  });

  it('normalizarTexto ignora acentos e maiúsculas', () => {
    expect(normalizarTexto('  Döbereiner ')).toBe('dobereiner');
  });

  it('cientistaDoDia é estável no mesmo dia e muda no dia seguinte', () => {
    const manha = cientistaDoDia(CIENTISTAS, new Date(2026, 9, 21, 8));
    const noite = cientistaDoDia(CIENTISTAS, new Date(2026, 9, 21, 22));
    const amanha = cientistaDoDia(CIENTISTAS, new Date(2026, 9, 22, 8));
    expect(manha).toBe(noite);
    expect(amanha).not.toBe(manha);
    expect(cientistaDoDia([])).toBeNull();
  });
});
