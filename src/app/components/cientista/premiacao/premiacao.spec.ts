import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PremiacaoComponent } from './premiacao';
import { CIENTISTAS } from '../../../services/dados-exemplo';

describe('PremiacaoComponent', () => {
  let fixture: ComponentFixture<PremiacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PremiacaoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PremiacaoComponent);
    fixture.componentRef.setInput('premio', CIENTISTAS[0].premios[0]);
    await fixture.whenStable();
  });

  it('deve exibir prêmio, ano e quem concedeu', () => {
    const texto = (fixture.nativeElement as HTMLElement).textContent;
    expect(texto).toContain('Prêmio Nobel de Física');
    expect(texto).toContain('1903');
    expect(texto).toContain('Academia Real das Ciências da Suécia');
  });
});
