import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RodapeComponent } from './rodape';

describe('RodapeComponent', () => {
  let fixture: ComponentFixture<RodapeComponent>;
  let elemento: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RodapeComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(RodapeComponent);
    elemento = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('deve criar', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('deve listar todos os integrantes da equipe', () => {
    const integrantes = elemento.querySelectorAll('.equipe li');
    expect(integrantes.length).toBe(6);
  });

  it('deve ter links de navegação para início e catálogo', () => {
    const links = Array.from(elemento.querySelectorAll('nav a')).map((a) => a.getAttribute('href'));
    expect(links).toEqual(['/', '/cientistas']);
  });
});
