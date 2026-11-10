import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CientistaPage } from './cientista';
import { cientistaServiceFalso } from '../../testes/cientista-service-falso';

describe('CientistaPage', () => {
  let fixture: ComponentFixture<CientistaPage>;
  let elemento: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CientistaPage],
      providers: [provideRouter([]), cientistaServiceFalso],
    }).compileComponents();

    fixture = TestBed.createComponent(CientistaPage);
    elemento = fixture.nativeElement as HTMLElement;
  });

  it('deve exibir o perfil com contribuições, prêmios e linha do tempo', async () => {
    fixture.componentRef.setInput('id', 1);
    await fixture.whenStable();

    expect(elemento.querySelector('h1')?.textContent).toContain('Marie Curie');
    expect(elemento.querySelectorAll('app-contribuicao').length).toBe(2);
    expect(elemento.querySelectorAll('app-premiacao').length).toBe(2);
    expect(elemento.querySelectorAll('app-linha-do-tempo li').length).toBe(4);
  });

  it('deve informar quando a cientista não existe', async () => {
    fixture.componentRef.setInput('id', 999);
    await fixture.whenStable();

    expect(elemento.querySelector('app-estado-vazio')?.textContent).toContain(
      'Cientista não encontrada',
    );
  });
});
