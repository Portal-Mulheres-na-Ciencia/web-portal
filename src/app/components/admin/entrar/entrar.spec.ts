import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { EntrarPage } from './entrar';

describe('EntrarPage', () => {
  let fixture: ComponentFixture<EntrarPage>;
  let elemento: HTMLElement;
  let http: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntrarPage],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(EntrarPage);
    elemento = fixture.nativeElement as HTMLElement;
    http = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    await fixture.whenStable();
  });

  afterEach(() => http.verify());

  function preencher(campo: string, valor: string) {
    const entrada = elemento.querySelector<HTMLInputElement>(`[formControlName="${campo}"]`)!;
    entrada.value = valor;
    entrada.dispatchEvent(new Event('input'));
  }

  async function enviar() {
    elemento.querySelector<HTMLButtonElement>('button[type=submit]')!.click();
    await fixture.whenStable();
  }

  it('não deve chamar a API com o formulário vazio', async () => {
    await enviar();

    http.expectNone('/api/auth/login');
    expect(elemento.textContent).toContain('Informe o seu e-mail.');
    expect(elemento.textContent).toContain('Informe a sua senha.');
  });

  it('deve avisar quando o e-mail ou a senha estão errados', async () => {
    preencher('email', 'equipe@portal.local');
    preencher('senha', 'errada');
    await enviar();

    http.expectOne('/api/auth/login').flush({}, { status: 401, statusText: 'Unauthorized' });
    await fixture.whenStable();

    expect(elemento.textContent).toContain('E-mail ou senha incorretos.');
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  it('deve entrar e voltar para a página que a pessoa tentou abrir', async () => {
    fixture.componentRef.setInput('voltar', '/admin/sugestoes');
    preencher('email', 'equipe@portal.local');
    preencher('senha', 'certa');
    await enviar();

    http.expectOne('/api/auth/login').flush({ id: 1, nome: 'Equipe', email: 'equipe@portal.local' });
    await fixture.whenStable();

    expect(router.navigateByUrl).toHaveBeenCalledWith('/admin/sugestoes');
  });

  it('não deve voltar para endereços de fora da área da equipe', async () => {
    fixture.componentRef.setInput('voltar', 'https://site-estranho.com');
    preencher('email', 'equipe@portal.local');
    preencher('senha', 'certa');
    await enviar();

    http.expectOne('/api/auth/login').flush({ id: 1, nome: 'Equipe', email: 'equipe@portal.local' });
    await fixture.whenStable();

    expect(router.navigateByUrl).toHaveBeenCalledWith('/admin');
  });
});
