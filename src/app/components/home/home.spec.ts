import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HomePage } from './home';
import { cientistaServiceFalso } from '../../testes/cientista-service-falso';

describe('HomePage', () => {
  let fixture: ComponentFixture<HomePage>;
  let elemento: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [provideRouter([]), cientistaServiceFalso],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    elemento = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('deve criar', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('deve destacar uma cientista do dia com link para o perfil', () => {
    const link = elemento.querySelector('.do-dia a');
    expect(elemento.querySelector('.nome-do-dia')?.textContent?.trim()).toBeTruthy();
    expect(link?.getAttribute('href')).toMatch(/^\/cientista\/\d+$/);
  });

  it('deve listar todas as áreas com atalho para o catálogo filtrado', () => {
    const links = elemento.querySelectorAll('.area');
    expect(links.length).toBe(6);
    expect(links[0].getAttribute('href')).toBe('/cientistas?area=1');
  });
});
