import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { CientistaService, lerData } from './cientista';

describe('CientistaService', () => {
  let service: CientistaService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CientistaService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('deve converter a lista da API para o modelo do site', async () => {
    const resposta = firstValueFrom(service.listar());
    http.expectOne('/api/cientistas').flush([
      {
        id: 1,
        nome: 'Marie Curie',
        resumoBiografia: 'Pioneira da radioatividade…',
        instituicao: 'Universidade de Paris',
        dataNascimento: '1867-11-07',
        dataFalecimento: '1934-07-04',
        nacionalidade: 'Polonesa e francesa',
        areasAtuacao: [{ id: 1, nome: 'Física' }],
      },
    ]);

    const [curie] = await resposta;
    expect(curie.biografia).toBe('Pioneira da radioatividade…');
    expect(curie.dataNascimento.getFullYear()).toBe(1867);
    expect(curie.dataFalecimento?.getDate()).toBe(4);
    expect(curie.areas[0].nome).toBe('Física');
  });

  it('deve trazer o perfil com contribuições e prêmios', async () => {
    const resposta = firstValueFrom(service.buscar(1));
    http.expectOne('/api/cientistas/1').flush({
      id: 1,
      nome: 'Marie Curie',
      biografia: 'Biografia completa.',
      instituicao: 'Universidade de Paris',
      dataNascimento: '1867-11-07',
      dataFalecimento: null,
      nacionalidade: 'Polonesa e francesa',
      areasAtuacao: [],
      contribuicoes: [{ id: 1, ano: 1898, titulo: 'Polônio', descricao: 'Novo elemento.', linkReferencia: null }],
      premios: [{ id: 1, nome: 'Nobel de Física', concedente: 'Academia Real', ano: 1903 }],
    });

    const curie = await resposta;
    expect(curie?.dataFalecimento).toBeUndefined();
    expect(curie?.contribuicoes[0].linkReferencia).toBe('');
    expect(curie?.premios[0].premio.nome).toBe('Nobel de Física');
    expect(curie?.premios[0].ano).toBe(1903);
  });

  it('deve devolver null quando a cientista não existe (404)', async () => {
    const resposta = firstValueFrom(service.buscar(999));
    http.expectOne('/api/cientistas/999').flush({ mensagem: 'Cientista não encontrada.' }, { status: 404, statusText: 'Not Found' });

    expect(await resposta).toBeNull();
  });

  it('deve repassar outros erros para a tela avisar o visitante', async () => {
    const resposta = firstValueFrom(service.buscar(1));
    http.expectOne('/api/cientistas/1').flush(null, { status: 500, statusText: 'Erro' });

    await expect(resposta).rejects.toBeTruthy();
  });

  it('deve trazer as áreas com o total de cientistas', async () => {
    const resposta = firstValueFrom(service.listarAreas());
    http.expectOne('/api/areas').flush([{ id: 3, nome: 'Biologia', descricao: 'Seres vivos.', totalCientistas: 6 }]);

    const [biologia] = await resposta;
    expect(biologia.totalCientistas).toBe(6);
  });

  it('lerData não sofre deslocamento de fuso horário', () => {
    const data = lerData('1867-11-07')!;
    expect([data.getFullYear(), data.getMonth(), data.getDate()]).toEqual([1867, 10, 7]);
    expect(lerData(null)).toBeUndefined();
  });
});
