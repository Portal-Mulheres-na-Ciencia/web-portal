import { TestBed } from '@angular/core/testing';
import { MonogramaComponent } from './monograma';

describe('MonogramaComponent', () => {
  async function iniciais(nome: string) {
    const fixture = TestBed.createComponent(MonogramaComponent);
    fixture.componentRef.setInput('nome', nome);
    await fixture.whenStable();
    return (fixture.nativeElement as HTMLElement).textContent?.trim();
  }

  it('usa a primeira e a última palavra, ignorando preposições', async () => {
    expect(await iniciais('Marie Curie')).toBe('MC');
    expect(await iniciais('Nise da Silveira')).toBe('NS');
    expect(await iniciais('Jaqueline Goes de Jesus')).toBe('JJ');
  });
});
