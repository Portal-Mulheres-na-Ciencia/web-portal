import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { NOME_SITE } from '../../titulo-pagina';
import { CientistaPage } from './cientista';
import { cientistaServiceFalso, cientistaServiceForaDoAr } from '../../testes/cientista-service-falso';

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

  it('deve atualizar as tags Open Graph e restaurá-las ao sair da página', async () => {
    const meta = TestBed.inject(Meta);
    const title = TestBed.inject(Title);

    fixture.componentRef.setInput('id', 1);
    await fixture.whenStable();

    const tituloEsperado = `Marie Curie · ${NOME_SITE}`;
    expect(title.getTitle()).toBe(tituloEsperado);
    expect(meta.getTag('property="og:title"')?.content).toBe(tituloEsperado);
    expect(meta.getTag('property="og:type"')?.content).toBe('profile');
    expect(meta.getTag('property="og:url"')?.content).toBe('/cientista/1');
    expect(meta.getTag('property="og:image"')?.content).toBe('/og-padrao.png');
    expect(meta.getTag('name="twitter:title"')?.content).toBe(tituloEsperado);

    fixture.destroy();
    expect(meta.getTag('property="og:title"')?.content).toBe(NOME_SITE);
    expect(meta.getTag('property="og:type"')?.content).toBe('website');
  });

  it('deve informar quando a cientista não existe', async () => {
    fixture.componentRef.setInput('id', 999);
    await fixture.whenStable();

    expect(elemento.querySelector('app-estado-vazio')?.textContent).toContain(
      'Cientista não encontrada',
    );
  });
});

describe('CientistaPage com a API fora do ar', () => {
  it('deve avisar o erro em vez de dizer que a cientista não existe', async () => {
    await TestBed.configureTestingModule({
      imports: [CientistaPage],
      providers: [provideRouter([]), cientistaServiceForaDoAr],
    }).compileComponents();
    const fixture = TestBed.createComponent(CientistaPage);
    fixture.componentRef.setInput('id', 1);
    await fixture.whenStable();

    const texto = (fixture.nativeElement as HTMLElement).textContent;
    expect(texto).toContain('Não foi possível carregar os dados');
    expect(texto).not.toContain('Cientista não encontrada');
  });
});
