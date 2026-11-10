import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LinhaDoTempoComponent } from './linha-do-tempo';
import { CIENTISTAS } from '../../../services/dados-exemplo';

describe('LinhaDoTempoComponent', () => {
  let fixture: ComponentFixture<LinhaDoTempoComponent>;
  let elemento: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinhaDoTempoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LinhaDoTempoComponent);
    elemento = fixture.nativeElement as HTMLElement;
  });

  it('deve identificar o tipo de cada marco por texto, não só por cor', async () => {
    const [curie] = CIENTISTAS;
    fixture.componentRef.setInput('itens', [curie.contribuicoes[0], curie.premios[0]]);
    await fixture.whenStable();

    const marcos = elemento.querySelectorAll('li');
    expect(marcos[0].textContent).toContain('Contribuição');
    expect(marcos[1].textContent).toContain('Prêmio');
    expect(marcos[1].classList).toContain('premio');
  });

  it('deve avisar quando não há marcos', async () => {
    fixture.componentRef.setInput('itens', []);
    await fixture.whenStable();
    expect(elemento.textContent).toContain('Nenhum marco cadastrado');
  });
});
