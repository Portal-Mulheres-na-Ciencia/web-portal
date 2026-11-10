import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CabecalhoComponent } from './cabecalho';

describe('CabecalhoComponent', () => {
  it('deve ter link para pular ao conteúdo e a navegação principal', async () => {
    await TestBed.configureTestingModule({
      imports: [CabecalhoComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(CabecalhoComponent);
    await fixture.whenStable();
    const elemento = fixture.nativeElement as HTMLElement;

    expect(elemento.querySelector('a')?.getAttribute('href')).toBe('#conteudo');
    const links = Array.from(elemento.querySelectorAll('nav a')).map((a) => a.getAttribute('href'));
    expect(links).toEqual(['/', '/cientistas']);
  });
});
