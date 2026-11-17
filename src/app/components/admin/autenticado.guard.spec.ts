import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, provideRouter, RouterStateSnapshot, UrlTree } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { AuthService } from '../../services/auth';
import { autenticadoGuard } from './autenticado.guard';

describe('autenticadoGuard', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  function executar(url: string) {
    return TestBed.runInInjectionContext(() =>
      autenticadoGuard({} as ActivatedRouteSnapshot, { url } as RouterStateSnapshot),
    );
  }

  it('deve deixar passar quem já está logado, sem chamar a API', () => {
    TestBed.inject(AuthService).usuario.set({ id: 1, nome: 'Equipe', email: 'equipe@portal.local' });

    expect(executar('/admin')).toBe(true);
  });

  it('deve mandar para a tela de entrar, guardando a página pedida, quando não há sessão', async () => {
    const resultado = firstValueFrom(executar('/admin/sugestoes') as Observable<boolean | UrlTree>);
    http.expectOne('/api/auth/eu').flush({}, { status: 401, statusText: 'Unauthorized' });

    const destino = (await resultado) as UrlTree;
    expect(destino.toString()).toBe('/admin/entrar?voltar=%2Fadmin%2Fsugestoes');
  });

  it('deve deixar passar quando a API confirma a sessão', async () => {
    const resultado = firstValueFrom(executar('/admin') as Observable<boolean | UrlTree>);
    http.expectOne('/api/auth/eu').flush({ id: 1, nome: 'Equipe', email: 'equipe@portal.local' });

    expect(await resultado).toBe(true);
  });
});
