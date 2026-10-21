import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NaoEncontradoPage } from './nao-encontrado';

describe('NaoEncontradoPage', () => {
  let component: NaoEncontradoPage;
  let fixture: ComponentFixture<NaoEncontradoPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NaoEncontradoPage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(NaoEncontradoPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve ter atalhos para o início e para o catálogo', () => {
    const elemento = fixture.nativeElement as HTMLElement;
    const links = Array.from(elemento.querySelectorAll('.acoes a')).map((a) =>
      a.getAttribute('href'),
    );
    expect(links).toEqual(['/', '/cientistas']);
  });
});
