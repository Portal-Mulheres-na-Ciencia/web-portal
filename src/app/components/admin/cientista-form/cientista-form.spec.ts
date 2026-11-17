import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { CientistaFormPage } from './cientista-form';

const AREAS = [
  { id: 1, nome: 'Física', descricao: '', totalCientistas: 2 },
  { id: 2, nome: 'Química', descricao: '', totalCientistas: 1 },
];
const PREMIOS = [{ id: 7, nome: 'Prêmio Nobel de Física', concedente: 'Academia Real' }];
const CURIE = {
  id: 1,
  nome: 'Marie Curie',
  biografia: 'Física e química.',
  instituicao: 'Universidade de Paris',
  dataNascimento: '1867-11-07',
  dataFalecimento: '1934-07-04',
  nacionalidade: 'Polonesa e francesa',
  areasAtuacao: [{ id: 1, nome: 'Física' }],
  contribuicoes: [{ id: 3, ano: 1898, titulo: 'Polônio e rádio', descricao: 'Novos elementos.', linkReferencia: null }],
  premios: [{ id: 7, nome: 'Prêmio Nobel de Física', concedente: 'Academia Real', ano: 1903 }],
};

describe('CientistaFormPage', () => {
  let fixture: ComponentFixture<CientistaFormPage>;
  let elemento: HTMLElement;
  let http: HttpTestingController;
  let router: Router;

  async function abrir(entradas: { id?: string; sugestao?: string } = {}) {
    await TestBed.configureTestingModule({
      imports: [CientistaFormPage],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(CientistaFormPage);
    elemento = fixture.nativeElement as HTMLElement;
    http = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    for (const [nome, valor] of Object.entries(entradas)) {
      fixture.componentRef.setInput(nome, valor);
    }
    fixture.detectChanges();
    http.expectOne('/api/areas').flush(AREAS);
    http.expectOne('/api/admin/premios').flush(PREMIOS);
  }

  afterEach(() => http.verify());

  function preencher(seletor: string, valor: string) {
    const entrada = elemento.querySelector<HTMLInputElement | HTMLTextAreaElement>(seletor)!;
    entrada.value = valor;
    entrada.dispatchEvent(new Event('input'));
  }

  async function salvar() {
    elemento.querySelector<HTMLButtonElement>('button[type=submit]')!.click();
    await fixture.whenStable();
  }

  it('não deve salvar sem nome, biografia e área', async () => {
    await abrir();
    await fixture.whenStable();
    await salvar();

    http.expectNone('/api/admin/cientistas');
    expect(elemento.textContent).toContain('Informe o nome da cientista.');
    expect(elemento.textContent).toContain('Escreva a biografia.');
    expect(elemento.textContent).toContain('Escolha pelo menos uma área.');
  });

  it('deve cadastrar com área e contribuição e voltar para a lista', async () => {
    await abrir();
    await fixture.whenStable();
    preencher('[formControlName="nome"]', 'Sonia Guimarães');
    preencher('[formControlName="biografia"]', 'Física brasileira.');
    elemento.querySelector<HTMLInputElement>('.areas mat-checkbox input')!.click();
    elemento.querySelectorAll<HTMLButtonElement>('fieldset button')[0].click();
    await fixture.whenStable();
    preencher('[formControlName="titulo"]', 'Doutorado em física');
    await salvar();

    const requisicao = http.expectOne('/api/admin/cientistas');
    expect(requisicao.request.method).toBe('POST');
    expect(requisicao.request.body).toEqual(
      expect.objectContaining({
        nome: 'Sonia Guimarães',
        idsAreas: [1],
        dataNascimento: null,
        idSugestao: null,
        contribuicoes: [{ id: null, titulo: 'Doutorado em física', descricao: '', ano: null, linkReferencia: '' }],
        premios: [],
      }),
    );
    requisicao.flush({ ...CURIE, id: 12, nome: 'Sonia Guimarães' }, { status: 201, statusText: 'Created' });
    await fixture.whenStable();

    expect(router.navigate).toHaveBeenCalledWith(['/admin/cientistas']);
  });

  it('deve preencher os dados na edição e enviar com PUT', async () => {
    await abrir({ id: '1' });
    http.expectOne('/api/cientistas/1').flush(CURIE);
    await fixture.whenStable();

    expect(elemento.querySelector<HTMLInputElement>('[formControlName="nome"]')!.value).toBe('Marie Curie');
    expect(elemento.querySelector<HTMLInputElement>('[formControlName="titulo"]')!.value).toBe('Polônio e rádio');
    await salvar();

    const requisicao = http.expectOne('/api/admin/cientistas/1');
    expect(requisicao.request.method).toBe('PUT');
    expect(requisicao.request.body.contribuicoes[0].id).toBe(3);
    expect(requisicao.request.body.premios).toEqual([{ idPremio: 7, ano: 1903 }]);
    requisicao.flush(CURIE);
  });

  it('deve mostrar no campo certo o erro devolvido pela API', async () => {
    await abrir({ id: '1' });
    http.expectOne('/api/cientistas/1').flush(CURIE);
    await fixture.whenStable();
    await salvar();

    http.expectOne('/api/admin/cientistas/1').flush(
      {
        status: 400,
        mensagem: 'Confira os campos destacados.',
        campos: { 'contribuicoes[0].titulo': 'Use no máximo 200 caracteres.' },
      },
      { status: 400, statusText: 'Bad Request' },
    );
    await fixture.whenStable();

    expect(elemento.textContent).toContain('Confira os campos destacados.');
    expect(elemento.textContent).toContain('Use no máximo 200 caracteres.');
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('deve começar com o nome da sugestão e enviar o número dela', async () => {
    await abrir({ sugestao: '5' });
    http.expectOne((r) => r.url === '/api/admin/sugestoes').flush([
      {
        id: 5,
        nomeCientista: 'Sonia Guimarães',
        justificativa: 'Primeira mulher negra doutora em física no Brasil.',
        nomeSugestor: 'Ana',
        emailSugestor: 'ana@exemplo.com',
        dataSugestao: '2026-11-10',
        status: 'PENDENTE',
        revisor: null,
        idCientista: null,
      },
    ]);
    await fixture.whenStable();

    expect(elemento.textContent).toContain('Cadastro a partir da sugestão nº 5');
    expect(elemento.querySelector<HTMLInputElement>('[formControlName="nome"]')!.value).toBe('Sonia Guimarães');
  });
});
