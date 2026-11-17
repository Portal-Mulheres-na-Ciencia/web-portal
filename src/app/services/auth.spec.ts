import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;
  const equipe = { id: 1, nome: 'Equipe do Portal', email: 'equipe@portal.local' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('deve guardar quem entrou', async () => {
    const resposta = firstValueFrom(service.entrar('equipe@portal.local', 'senha'));
    const requisicao = http.expectOne('/api/auth/login');
    expect(requisicao.request.method).toBe('POST');
    expect(requisicao.request.body).toEqual({ email: 'equipe@portal.local', senha: 'senha' });
    requisicao.flush(equipe);

    await resposta;
    expect(service.usuario()).toEqual(equipe);
  });

  it('deve responder true quando a sessão ainda vale', async () => {
    const resposta = firstValueFrom(service.verificarSessao());
    http.expectOne('/api/auth/eu').flush(equipe);

    expect(await resposta).toBe(true);
    expect(service.usuario()?.nome).toBe('Equipe do Portal');
  });

  it('deve responder false, sem erro, quando não há sessão', async () => {
    const resposta = firstValueFrom(service.verificarSessao());
    http.expectOne('/api/auth/eu').flush({ status: 401 }, { status: 401, statusText: 'Unauthorized' });

    expect(await resposta).toBe(false);
    expect(service.usuario()).toBeNull();
  });

  it('deve esquecer o usuário ao sair', async () => {
    service.usuario.set(equipe);
    const resposta = firstValueFrom(service.sair(), { defaultValue: undefined });
    http.expectOne('/api/auth/logout').flush(null, { status: 204, statusText: 'No Content' });

    await resposta;
    expect(service.usuario()).toBeNull();
  });
});
