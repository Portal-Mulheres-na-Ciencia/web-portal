import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { SugerirPage } from './sugerir';

describe('SugerirPage', () => {
  let fixture: ComponentFixture<SugerirPage>;
  let elemento: HTMLElement;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SugerirPage],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(SugerirPage);
    elemento = fixture.nativeElement as HTMLElement;
    http = TestBed.inject(HttpTestingController);
    await fixture.whenStable();
  });

  afterEach(() => http.verify());

  function preencher(campo: string, valor: string) {
    const entrada = elemento.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[formControlName="${campo}"]`)!;
    entrada.value = valor;
    entrada.dispatchEvent(new Event('input'));
  }

  function preencherValido() {
    preencher('nomeCientista', 'Sonia Guimarães');
    preencher('justificativa', 'Primeira mulher negra doutora em física no Brasil.');
    preencher('nomeSugestor', 'Ana');
    preencher('emailSugestor', 'ana@exemplo.com');
    elemento.querySelector<HTMLInputElement>('mat-checkbox input')!.click();
  }

  async function enviar() {
    elemento.querySelector<HTMLButtonElement>('button[type=submit]')!.click();
    await fixture.whenStable();
  }

  it('não deve enviar e deve mostrar as mensagens quando o formulário está vazio', async () => {
    await enviar();

    http.expectNone('/api/sugestoes');
    expect(elemento.textContent).toContain('Informe o nome da cientista.');
    expect(elemento.textContent).toContain('É preciso concordar com o uso dos seus dados');
  });

  it('deve enviar os dados e mostrar a confirmação', async () => {
    preencherValido();
    await enviar();

    const requisicao = http.expectOne('/api/sugestoes');
    expect(requisicao.request.method).toBe('POST');
    expect(requisicao.request.body).toEqual({
      nomeCientista: 'Sonia Guimarães',
      justificativa: 'Primeira mulher negra doutora em física no Brasil.',
      nomeSugestor: 'Ana',
      emailSugestor: 'ana@exemplo.com',
      consentimento: true,
    });
    requisicao.flush({ id: 7, nomeCientista: 'Sonia Guimarães', status: 'PENDENTE', dataSugestao: '2026-11-10T14:00:00', mensagem: 'Sugestão recebida!' }, { status: 201, statusText: 'Created' });
    await fixture.whenStable();

    expect(elemento.textContent).toContain('Sugestão enviada!');
    expect(elemento.textContent).toContain('Sugestão nº 7');
  });

  it('deve mostrar ao lado do campo o erro devolvido pela API', async () => {
    preencherValido();
    await enviar();

    http.expectOne('/api/sugestoes').flush(
      { status: 400, mensagem: 'Confira os campos destacados.', campos: { emailSugestor: 'Informe um e-mail válido.' } },
      { status: 400, statusText: 'Bad Request' },
    );
    await fixture.whenStable();

    expect(elemento.textContent).toContain('Confira os campos destacados.');
    expect(elemento.textContent).toContain('Informe um e-mail válido.');
  });

  it('deve avisar quando a API não responde', async () => {
    preencherValido();
    await enviar();

    http.expectOne('/api/sugestoes').error(new ProgressEvent('error'));
    await fixture.whenStable();

    expect(elemento.textContent).toContain('Não foi possível enviar agora.');
  });
});
