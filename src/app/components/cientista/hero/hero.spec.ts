import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HeroComponent } from './hero';
import { CIENTISTAS } from '../../../services/dados-exemplo';

describe('HeroComponent', () => {
  let fixture: ComponentFixture<HeroComponent>;
  let elemento: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroComponent);
    fixture.componentRef.setInput('cientista', CIENTISTAS[0]);
    elemento = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('deve exibir nome e anos de vida em ordem cronológica', () => {
    expect(elemento.querySelector('h1')?.textContent).toContain('Marie Curie');
    expect(elemento.querySelector('.meta')?.textContent).toContain('1867–1934');
  });

  it('deve ligar cada área ao catálogo filtrado', () => {
    const links = Array.from(elemento.querySelectorAll('.areas a')).map((a) => a.getAttribute('href'));
    expect(links).toEqual(['/cientistas?area=1', '/cientistas?area=2']);
  });
});
