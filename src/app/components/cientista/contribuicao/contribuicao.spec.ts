import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContribuicaoComponent } from './contribuicao';
import { Contribuicao } from '../../../core/contribuicao';

describe('ContribuicaoComponent', () => {
  let fixture: ComponentFixture<ContribuicaoComponent>;

  const contribuicao: Contribuicao = {
    id: 1,
    ano: 1918,
    titulo: 'Teorema de Noether',
    descricao: 'Simetrias e leis de conservação.',
    autores: [],
    linkReferencia: '',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContribuicaoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContribuicaoComponent);
  });

  it('deve exibir ano e título', async () => {
    fixture.componentRef.setInput('contribuicao', contribuicao);
    await fixture.whenStable();
    const texto = (fixture.nativeElement as HTMLElement).textContent;
    expect(texto).toContain('1918');
    expect(texto).toContain('Teorema de Noether');
  });

  it('deve mostrar o link da fonte só quando existir, abrindo em nova aba com segurança', async () => {
    fixture.componentRef.setInput('contribuicao', contribuicao);
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).querySelector('a')).toBeNull();

    fixture.componentRef.setInput('contribuicao', { ...contribuicao, linkReferencia: 'https://exemplo.org' });
    await fixture.whenStable();
    const link = (fixture.nativeElement as HTMLElement).querySelector('a');
    expect(link?.getAttribute('target')).toBe('_blank');
    expect(link?.getAttribute('rel')).toContain('noopener');
  });
});
