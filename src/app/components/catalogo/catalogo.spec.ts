import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CatalogoPage } from './catalogo';
import { cientistaServiceFalso } from '../../testes/cientista-service-falso';
import { CIENTISTAS } from '../../services/dados-exemplo';

describe('CatalogoPage', () => {
  let fixture: ComponentFixture<CatalogoPage>;
  let elemento: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogoPage],
      providers: [provideRouter([]), cientistaServiceFalso],
    }).compileComponents();

    fixture = TestBed.createComponent(CatalogoPage);
    elemento = fixture.nativeElement as HTMLElement;
  });

  async function filtrar(filtros: { busca?: string; area?: string }) {
    fixture.componentRef.setInput('busca', filtros.busca);
    fixture.componentRef.setInput('area', filtros.area);
    await fixture.whenStable();
  }

  const cards = () => elemento.querySelectorAll('app-card-cientista');
  const contagem = () => elemento.querySelector('.contagem')?.textContent?.replace(/\s+/g, ' ').trim();

  it('deve listar todas as cientistas sem filtros', async () => {
    await filtrar({});
    expect(cards().length).toBe(CIENTISTAS.length);
    expect(contagem()).toBe(`${CIENTISTAS.length} cientistas encontradas`);
  });

  it('deve buscar ignorando acentos e maiúsculas', async () => {
    await filtrar({ busca: 'DOBEREINER' });
    expect(cards().length).toBe(1);
    expect(contagem()).toBe('1 cientista encontrada');
  });

  it('deve filtrar por área', async () => {
    await filtrar({ area: '5' });
    const esperado = CIENTISTAS.filter((c) => c.areas.some((a) => a.id === 5)).length;
    expect(cards().length).toBe(esperado);
    expect(contagem()).toContain('em Matemática');
  });

  it('deve mostrar estado vazio com opção de limpar filtros', async () => {
    await filtrar({ busca: 'nenhuma-cientista' });
    expect(cards().length).toBe(0);
    expect(elemento.querySelector('app-estado-vazio')?.textContent).toContain('Limpar filtros');
  });
});
